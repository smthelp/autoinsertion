import { copyFile, rename, unlink, writeFile } from 'node:fs/promises';

const outputDirectory = new URL('../.pages-dist/', import.meta.url);

await rename(new URL('index.js', outputDirectory), new URL('_worker.js', outputDirectory));
await copyFile(new URL('../wrangler.pages.toml', import.meta.url), new URL('wrangler.toml', outputDirectory));
await writeFile(new URL('_routes.json', outputDirectory), JSON.stringify({
  version: 1,
  include: ['/*'],
  exclude: [],
}, null, 2));

await unlink(new URL('index.js.map', outputDirectory)).catch(() => {});
await unlink(new URL('README.md', outputDirectory)).catch(() => {});
