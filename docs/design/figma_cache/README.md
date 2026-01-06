# Figma Layer Cache

Local cache of Figma screenshots and metadata for development.

## Agent-Managed Cache

The Claude agent automatically manages this cache using Figma MCP tools.

**No token setup or scripts required** - MCP authentication is handled through Claude Code settings.

### How it works:

1. **Before fetching from Figma**: Agent checks if `<slug>/render@2x.png` exists
2. **On cache hit**: Agent reads the cached image directly (no MCP call)
3. **On cache miss**: Agent fetches via MCP and saves to this directory

## Directory Structure

```
docs/design/figma_cache/
└── <slug>/
    ├── meta.json         # Metadata (url, nodeId, label, retrievedAt)
    ├── render@2x.png     # Screenshot at 2x scale
    └── design_context.md # (Optional) MCP design context output
```

### Slug Format

```
<sanitized-label>_<file_key>_<node_id>
```

Example:
- Label: `mobile HP2`
- Slug: `mobile-hp2_9iC5uUBVU3QoX9XIByWgB4_276-4579`

### meta.json Contents

```json
{
  "url": "https://www.figma.com/design/...",
  "fileKey": "9iC5uUBVU3QoX9XIByWgB4",
  "nodeId": "276:4579",
  "label": "mobile HP2",
  "slug": "mobile-hp2_9iC5uUBVU3QoX9XIByWgB4_276-4579",
  "retrievedAt": "2025-01-06T14:30:00Z"
}
```

## Git Strategy

By default, this directory is gitignored (local-only caching).

**To share cache with team:**
1. Remove `docs/design/figma_cache/` from `.gitignore`
2. Commit cache files
3. Team members can use cached data without additional setup
