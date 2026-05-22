# version-rs

Generates the pages at https://version.rs/.

Rust compiler release tracker. Tracks Rust releases, changelogs, upcoming milestones, and stabilization PRs.

> The Rust data pipeline is based on [releases-rs](https://github.com/releases-rs/releases-rs).

## Architecture

```
Rust CLI (pre-commit) ──► JSON files ──► Astro build ──► Cloudflare Pages
```

## Quick Start

### With Nix

```bash
nix develop
```

### Without Nix

Ensure Rust and Node.js 22+ are installed.

```bash
# Build and run the Rust CLI to generate data
cargo run

# Install frontend deps and start dev server
cd astro
pnpm install
pnpm run dev
```

### Data Pipeline

1. Run `cargo run` in the project root — fetches release data and writes JSON to `astro/src/data/`
2. Commit the JSON files
3. CI builds and deploys the Astro site to Cloudflare Pages

## Project Structure

```
version-rs/
├── src/              # Rust CLI source
├── astro/            # Astro frontend
│   ├── src/
│   │   ├── data/     # Committed JSON data files
│   │   ├── pages/    # Site pages
│   │   ├── components/  # React/Astro components
│   │   └── layouts/   # Page layouts
│   └── public/       # Static assets
├── flake.nix         # Nix dev shell
└── Cargo.toml        # Rust project config
```
