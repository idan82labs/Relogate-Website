#!/usr/bin/env node
/**
 * Figma Layer Cache Script
 *
 * Fetches screenshots and metadata for Figma nodes listed in docs/design/figma_urls.md
 * Stores results in docs/design/figma_cache/<slug>/
 *
 * Usage:
 *   npm run figma:cache           # Cache all URLs
 *   npm run figma:cache:one <id>  # Cache single entry by slug or index
 *
 * Environment:
 *   FIGMA_TOKEN - Personal access token from Figma
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const URLS_FILE = join(ROOT_DIR, "docs/design/figma_urls.md");
const CACHE_DIR = join(ROOT_DIR, "docs/design/figma_cache");

// ============================================================================
// Helpers
// ============================================================================

function log(msg) {
  console.log(`[figma-cache] ${msg}`);
}

function error(msg) {
  console.error(`[figma-cache] ERROR: ${msg}`);
}

/**
 * Parse Figma URL and extract file_key and node_id
 * URL format: https://www.figma.com/design/<file_key>/<name>?node-id=<node_id>&...
 */
function parseFigmaUrl(url) {
  const match = url.match(
    /figma\.com\/(?:design|file)\/([^/]+)\/[^?]*\?.*node-id=([^&]+)/
  );
  if (!match) return null;

  const fileKey = match[1];
  // node-id in URL is formatted as "123-456", API expects "123:456"
  const nodeId = match[2].replace("-", ":");

  return { fileKey, nodeId };
}

/**
 * Create a URL-safe slug from label, fileKey, and nodeId
 */
function createSlug(label, fileKey, nodeId) {
  const sanitizedLabel = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const sanitizedNodeId = nodeId.replace(":", "-");
  return `${sanitizedLabel}_${fileKey}_${sanitizedNodeId}`;
}

/**
 * Parse figma_urls.md and return array of entries
 * Supports formats:
 *   - "label: https://..."
 *   - "- label: https://..."
 *   - "https://..." (no label)
 */
function parseUrlsFile() {
  if (!existsSync(URLS_FILE)) {
    error(`URLs file not found: ${URLS_FILE}`);
    process.exit(1);
  }

  const content = readFileSync(URLS_FILE, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());
  const entries = [];

  for (const line of lines) {
    // Match "label: url" or "- label: url" or just "url"
    const labelMatch = line.match(
      /^[-*]?\s*([^:]+):\s*(https:\/\/[^\s]+)/
    );
    const urlOnlyMatch = line.match(/^[-*]?\s*(https:\/\/[^\s]+)/);

    let label, url;
    if (labelMatch) {
      label = labelMatch[1].trim();
      url = labelMatch[2].trim();
    } else if (urlOnlyMatch) {
      url = urlOnlyMatch[1].trim();
      label = `entry-${entries.length + 1}`;
    } else {
      continue; // Skip non-matching lines
    }

    const parsed = parseFigmaUrl(url);
    if (!parsed) {
      log(`Skipping invalid URL: ${url}`);
      continue;
    }

    const slug = createSlug(label, parsed.fileKey, parsed.nodeId);
    entries.push({
      label,
      url,
      fileKey: parsed.fileKey,
      nodeId: parsed.nodeId,
      slug,
    });
  }

  return entries;
}

/**
 * Make HTTPS request and return JSON response
 */
function fetchJson(url, token) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "X-Figma-Token": token,
      },
    };

    https
      .get(url, options, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Invalid JSON response: ${e.message}`));
          }
        });
      })
      .on("error", reject);
  });
}

/**
 * Download image from URL and save to file
 */
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = require("node:fs").createWriteStream(destPath);

    https
      .get(url, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
          return;
        }

        if (res.statusCode !== 200) {
          file.close();
          reject(new Error(`HTTP ${res.statusCode} downloading image`));
          return;
        }

        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        file.close();
        reject(err);
      });
  });
}

// ============================================================================
// Main Cache Functions
// ============================================================================

/**
 * Fetch metadata for a Figma node
 */
async function fetchNodeMetadata(fileKey, nodeId, token) {
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`;
  return fetchJson(url, token);
}

/**
 * Fetch rendered image URL for a Figma node
 */
async function fetchImageUrl(fileKey, nodeId, token) {
  const url = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`;
  return fetchJson(url, token);
}

/**
 * Cache a single entry
 */
async function cacheEntry(entry, token, force = false) {
  const cacheDir = join(CACHE_DIR, entry.slug);
  const metaPath = join(cacheDir, "meta.json");
  const metaRawPath = join(cacheDir, "meta.raw.json");
  const imagePath = join(cacheDir, "render@2x.png");

  // Check if cache exists and is fresh
  if (!force && existsSync(metaPath)) {
    try {
      const existingMeta = JSON.parse(readFileSync(metaPath, "utf-8"));

      // Fetch current file version to compare
      const fileInfoUrl = `https://api.figma.com/v1/files/${entry.fileKey}?depth=1`;
      const fileInfo = await fetchJson(fileInfoUrl, token);
      const currentVersion = fileInfo.version;

      if (existingMeta.version === currentVersion) {
        log(`Cache fresh for: ${entry.label} (version ${currentVersion})`);
        return { skipped: true };
      }
      log(`Cache stale for: ${entry.label} (${existingMeta.version} -> ${currentVersion})`);
    } catch (e) {
      log(`Cache check failed, will refresh: ${e.message}`);
    }
  }

  log(`Caching: ${entry.label}`);

  // Create cache directory
  mkdirSync(cacheDir, { recursive: true });

  // Fetch node metadata
  log(`  Fetching metadata...`);
  const metaResponse = await fetchNodeMetadata(entry.fileKey, entry.nodeId, token);

  // Extract node info
  const nodeData = metaResponse.nodes?.[entry.nodeId];
  if (!nodeData) {
    throw new Error(`Node not found: ${entry.nodeId}`);
  }

  // Save raw metadata
  writeFileSync(metaRawPath, JSON.stringify(metaResponse, null, 2));

  // Create curated metadata
  const meta = {
    url: entry.url,
    fileKey: entry.fileKey,
    nodeId: entry.nodeId,
    label: entry.label,
    slug: entry.slug,
    nodeName: nodeData.document?.name || "Unknown",
    nodeType: nodeData.document?.type || "Unknown",
    lastModified: metaResponse.lastModified,
    version: metaResponse.version,
    retrievedAt: new Date().toISOString(),
  };

  writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  log(`  Saved metadata`);

  // Fetch and download image
  log(`  Fetching image URL...`);
  const imageResponse = await fetchImageUrl(entry.fileKey, entry.nodeId, token);
  const imageUrl = imageResponse.images?.[entry.nodeId];

  if (!imageUrl) {
    throw new Error(`No image URL returned for node: ${entry.nodeId}`);
  }

  log(`  Downloading image...`);
  await downloadImage(imageUrl, imagePath);
  log(`  Saved render@2x.png`);

  return { cached: true, meta };
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    error("FIGMA_TOKEN environment variable is required");
    error("Get your token from: https://www.figma.com/developers/api#access-tokens");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const filteredArgs = args.filter((a) => a !== "--force");

  const entries = parseUrlsFile();
  log(`Found ${entries.length} entries in ${URLS_FILE}`);

  // Ensure cache directory exists
  mkdirSync(CACHE_DIR, { recursive: true });

  if (filteredArgs.length > 0) {
    // Cache single entry by slug or index
    const identifier = filteredArgs[0];
    const entry =
      entries.find((e) => e.slug === identifier) ||
      entries[parseInt(identifier, 10)];

    if (!entry) {
      error(`Entry not found: ${identifier}`);
      log("\nAvailable entries:");
      entries.forEach((e, i) => log(`  [${i}] ${e.slug}`));
      process.exit(1);
    }

    try {
      await cacheEntry(entry, token, force);
      log(`Done: ${entry.slug}`);
    } catch (e) {
      error(`Failed to cache ${entry.label}: ${e.message}`);
      process.exit(1);
    }
  } else {
    // Cache all entries
    let cached = 0;
    let skipped = 0;
    let failed = 0;

    for (const entry of entries) {
      try {
        const result = await cacheEntry(entry, token, force);
        if (result.skipped) {
          skipped++;
        } else {
          cached++;
        }
      } catch (e) {
        error(`Failed to cache ${entry.label}: ${e.message}`);
        failed++;
      }
    }

    log(`\nSummary: ${cached} cached, ${skipped} skipped (fresh), ${failed} failed`);
  }
}

main().catch((e) => {
  error(e.message);
  process.exit(1);
});
