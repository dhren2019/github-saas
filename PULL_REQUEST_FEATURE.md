# Pull Request Creation Feature

## Overview
This feature adds the ability to create pull requests directly from the dashboard of your GitHub SaaS application.

## How to Use

### 1. Access the Feature
- Navigate to your project dashboard
- You'll see a new "Create Pull Request" card alongside "Ask Question" and "Meeting" cards
- Click on the "Create Pull Request" card to open the dialog

### 2. Fill Out the Form
The pull request creation form includes the following fields:

- **GitHub Token**: Required personal access token with 'repo' scope
- **Pull Request Title**: A descriptive title for your PR
- **Description**: Optional detailed description of the changes
- **Head Branch**: The branch containing your changes (source)
- **Base Branch**: The target branch for merging (usually 'main' or 'master')

### 3. Branch Selection
- Enter your GitHub token first to load available branches
- Select the appropriate head and base branches from the dropdown menus
- The form will show helpful descriptions for each field

### 4. Create the Pull Request
- Click "Create Pull Request" to submit
- The system will use the GitHub API to create the PR in your repository
- You'll receive a success notification with the PR number
- Any errors will be displayed with helpful error messages

## Requirements

### GitHub Token
You need a GitHub Personal Access Token with the following permissions:
- `repo` scope (for creating pull requests in the repository)

To create a token:
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with `repo` scope
3. Copy the token (it won't be shown again)

### Branch Setup
- Ensure your repository has multiple branches
- The head branch should contain the changes you want to merge
- The base branch should be the target for the merge

## API Endpoints

### Get Branches
```typescript
api.project.getBranches.useQuery({
  projectId: string,
  githubToken?: string
})
```

### Create Pull Request
```typescript
api.project.createPullRequest.useMutation({
  projectId: string,
  githubToken: string,
  title: string,
  body: string,
  head: string,
  base: string
})
```

## Security Notes

- GitHub tokens are not stored permanently
- Tokens are only used for the API call and then discarded
- Always use tokens with minimal required permissions
- Consider using GitHub Apps for production deployments

## Troubleshooting

### Common Issues

**"Project not found"**
- Ensure the project exists and you have access to it

**"Invalid github url"**
- Check that the project has a valid GitHub repository URL

**"Authentication failed"**
- Verify your GitHub token has the correct permissions
- Ensure the token hasn't expired

**"Branch not found"**
- Make sure the selected branches exist in the repository
- Refresh the branch list if needed

**"Pull request already exists"**
- Check if a PR already exists for the same head/base branch combination
- GitHub doesn't allow duplicate PRs for the same branch pair