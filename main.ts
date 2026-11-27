// DealScope hand-in program (Node 22, standard library only).
//
// The site itself lives in app/ as plain static files and screenshots/ holds
// its pictures. This program delivers them: it copies both folders into the
// output directory and writes dossier.json there with the kit's vendored
// buildDossier, so the scorer can rebuild the dossier from the same files
// and compare it byte for byte. vendor/makefun-frontend.ts is the kit's own
// file and must not be edited.
//
// Run it the way the grader does (read-only repository, writable output):
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

cpSync(join(repoDir, 'app'), join(outputDir, 'app'), { recursive: true });

const shotsDir = join(repoDir, 'screenshots');
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
}

const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
