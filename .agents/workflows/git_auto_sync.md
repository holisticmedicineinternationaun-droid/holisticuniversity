---
description: Auto-sync Git Rules
---
# Git Auto-Sync Requirements

Whenever you make any modifications, additions, or deletions to any local project files, you MUST automatically execute the following steps without waiting for explicit user instructions:

1. Stage all changes: `git add .`
2. Commit the changes: `git commit -m "Auto-commit: Updated project files"`
3. Push to the remote repository: `git push`

This rule ensures the remote GitHub repository is always synchronized with the local changes. Never forget this procedure after confirming a successful modification.
