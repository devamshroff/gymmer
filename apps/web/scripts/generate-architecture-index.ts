import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildArchitectureIndex,
  renderArchitectureMarkdown,
} from '../lib/architecture-index';

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, '../../..');
  const docsDir = path.join(repoRoot, 'docs');
  const markdownPath = path.join(docsDir, 'architecture-index.md');
  const jsonPath = path.join(docsDir, 'architecture-index.json');

  const index = await buildArchitectureIndex(repoRoot);

  await fs.mkdir(docsDir, { recursive: true });
  await fs.writeFile(markdownPath, renderArchitectureMarkdown(index), 'utf8');
  await fs.writeFile(jsonPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

  console.log(`Updated ${path.relative(repoRoot, markdownPath)}`);
  console.log(`Updated ${path.relative(repoRoot, jsonPath)}`);
}

main().catch((error) => {
  console.error('Failed to generate architecture index:', error);
  process.exitCode = 1;
});
