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
  worker/      Rust Cloudflare Worker (workers-rs)
```

- **Frontend**: SPA with lazy-loaded tool components, dark mode, responsive design
- **Worker**: Rust compiled to WASM via worker-build, serves API endpoints
- **Static assets**: Served via Cloudflare's edge asset serving
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
| Worker | Rust, workers-rs, WebAssembly |
| Deployment | Cloudflare Workers, Wrangler |
| CI/CD | GitHub Actions |

## Prerequisites

- Bun 1.0+
- Rust toolchain with `wasm32-unknown-unknown` target
- Wrangler CLI (`bun add -g wrangler`)

```bash
rustup target add wasm32-unknown-unknown
cargo install worker-build
```

## Development

```bash
# Install frontend dependencies
cd apps/frontend && bun install

# Start frontend dev server
bun run dev

# Start worker dev server (from project root)
bun run preview
```

## Build

```bash
# Build everything
bun run build

# Build frontend only
bun run build:frontend

# Build worker only
bun run build:worker
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

GitHub Actions automatically deploys on push to `worker-main`. Set these repository secrets:

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
