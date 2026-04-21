const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Ahsaanraza';
const REPO_NAME = 'PUBLIC-2.0';
const BRANCH = 'main';

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is not set.');
  process.exit(1);
}

// Comprehensive ignore list
const IGNORE_DIRS = ['node_modules', '.git', 'build', 'coverage', 'artifacts', '.gemini'];
const IGNORE_FILES = ['.DS_Store', 'npm-debug.log', 'yarn-debug.log', 'yarn-error.log', 'push-to-github.js', 'push-via-api.js', 'final-push.js'];

function shouldIgnore(name, isDir) {
  if (isDir) {
    return IGNORE_DIRS.includes(name);
  }
  return IGNORE_FILES.includes(name);
}

async function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    const isDir = fs.statSync(name).isDirectory();
    
    if (shouldIgnore(file, isDir)) continue;

    if (isDir) {
      await getAllFiles(name, fileList);
    } else {
      fileList.push(name);
    }
  }
  return fileList;
}

async function uploadFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${relativePath}`;
  
  // Read content and base64 encode
  const content = fs.readFileSync(filePath, { encoding: 'base64' });

  // Special logging for pages
  if (relativePath.startsWith('src/pages/')) {
    console.log(`[PAGE] Processing: ${relativePath}`);
  } else {
    console.log(`Processing: ${relativePath}...`);
  }

  try {
    // Check if file exists to get SHA
    const getRes = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Antigravity-AI'
      }
    });

    let sha = null;
    if (getRes.status === 200) {
      const data = await getRes.json();
      sha = data.sha;
    } else if (getRes.status !== 404) {
       console.error(`Error checking ${relativePath}: ${getRes.status}`);
       return;
    }

    const payload = {
      message: `Sync ${relativePath} via Final Push`,
      content: content,
      branch: BRANCH
    };
    if (sha) payload.sha = sha;

    // We only PUT if it's new or the file is small enough to not worry about re-uploading everything.
    // To be absolutely sure, we'll re-upload (this handles updates too).
    
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Antigravity-AI'
      },
      body: JSON.stringify(payload)
    });

    if (putRes.ok) {
      console.log(`[OK] ${relativePath}`);
    } else {
      const errorData = await putRes.json();
      console.error(`[FAIL] ${relativePath}:`, errorData.message || errorData);
    }
  } catch (error) {
    console.error(`[ERROR] ${relativePath}:`, error.message);
  }
}

async function main() {
  console.log('--- Starting FINAL GitHub API Upload ---');
  const allFiles = await getAllFiles(process.cwd());
  
  const pages = allFiles.filter(f => f.includes('src' + path.sep + 'pages'));
  console.log(`Found ${allFiles.length} total files identified.`);
  console.log(`Found ${pages.length} files in src/pages.`);

  // Sort files to process pages together for clear logging
  allFiles.sort((a, b) => {
    const aPage = a.includes('pages');
    const bPage = b.includes('pages');
    if (aPage && !bPage) return -1;
    if (!aPage && bPage) return 1;
    return a.localeCompare(b);
  });

  for (const file of allFiles) {
    await uploadFile(file);
    // Small delay to prevent hitting rate limits too fast
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('--- FINAL GitHub API Upload Finished ---');
}

main();
