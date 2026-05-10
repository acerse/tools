# CF Tools - Developer Utilities

Fast, privacy-friendly developer tools running on Cloudflare's edge network. All processing happens in-browser for maximum privacy and speed.

## Features

**17 developer tools** across three categories:

### Text / Encoding
- JSON Formatter & Validator
- Base64 Encode/Decode
- URL Encode/Decode
- HTML Escape/Unescape
- UUID Generator
- Password Generator

### Developer Tools
- JWT Decoder
- Regex Tester
- SHA-256 Generator
- MD5 Generator
- Timestamp Converter
- HTTP Status Lookup

### Extra Utilities
- QR Code Generator
- Case Converter
- Diff Checker
- Line Sorter
- Duplicate Line Remover

## Architecture

```
apps/
  frontend/    Vite + React + TypeScript + TailwindCSS
```

- **Frontend**: SPA with lazy-loaded tool components, dark mode, responsive design
- **Static assets**: Served via Cloudflare's edge asset serving with SPA fallback
- **Tool registry**: Centralized registry pattern for easy tool addition

### Adding a New Tool

1. Create `apps/frontend/src/tools/your-tool/index.tsx`
2. Add entry to `apps/frontend/src/tools/registry.ts`
3. Done - routing, sidebar, and search are automatic

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite, React 19, TypeScript, TailwindCSS |
| Package Manager | Bun |
| Deployment | Cloudflare Workers (Static Assets), Wrangler |
| CI/CD | GitHub Actions |

## Prerequisites

- Bun 1.0+
- Wrangler CLI (`bun add -g wrangler`)

## Development

```bash
# Install dependencies
cd apps/frontend && bun install

# Start dev server
bun run dev
```

## Build

```bash
bun run build
```

## Deployment

```bash
# Authenticate with Cloudflare
wrangler login

# Deploy to production
bun run deploy
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | API token with Workers edit permission |

### Custom Domain

Add to `wrangler.toml`:

```toml
routes = [
  { pattern = "tools.yourdomain.com", custom_domain = true }
]
```

## CI/CD

GitHub Actions automatically deploys on push to `main`. Set these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Design Principles

- **Privacy first**: All processing in-browser, no data leaves the client
- **Edge-native**: Served from Cloudflare's global network
- **Minimal JS**: Lazy-loaded components, code-split by tool
- **Accessible**: Keyboard navigation, semantic HTML, ARIA labels
- **Mobile-first**: Responsive design with collapsible sidebar
- **Dark mode**: System-aware with manual toggle

## License

MIT
