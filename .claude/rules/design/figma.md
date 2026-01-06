# Figma Design Rules

## Source of Truth

- **Figma URLs**: `docs/design/figma_urls.md`
- **Local cache**: `docs/design/figma_cache/<slug>/`
- Do NOT copy/paste URLs into these rules; always reference the source file

## Cache Management (Agent-Managed)

The Claude agent is responsible for managing the Figma cache directly using MCP tools.

**No token setup required** - Figma MCP authentication is handled through Claude's settings.

### Cache Directory Structure

```
docs/design/figma_cache/<slug>/
├── meta.json          # Curated metadata
├── render@2x.png      # Screenshot (base64 decoded from MCP response)
└── design_context.md  # Design context from MCP (optional)
```

### Slug Format

Create slugs from the label in `figma_urls.md`:
```
<sanitized-label>_<file_key>_<node_id>
```

**Sanitization rules:**
- Lowercase the label
- Replace non-alphanumeric characters with hyphens
- Remove leading/trailing hyphens
- Replace `:` in node_id with `-`

**Example:**
- Label: `mobile HP2`
- File key: `9iC5uUBVU3QoX9XIByWgB4`
- Node ID: `276:4579` → `276-4579`
- Slug: `mobile-hp2_9iC5uUBVU3QoX9XIByWgB4_276-4579`

## Workflow

### Step 1: Parse the Figma URL

Extract from URL `https://www.figma.com/design/<file_key>/<name>?node-id=<node_id>&m=dev`:
- `fileKey`: The file identifier
- `nodeId`: Convert URL format `123-456` to API format `123:456`

### Step 2: Check Cache

Before calling any Figma MCP tool:

1. Compute the slug from the label and URL
2. Check if `docs/design/figma_cache/<slug>/render@2x.png` exists
3. If it exists, read the cached screenshot instead of calling MCP
4. If it doesn't exist, proceed to fetch and cache

### Step 3: Fetch and Cache (when cache miss)

When cache doesn't exist or refresh is needed:

1. **Get screenshot** using `mcp__figma__get_screenshot`:
   ```
   fileKey: <extracted_file_key>
   nodeId: <extracted_node_id>
   ```

2. **Save the screenshot**:
   - The MCP tool returns base64-encoded image data
   - Decode and save to `docs/design/figma_cache/<slug>/render@2x.png`
   - Use Bash with base64 decoding:
     ```bash
     echo "<base64_data>" | base64 -d > docs/design/figma_cache/<slug>/render@2x.png
     ```

3. **Create meta.json**:
   ```json
   {
     "url": "<original_figma_url>",
     "fileKey": "<file_key>",
     "nodeId": "<node_id>",
     "label": "<label_from_urls_file>",
     "slug": "<computed_slug>",
     "retrievedAt": "<ISO_timestamp>"
   }
   ```

4. **Optionally save design context**:
   - If `mcp__figma__get_design_context` is called, save output to `design_context.md`

### Step 4: Use Cached Data

When cache exists:
- Read `render@2x.png` directly using the Read tool to view the design
- Use the cached image for implementation reference
- No need to call Figma MCP tools

## MCP Tools Reference

Only call these when cache is missing:

- `mcp__figma__get_screenshot` - Render node as PNG image
- `mcp__figma__get_design_context` - Get layout/styling code hints
- `mcp__figma__get_metadata` - Get node structure in XML

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
node_id: 270-1598 (API format: 270:1598)
```

## Quick Reference: Cache Check Flow

```
1. User asks to implement Figma design
2. Find URL in docs/design/figma_urls.md
3. Parse: fileKey, nodeId, label
4. Compute slug
5. IF docs/design/figma_cache/<slug>/render@2x.png exists:
     → Read cached image, skip MCP call
   ELSE:
     → Call mcp__figma__get_screenshot
     → Create cache directory: mkdir -p docs/design/figma_cache/<slug>
     → Save screenshot as render@2x.png
     → Save meta.json with metadata
6. Implement design based on screenshot
```
