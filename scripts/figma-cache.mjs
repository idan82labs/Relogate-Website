#!/usr/bin/env node

/**
 * Figma Cache Script
 *
 * Fetches Figma node screenshots and saves them to the local cache directory.
 * Requires FIGMA_TOKEN environment variable.
 *
 * Usage:
 *   npm run figma:cache -- --url "https://www.figma.com/design/..."
 *   npm run figma:cache -- --url "..." --label "mobile HP1" --section "Homepage" --platform "Mobile"
 *   npm run figma:cache -- --all  (fetches all URLs from figma_urls.md)
 *   npm run figma:cache -- --list (lists all available URLs)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(ROOT_DIR, 'docs', 'design', 'figma_cache');
const URLS_FILE = path.join(ROOT_DIR, 'docs', 'design', 'figma_urls.md');
const ENV_FILE = path.join(ROOT_DIR, '.env');

/**
 * Load environment variables from .env file
 */
function loadEnvFile() {
  if (!fs.existsSync(ENV_FILE)) {
    return;
  }

  const content = fs.readFileSync(ENV_FILE, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    // Skip comments and empty lines
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Parse KEY=VALUE
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.substring(0, eqIndex).trim();
    let value = trimmed.substring(eqIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Only set if not already in environment
    if (!process.env[key] && value) {
      process.env[key] = value;
    }
  }
}

// Load .env file before anything else
loadEnvFile();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Parse Figma URL to extract fileKey and nodeId
 */
function parseFigmaUrl(url) {
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  const fileKey = pathParts[2]; // /design/<fileKey>/...
  const nodeIdParam = urlObj.searchParams.get('node-id');
  const nodeId = nodeIdParam ? nodeIdParam.replace('-', ':') : null;

  return { fileKey, nodeId };
}

/**
 * Generate cache slug from label, fileKey, and nodeId
 */
function generateSlug(label, fileKey, nodeId) {
  const sanitizedLabel = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const sanitizedNodeId = nodeId.replace(':', '-');
  return `${sanitizedLabel}_${fileKey}_${sanitizedNodeId}`;
}

/**
 * Fetch image from URL using https
 */
function fetchImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        fetchImage(response.headers.location).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Fetch screenshot from Figma API
 */
async function fetchFigmaScreenshot(fileKey, nodeId, token) {
  const apiUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`;

  return new Promise((resolve, reject) => {
    const req = https.request(apiUrl, {
      method: 'GET',
      headers: {
        'X-Figma-Token': token,
      },
    }, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.err) {
            reject(new Error(json.err));
            return;
          }
          const imageUrl = json.images?.[nodeId];
          if (!imageUrl) {
            reject(new Error(`No image URL returned for node ${nodeId}`));
            return;
          }
          resolve(imageUrl);
        } catch (e) {
          reject(e);
        }
      });
      response.on('error', reject);
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Parse figma_urls.md to extract all URLs with their metadata
 */
function parseUrlsFile() {
  const content = fs.readFileSync(URLS_FILE, 'utf-8');
  const lines = content.split('\n');

  const urls = [];
  let currentSection = '';
  let currentPlatform = '';

  for (const line of lines) {
    // Match section headers (## Section)
    const sectionMatch = line.match(/^## (.+)$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      continue;
    }

    // Match platform headers (### Platform)
    const platformMatch = line.match(/^### (.+)$/);
    if (platformMatch) {
      currentPlatform = platformMatch[1].trim();
      continue;
    }

    // Match URL entries (- label: url)
    const urlMatch = line.match(/^- ([^:]+):\s*(https:\/\/www\.figma\.com\/design\/[^\s]+)/);
    if (urlMatch) {
      const label = urlMatch[1].trim();
      const url = urlMatch[2].trim();

      // Skip NOT IMPLEMENTED entries
      if (line.includes('(NOT IMPLEMENTED)')) {
        continue;
      }

      urls.push({
        label,
        url,
        section: currentSection,
        platform: currentPlatform,
      });
    }
  }

  return urls;
}

/**
 * Cache a single Figma node
 */
async function cacheNode({ url, label, section, platform, token }) {
  const { fileKey, nodeId } = parseFigmaUrl(url);

  if (!fileKey || !nodeId) {
    throw new Error(`Invalid Figma URL: ${url}`);
  }

  const slug = generateSlug(label, fileKey, nodeId);
  const cacheDir = path.join(CACHE_DIR, slug);
  const imagePath = path.join(cacheDir, 'render@2x.png');
  const metaPath = path.join(cacheDir, 'meta.json');

  // Check if already cached
  if (fs.existsSync(imagePath)) {
    log(`  Skipping (already cached): ${label}`, 'dim');
    return { slug, skipped: true };
  }

  log(`  Fetching: ${label}...`, 'blue');

  // Create cache directory
  fs.mkdirSync(cacheDir, { recursive: true });

  // Fetch screenshot URL from Figma API
  const imageUrl = await fetchFigmaScreenshot(fileKey, nodeId, token);

  // Download the actual image
  const imageBuffer = await fetchImage(imageUrl);

  // Save image
  fs.writeFileSync(imagePath, imageBuffer);

  // Save metadata
  const meta = {
    url,
    fileKey,
    nodeId,
    label,
    section,
    platform,
    slug,
    retrievedAt: new Date().toISOString(),
  };
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  log(`  Cached: ${slug}`, 'green');
  return { slug, skipped: false };
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  // Handle --help flag first (no token needed)
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    log('\nFigma Cache Script', 'blue');
    log('==================\n', 'blue');
    log('Usage:', 'yellow');
    log('  npm run figma:cache -- --list', 'reset');
    log('    List all available Figma URLs from figma_urls.md\n', 'dim');
    log('  npm run figma:cache -- --all', 'reset');
    log('    Fetch and cache all Figma URLs\n', 'dim');
    log('  npm run figma:cache -- --url "https://..."', 'reset');
    log('    Cache a specific Figma URL\n', 'dim');
    log('  npm run figma:cache -- --url "..." --label "name" --section "Section" --platform "Mobile"', 'reset');
    log('    Cache with custom metadata\n', 'dim');
    log('Environment:', 'yellow');
    log('  FIGMA_TOKEN - Required for fetching (get from Figma Settings > Personal access tokens)\n', 'reset');
    return;
  }

  // Handle --list flag (no token needed)
  if (args.includes('--list')) {
    const urls = parseUrlsFile();
    log('\nAvailable Figma URLs:\n', 'blue');

    let currentSection = '';
    for (const { label, section, platform, url } of urls) {
      if (section !== currentSection) {
        currentSection = section;
        log(`\n${section}:`, 'yellow');
      }
      log(`  [${platform}] ${label}`, 'reset');
      log(`    ${url}`, 'dim');
    }
    log(`\nTotal: ${urls.length} URLs\n`, 'green');
    return;
  }

  // Check for FIGMA_TOKEN
  const token = process.env.FIGMA_TOKEN;

  // Check token for operations that need it
  if (!token) {
    log('\nError: FIGMA_TOKEN environment variable is required.', 'red');
    log('\nTo get a Figma token:', 'yellow');
    log('  1. Go to Figma > Settings > Account', 'reset');
    log('  2. Scroll to "Personal access tokens"', 'reset');
    log('  3. Generate a new token', 'reset');
    log('  4. Set it: export FIGMA_TOKEN="your-token-here"\n', 'reset');
    process.exit(1);
  }

  // Handle --all flag
  if (args.includes('--all')) {
    const urls = parseUrlsFile();
    log(`\nCaching ${urls.length} Figma nodes...\n`, 'blue');

    let cached = 0;
    let skipped = 0;
    let errors = 0;

    for (const entry of urls) {
      try {
        const result = await cacheNode({ ...entry, token });
        if (result.skipped) {
          skipped++;
        } else {
          cached++;
        }
        // Rate limit: wait 1 second between requests
        await new Promise(r => setTimeout(r, 1000));
      } catch (error) {
        log(`  Error caching ${entry.label}: ${error.message}`, 'red');
        errors++;
      }
    }

    log(`\nDone! Cached: ${cached}, Skipped: ${skipped}, Errors: ${errors}`, 'green');
    return;
  }

  // Handle --url flag
  const urlIndex = args.indexOf('--url');
  if (urlIndex !== -1 && args[urlIndex + 1]) {
    const url = args[urlIndex + 1];

    // Get optional metadata
    const labelIndex = args.indexOf('--label');
    const sectionIndex = args.indexOf('--section');
    const platformIndex = args.indexOf('--platform');

    const label = labelIndex !== -1 ? args[labelIndex + 1] : 'custom';
    const section = sectionIndex !== -1 ? args[sectionIndex + 1] : 'Custom';
    const platform = platformIndex !== -1 ? args[platformIndex + 1] : 'Unknown';

    try {
      await cacheNode({ url, label, section, platform, token });
      log('\nDone!', 'green');
    } catch (error) {
      log(`\nError: ${error.message}`, 'red');
      process.exit(1);
    }
    return;
  }

  // Unknown arguments - show help
  log('\nUnknown command. Run with --help for usage.\n', 'yellow');
}

main().catch((error) => {
  log(`\nUnexpected error: ${error.message}`, 'red');
  process.exit(1);
});
