use chrono::NaiveDate;
use std::path::PathBuf;

#[derive(Debug, Clone)]
pub struct Config {
    pub num_versions: usize,
    pub rust_releases_url: String,
    pub repo_owner: String,
    pub repo_name: String,
    pub epoch_date: NaiveDate,
    pub releases_json_path: PathBuf,
    pub public_redirects_path: PathBuf,
    pub stabilization_search_terms: Vec<&'static str>,
}

impl Config {
    pub fn new() -> Self {
        let releases_json_path = std::env::var("VERSION_RS_RELEASES_JSON")
            .map(PathBuf::from)
            .unwrap_or_else(|_| PathBuf::from("astro/src/data/releases.json"));

        let public_redirects_path = std::env::var("VERSION_RS_PUBLIC_REDIRECTS")
            .map(PathBuf::from)
            .unwrap_or_else(|_| PathBuf::from("astro/public/_redirects"));

        Self {
            num_versions: 5,
            rust_releases_url: "https://raw.githubusercontent.com/rust-lang/rust/stable/RELEASES.md".to_string(),
            repo_owner: "rust-lang".to_string(),
            repo_name: "rust".to_string(),
            epoch_date: NaiveDate::from_ymd_opt(2015, 12, 10).unwrap(),
            releases_json_path,
            public_redirects_path,
            stabilization_search_terms: vec!["stabilise", "stabilize", "stabilisation", "stabilization"],
        }
    }
}

impl Default for Config {
    fn default() -> Self {
        Self::new()
    }
}
