{
  description = "Development environment for version-rs (Rust release tracker)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    rust-overlay,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      overlays = [(import rust-overlay)];
      pkgs = import nixpkgs {
        inherit system overlays;
        config.allowUnfree = true;
      };

      rustToolchain = pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain.toml;
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          # Rust toolchain
          rustToolchain

          # Node.js for Astro frontend
          nodejs_22
          pnpm

          # Git for shellHook
          git

          # SSL libraries for reqwest/rustls/ring
          openssl
          pkg-config
        ];
        shellHook = ''
          # Create cache directories
          export PROJECT_ROOT="$(git rev-parse --git-common-dir | xargs dirname | xargs realpath)"
          mkdir -p "$PROJECT_ROOT/.cache"

          # Set data directory for Rust CLI
          export VERSION_RS_RELEASES_JSON="$PROJECT_ROOT/astro/src/data/releases.json"
          export VERSION_RS_PUBLIC_REDIRECTS="$PROJECT_ROOT/astro/public/_redirects"

          echo "🚀 version-rs development environment loaded!"
          echo ""
          echo "Language runtimes:"
          echo "  - 🦀 Rust:    $(rustc --version 2>/dev/null || echo 'not found')"
          echo "  - 🐢 Node.js: $(node --version 2>/dev/null || echo 'not found')"
          echo "  - 📦 pnpm:    $(pnpm --version 2>/dev/null || echo 'not found')"
          echo ""
          echo "Releases JSON: 📄 $VERSION_RS_RELEASES_JSON"
          echo "Public redirects: 📄 $VERSION_RS_PUBLIC_REDIRECTS"
          echo ""
        '';
      };
    });
}
