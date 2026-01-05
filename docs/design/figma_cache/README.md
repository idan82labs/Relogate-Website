# Figma Layer Cache

Local cache of Figma screenshots and metadata for development.

## Setup

1. Get a Figma Personal Access Token:
   - Go to Figma > Account Settings > Personal Access Tokens
   - Generate a new token with read access

2. Set environment variable:
   ```bash
   export FIGMA_TOKEN="your-token-here"
   ```

   Or create a `.env` file in the project root:
   ```
   FIGMA_TOKEN=your-token-here
   ```

## Usage

### Cache All URLs

```bash
npm run figma:cache
```

This reads `docs/design/figma_urls.md` and caches each entry.

### Cache Single Entry

```bash
# By slug
npm run figma:cache:one mobile-header-without_9iC5uUBVU3QoX9XIByWgB4_270-1598

# By index (0-based)
npm run figma:cache:one 0
```

### Force Refresh

```bash
npm run figma:cache -- --force
npm run figma:cache:one 0 -- --force
```

## Output Structure

```
docs/design/figma_cache/
└── <slug>/
    ├── meta.json         # Curated metadata (url, nodeId, version, etc.)
    ├── meta.raw.json     # Full API response
    ├── render@2x.png     # Screenshot at 2x scale
    └── design_context.md # (Optional) MCP design context output
```

### meta.json Contents

```json
{
  "url": "https://www.figma.com/design/...",
  "fileKey": "9iC5uUBVU3QoX9XIByWgB4",
  "nodeId": "270:1598",
  "label": "mobile header without",
  "slug": "mobile-header-without_9iC5uUBVU3QoX9XIByWgB4_270-1598",
  "nodeName": "Mobile Header",
  "nodeType": "FRAME",
  "lastModified": "2025-01-05T12:00:00Z",
  "version": "123456789",
  "retrievedAt": "2025-01-05T14:30:00Z"
}
```

## When to Re-run

- After design updates in Figma
- When `meta.json.version` is stale (script checks automatically)
- After adding new URLs to `figma_urls.md`

## Git Strategy

By default, this directory is gitignored (local-only caching).

**To share cache with team:**
1. Remove `docs/design/figma_cache/` from `.gitignore`
2. Commit cache files
3. Team members can use cached data without Figma tokens

**Trade-offs:**
- Shared: Faster onboarding, no token needed for basic work
- Local-only: Smaller repo, always-fresh data, requires token

## Troubleshooting

### "FIGMA_TOKEN environment variable is required"
Set your token as described in Setup.

### "Node not found"
The node-id may have changed in Figma. Update `figma_urls.md` with current URL.

### "HTTP 403"
Your token may have expired or lack permissions. Generate a new one.

### "Cache stale" but you want to skip
Use the current cache anyway for development; run `--force` only when needed.
