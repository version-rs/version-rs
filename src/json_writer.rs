use crate::config::Config;
use anyhow::Result;
use serde::Serialize;
use std::fs;

#[derive(Debug, Serialize)]
pub struct ReleaseData {
    pub version: String,
    pub date: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_unreleased: Option<bool>,
    pub changelog_md: String,
    pub weight: u64,
    pub branch_date: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub release_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub issues: Option<Vec<IssueEntry>>,
}

#[derive(Debug, Serialize)]
pub struct IssueEntry {
    pub title: String,
    pub number: u64,
    pub html_url: String,
    pub days_ago: i64,
}

#[derive(Debug, Serialize)]
pub struct StabilizationPrEntry {
    pub title: String,
    pub number: u64,
    pub url: String,
    pub updated_at: String,
    pub labels: Vec<LabelEntry>,
    pub days_old: i64,
}

#[derive(Debug, Serialize)]
pub struct LabelEntry {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct CurrentVersions {
    pub stable: String,
    pub beta: String,
    pub nightly: String,
}

#[derive(Debug, Serialize)]
pub struct ReleasesOutput {
    pub releases: Vec<ReleaseData>,
    pub stabilization_prs: Vec<StabilizationPrEntry>,
    pub current_versions: CurrentVersions,
}

#[derive(Debug)]
pub struct JsonWriter {
    config: Config,
}

impl JsonWriter {
    pub fn new(config: Config) -> Self {
        Self { config }
    }

    pub fn setup_directories(&self) -> Result<()> {
        if let Some(parent) = self.config.releases_json_path.parent() {
            fs::create_dir_all(parent)?;
        }
        if let Some(parent) = self.config.public_redirects_path.parent() {
            fs::create_dir_all(parent)?;
        }
        Ok(())
    }

    pub fn write_releases_json(&self, output: &ReleasesOutput) -> Result<()> {
        let json = serde_json::to_string_pretty(output)?;
        fs::write(&self.config.releases_json_path, json)?;
        println!("Wrote {}", self.config.releases_json_path.display());
        Ok(())
    }

    pub fn write_redirects(&self, output: &ReleasesOutput) -> Result<()> {
        let content = format!(
            "/stable   /v/{stable}   302\n/beta     /v/{beta}   302\n/nightly  /v/{nightly}   302\n",
            stable = output.current_versions.stable,
            beta = output.current_versions.beta,
            nightly = output.current_versions.nightly,
        );
        fs::write(&self.config.public_redirects_path, &content)?;
        println!("Wrote {}", self.config.public_redirects_path.display());

        Ok(())
    }
}
