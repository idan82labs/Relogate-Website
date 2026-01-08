# Figma Design Rules

## Source of Truth

- **Figma URLs**: `docs/design/figma_urls.md` (organized by Section > Platform > Label)
- **Local cache**: `docs/design/figma_cache/<slug>/`
- Do NOT copy/paste URLs into these rules; always reference the source file

## Finding URLs

The `figma_urls.md` file is organized hierarchically:

```
## Section (e.g., Homepage, Header, Personal Area)
### Platform (Mobile / Desktop)
- label: <url>
```

When user asks to implement a design:
1. Identify the section (Homepage, Personal Area, etc.)
2. Identify the platform (Mobile or Desktop)
3. Find the specific label under that section/platform

## Cache Management

The Figma cache stores screenshots locally to reduce API calls and speed up development.

### Cache Directory Structure

```
docs/design/figma_cache/<slug>/
├── meta.json          # Curated metadata
├── render@2x.png      # Screenshot at 2x resolution
└── design_context.md  # Design context (optional)
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
- File key: `oa59PKkSQjmx05hyltKc4W`
- Node ID: `276:4579` → `276-4579`
- Slug: `mobile-hp2_oa59PKkSQjmx05hyltKc4W_276-4579`

## Populating the Cache

### Using the Cache Script (Recommended)

The `figma-cache.mjs` script uses the Figma REST API to download and cache screenshots.

**Setup:**
1. Get a Figma Personal Access Token:
   - Go to Figma > Settings > Account
   - Scroll to "Personal access tokens"
   - Generate a new token
2. Set the environment variable:
   ```bash
   export FIGMA_TOKEN="your-token-here"
   ```

**Commands:**
```bash
# List all available URLs from figma_urls.md
npm run figma:cache -- --list

# Cache all URLs (respects rate limits with 1s delay between requests)
npm run figma:cache -- --all

# Cache a specific URL
npm run figma:cache -- --url "https://www.figma.com/design/..." --label "mobile HP1" --section "Homepage" --platform "Mobile"
```

**Note:** The script skips already-cached items and respects rate limits automatically.

### MCP Limitations

**IMPORTANT:** The Figma MCP tools (`mcp__figma__get_screenshot`, etc.) return visual images that are displayed inline but **cannot be saved to files** by the AI agent. This is a technical limitation of how MCP renders images.

**Recommended workflow:**
1. If cache exists: Use cached images
2. If cache is empty: Ask user to run `npm run figma:cache -- --all` to populate
3. For one-off designs: Use MCP tools directly (view but don't cache)

## Agent Workflow

### Step 1: Check Cache First

Before calling any Figma MCP tool:

1. Compute the slug from the label and URL
2. Check if `docs/design/figma_cache/<slug>/render@2x.png` exists
3. If it exists: Read the cached screenshot using the Read tool
4. If it doesn't exist: Either:
   - Ask user to run `npm run figma:cache` to populate cache, OR
   - Use MCP tools directly (knowing images won't be saved)

### Step 2: Use MCP When Needed

When cache doesn't exist and immediate reference is needed:

1. **Get screenshot** using `mcp__figma__get_screenshot`:
   ```
   fileKey: <extracted_file_key>
   nodeId: <extracted_node_id>
   ```

2. The image will be displayed inline for reference but won't be persisted.

### Step 3: Use Cached Data

When cache exists:
- Read `render@2x.png` directly using the Read tool to view the design
- Use the cached image for implementation reference
- No need to call Figma MCP tools

## MCP Tools Reference

Only call these when cache is missing:

- `mcp__figma__get_screenshot` - Render node as PNG image
- `mcp__figma__get_design_context` - Get layout/styling code hints
- `mcp__figma__get_metadata` - Get node structure in XML

### Rate Limits

**IMPORTANT: Figma MCP has a rate limit of 10 requests per minute.**

- Plan your MCP calls carefully to stay within this limit
- Always check the cache first before making MCP calls
- When verifying multiple URLs, space out requests or batch verification across sessions
- If you hit a rate limit error, wait at least 1 minute before retrying
- For bulk operations (like fetching metadata for multiple nodes), make requests incrementally

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
file_key: El5UXWl6BAyyV3TVPrArik
node_id: 276-9761 (API format: 276:9761)
```

## Quick Reference: Cache Check Flow

```
1. User asks to implement Figma design
2. Find URL in docs/design/figma_urls.md:
   → Navigate: Section (Homepage, Personal Area, etc.) > Platform (Mobile/Desktop) > Label
3. Parse: fileKey, nodeId, label, section, platform
4. Compute slug: <sanitized-label>_<file_key>_<node_id>
5. IF docs/design/figma_cache/<slug>/render@2x.png exists:
     → Read cached image using Read tool, skip MCP call
   ELSE:
     → Option A: Ask user to run `npm run figma:cache -- --all`
     → Option B: Call mcp__figma__get_screenshot for immediate view (won't persist)
6. Implement design based on screenshot/MCP output
```
