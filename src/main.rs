use anyhow::Result;
use chrono::Utc;
use semver::Version;
use std::collections::{HashMap, HashSet};
use version_rs::{ChangelogGenerator, Config, GitHubClient, JsonWriter, VersionManager};

#[tokio::main]
async fn main() -> Result<()> {
    let config = Config::new();
    let version_manager = VersionManager::new(config.clone());
    let github_client = GitHubClient::new(config.clone());
    let changelog_generator = ChangelogGenerator::new(version_manager.clone());
    let json_writer = JsonWriter::new(config.clone());

    json_writer.setup_directories()?;

    println!("Fetching RELEASES.md from {}...", config.rust_releases_url);
    let body = reqwest::get(&config.rust_releases_url)
        .await?
        .error_for_status()?
        .text()
        .await?;

    let changelogs = version_manager.parse_changelogs(&body);
    println!("Parsed {} released versions", changelogs.len());

    let milestones = github_client.fetch_milestones().await?;
    println!("Fetched {} milestones", milestones.len());

    let stabilization_prs = github_client.fetch_stabilization_prs().await?;
    println!("Fetched {} stabilization PRs", stabilization_prs.len());

    let released_versions: HashSet<_> = changelogs
        .iter()
        .filter(|(_, (_, date))| *date <= Utc::now().naive_utc().date())
        .map(|(k, _)| k.clone())
        .collect();

    let issues_versions: HashSet<_> = milestones.keys().cloned().collect();
    let unreleased_versions: HashSet<_> = issues_versions.difference(&released_versions).collect();

    // Fetch issues for each unreleased version
    let mut milestone_issues: HashMap<Version, Vec<octocrab::models::issues::Issue>> = HashMap::new();
    for (version, milestone) in milestones.iter() {
        if unreleased_versions.contains(version) {
            let issues = github_client.fetch_milestone_issues(milestone.number).await?;
            milestone_issues.insert(version.clone(), issues);
        }
    }

    let output = changelog_generator.build_releases_output(
        &changelogs,
        stabilization_prs,
        &unreleased_versions,
        &milestones,
        &milestone_issues,
    );

    json_writer.write_releases_json(&output)?;
    json_writer.write_redirects(&output)?;

    println!("Done! Wrote:");
    println!("  🔢 {}", config.releases_json_path.display());
    println!("  🔀 {}", config.public_redirects_path.display());
    println!("  Stable: {}", output.current_versions.stable);
    println!("  Beta:   {}", output.current_versions.beta);
    println!("  Nightly: {}", output.current_versions.nightly);
    println!("  {} total releases", output.releases.len());
    println!("  {} stabilization PRs", output.stabilization_prs.len());

    Ok(())
}
