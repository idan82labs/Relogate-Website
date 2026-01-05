# Figma Design Rules

## Source of Truth

- **Figma URLs**: `docs/design/figma_urls.md`
- **Local cache**: `docs/design/figma_cache/<slug>/`
- Do NOT copy/paste URLs into these rules; always reference the source file

## Workflow

### 1. Select a Layer
Pick a single layer/frame URL from `docs/design/figma_urls.md` for your task.

### 2. Check Cache First
Before calling Figma MCP:
```
docs/design/figma_cache/<slug>/
├── meta.json          # Node info, version, retrievedAt
├── meta.raw.json      # Full API response
├── render@2x.png      # Screenshot at 2x scale
└── design_context.md  # Optional: MCP design context output
```

If cache exists and is fresh (check `meta.json.version` against current file version), use cached data.

### 3. Fetch via MCP (if needed)
Only call Figma MCP tools when:
- Cache doesn't exist for this node
- Design has been updated (version mismatch)
- You need live design context not in cache

MCP tools available:
- `mcp__figma__get_screenshot` - Render node as image
- `mcp__figma__get_design_context` - Get layout/styling code hints
- `mcp__figma__get_metadata` - Get node structure in XML

### 4. Update Cache
After fetching, run:
```bash
npm run figma:cache              # Cache all URLs
npm run figma:cache:one <slug>   # Cache single entry
```

## Implementation Guidelines

### Match the Design
- Exact spacing, typography, colors from Figma
- Use design tokens from `globals.css` when they match
- OK to use exact hex values if no matching token exists

### Reuse Existing Components
Check `src/components/shared/` before creating new:
- `Button` - Primary, secondary, outline, ghost variants
- `Card` - Basic card container
- `Accordion` - Expandable FAQ-style component
- `Icon` - SVG icon wrapper
- `GlobeWatermark` - Decorative background element

### Content
- All text goes in `src/content/he.ts`
- Match Figma labels to content keys
- RTL text alignment is default

### Responsive
- Design mobile and desktop variants separately
- Use `lg:` breakpoint for desktop styles
- Desktop frames at 1440px max-width

## Figma URL Format

URLs follow this pattern:
```
https://www.figma.com/design/<file_key>/<file_name>?node-id=<node_id>&m=dev
```

Example from this project:
```
file_key: 9iC5uUBVU3QoX9XIByWgB4
node_id: 270-1598 (encoded as 270:1598 in API)
```

## Cache Slug Format

Slugs are derived from: `<label>_<file_key>_<node_id>`

Example:
- URL label: "mobile header without"
- Slug: `mobile-header-without_9iC5uUBVU3QoX9XIByWgB4_270-1598`
