use crate::json_writer::{IssueEntry, LabelEntry, ReleaseData, ReleasesOutput, StabilizationPrEntry};
use crate::version_manager::VersionManager;
use chrono::{NaiveDate, Utc};
use itertools::Itertools;
use octocrab::models::issues::Issue;
use octocrab::models::IssueId;
use semver::Version;
use std::collections::{HashMap, HashSet};

#[derive(Debug)]
pub struct ChangelogGenerator {
    version_manager: VersionManager,
}

impl ChangelogGenerator {
    pub fn new(version_manager: VersionManager) -> Self {
        Self { version_manager }
    }

    pub fn build_releases_output(
        &self,
        changelogs: &HashMap<Version, (String, NaiveDate)>,
        stabilization_prs: HashMap<IssueId, Issue>,
        unreleased_versions: &HashSet<&Version>,
        _milestones: &HashMap<Version, octocrab::models::Milestone>,
        milestone_issues: &HashMap<Version, Vec<Issue>>,
    ) -> ReleasesOutput {
        let (stable_version, beta_version, nightly_version) = self.version_manager.get_current_versions(changelogs);
        let now = Utc::now().naive_utc().date();

        let mut releases: Vec<ReleaseData> = Vec::new();

        // Process released versions
        for (version, (changelog, release_date)) in changelogs.iter() {
            let dates = self.version_manager.calculate_release_date(*release_date - chrono::Duration::days(1), 1);
            let _is_patch = version.patch != 0;
            
            releases.push(ReleaseData {
                version: version.to_string(),
                date: release_date.format("%Y-%m-%d").to_string(),
                is_unreleased: Some(false),
                changelog_md: changelog.clone(),
                weight: self.version_manager.determine_weight(version),
                branch_date: dates.branch_date.format("%Y-%m-%d").to_string(),
                url: Some(format!("https://blog.rust-lang.org/{}/Rust-{}.html", 
                    release_date.format("%Y/%m/%d"), version)),
                release_name: None,
                issues: None,
            });
        }

        // Process unreleased versions
        for version in unreleased_versions.iter() {
            let release_name = if version.minor == stable_version.minor + 2 {
                Some("nightly".to_string())
            } else if version.minor == stable_version.minor + 1 {
                Some("beta".to_string())
            } else {
                None
            };

            let incr = (version.minor - stable_version.minor) as u32;
            let dates = self.version_manager.calculate_release_date(now, incr);

            let issues = milestone_issues.get(*version).map(|issue_list| {
                issue_list.iter()
                    .filter_map(|issue| {
                        issue.closed_at.map(|closed_at| IssueEntry {
                            title: issue.title.clone(),
                            number: issue.number,
                            html_url: issue.html_url.to_string(),
                            days_ago: (now - closed_at.naive_utc().date()).num_days(),
                        })
                    })
                    .sorted_by_key(|e| e.days_ago)
                    .collect::<Vec<_>>()
            });

            let changelog_content = if let Some((changelog, _)) = changelogs.get(*version) {
                changelog.clone()
            } else {
                String::new()
            };

            releases.push(ReleaseData {
                version: version.to_string(),
                date: dates.release_date.format("%Y-%m-%d").to_string(),
                is_unreleased: Some(true),
                changelog_md: changelog_content,
                weight: self.version_manager.determine_weight(version),
                branch_date: dates.branch_date.format("%Y-%m-%d").to_string(),
                url: None,
                release_name,
                issues,
            });
        }

        // Sort by weight descending (newest first)
        releases.sort_by(|a, b| b.weight.cmp(&a.weight));

        // Build stabilization PRs
        let stabilization_prs: Vec<StabilizationPrEntry> = stabilization_prs
            .into_values()
            .sorted_by_key(|l| l.created_at)
            .rev()
            .map(|issue| {
                let labels: Vec<LabelEntry> = issue.labels.into_iter()
                    .filter_map(|l| {
                        Some(LabelEntry {
                            name: l.name.clone(),
                            description: l.description.clone(),
                        })
                    })
                    .collect();

                StabilizationPrEntry {
                    title: issue.title,
                    number: issue.number,
                    url: issue.html_url.to_string(),
                    updated_at: issue.created_at.to_rfc3339(),
                    labels,
                    days_old: (Utc::now() - issue.created_at).num_days(),
                }
            })
            .collect();

        ReleasesOutput {
            current_versions: crate::json_writer::CurrentVersions {
                stable: stable_version.to_string(),
                beta: beta_version.to_string(),
                nightly: nightly_version.to_string(),
            },
            releases,
            stabilization_prs,
        }
    }
}
