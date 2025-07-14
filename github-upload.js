const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const repoName = 'audiobooksmith';
const gitUserName = 'YOUR_GITHUB_USERNAME'; // Replace with your GitHub username
const gitEmail = 'YOUR_EMAIL@example.com'; // Replace with your email

// Check if .git directory exists
const hasGit = fs.existsSync(path.join(process.cwd(), '.git'));

// Helper function to run commands and log output
function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

// Main function to handle GitHub upload
async function uploadToGithub() {
  try {
    // Create .gitignore if it doesn't exist
    if (!fs.existsSync('.gitignore')) {
      const gitignoreContent = `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
.pnp
.pnp.js

# Build outputs
dist
dist-ssr
*.local
build

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
`;
      fs.writeFileSync('.gitignore', gitignoreContent.trim());
      console.log('Created .gitignore file');
    }

    // Initialize git repository if needed
    if (!hasGit) {
      runCommand('git init');
      runCommand(`git config user.name "${gitUserName}"`);
      runCommand(`git config user.email "${gitEmail}"`);
    }

    // Check remote status
    let remoteExists = false;
    try {
      const remotes = runCommand('git remote -v');
      remoteExists = remotes.includes('origin');
    } catch (error) {
      console.log('No remotes found, will add origin');
    }

    // Add remote if needed
    if (!remoteExists) {
      runCommand(`git remote add origin https://github.com/${gitUserName}/${repoName}.git`);
      console.log('Added remote origin');
    }

    // Stage all files
    runCommand('git add .');
    
    // Commit changes
    const commitMessage = 'Update AudiobookSmith project';
    runCommand(`git commit -m "${commitMessage}"`);
    
    // Push to GitHub
    console.log('Pushing to GitHub...');
    
    try {
      // Try pushing to the current branch
      const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD').trim();
      runCommand(`git push -u origin ${currentBranch}`);
    } catch (pushError) {
      // If push fails, try main or master branch
      console.log('Push failed, trying main branch...');
      try {
        runCommand('git push -u origin main');
      } catch (mainError) {
        console.log('Pushing to main failed, trying master branch...');
        runCommand('git push -u origin master');
      }
    }
    
    console.log('\n✅ Successfully uploaded to GitHub!');
    console.log(`Repository: https://github.com/${gitUserName}/${repoName}`);
    
  } catch (error) {
    console.error('Failed to upload to GitHub:', error.message);
    console.log('\nManual steps to push to GitHub:');
    console.log('1. Create a repository on GitHub named ' + repoName);
    console.log('2. Run the following commands:');
    console.log('   git add .');
    console.log('   git commit -m "Initial commit"');
    console.log(`   git remote add origin https://github.com/${gitUserName}/${repoName}.git`);
    console.log('   git push -u origin main');
  }
}

// Run the function
uploadToGithub();