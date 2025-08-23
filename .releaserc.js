module.exports = {
    branches: ["master"],
    plugins: [
        [
            "@semantic-release/commit-analyzer",
            {
                preset: "conventionalcommits",
                releaseRules: [
                    { type: "feat", release: "minor" },
                    { type: "fix", release: "patch" },
                    { type: "perf", release: "patch" },
                    { type: "docs", release: false },
                    { type: "chore", release: false },
                    { type: "refactor", release: false },
                    { type: "test", release: false },
                    { type: "ci", release: false },
                    { type: "build", release: false },
                    { type: "style", release: false },
                ],
            },
        ],
        [
            "@semantic-release/release-notes-generator",
            {
                preset: "conventionalcommits",
                presetConfig: {
                    types: [
                        { type: "feat", section: "✨ Features" },
                        { type: "fix", section: "🐛 Bug Fixes" },
                        { type: "perf", section: "⚡ Performance" },
                        { type: "docs", section: "📝 Documentation", hidden: false },
                        { type: "chore", section: "Chores", hidden: false },
                        { type: "refactor", section: "Refactoring", hidden: false },
                        { type: "test", section: "Tests", hidden: false },
                        { type: "ci", section: "CI", hidden: false },
                        { type: "build", section: "Build", hidden: false },
                        { type: "style", section: "Style", hidden: false },
                    ],
                },
                writerOpts: {
                    commitPartial: `* {{#if scope}}**{{scope}}:** {{/if}}{{subject}}
{{#if body}}

  {{body}}
{{/if}}`,
                },
            },
        ],
        ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
        ["@semantic-release/npm", { npmPublish: true }],
        ["@semantic-release/github", { assets: [] }],
    ],
};
