
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const MAX_COMMITS = 20;
const OUTPUT_FILE = path.resolve(process.cwd(), 'apps/web/app/data/changelog.json');

// Ensure directory exists
const dir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

try {
    // Get git log in a parseable format
    // %H: commit hash
    // %h: abbreviated commit hash
    // %an: author name
    // %ad: author date (format: YYYY-MM-DD)
    // %s: subject
    const logOutput = execSync('git log --pretty=format:"%H|%h|%an|%ad|%s" --date=short -n 100', {
        encoding: 'utf-8'
    });

    const commits = logOutput
        .split('\n')
        .map(line => {
            const [hash, shortHash, author, date, message] = line.split('|');
            return { hash, shortHash, author, date, message };
        })
        .filter(commit => {
            // Filter out empty lines
            if (!commit.message || !commit.author) return false;

            const msg = commit.message.toLowerCase();
            const author = commit.author.toLowerCase();

            // Filter out "claude code" or generic auto-generated messages if needed
            if (msg.includes('claude code')) return false;

            // Optional: Filter for conventional commits or specific meaningful updates
            // For now, we'll keep it broad but exclude obviously automated/spammy ones if identified
            return true;
        })
        .slice(0, MAX_COMMITS);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(commits, null, 2));
    console.log(`✅ Changelog generated with ${commits.length} commits at ${OUTPUT_FILE}`);

} catch (error) {
    console.error('❌ Failed to generate changelog:', error);
    // Write empty array to avoid build crashes
    if (!fs.existsSync(OUTPUT_FILE)) {
        fs.writeFileSync(OUTPUT_FILE, '[]');
    }
}
