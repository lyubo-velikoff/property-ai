import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Important for Prisma
  external: ['@prisma/client'],
  // Needed for __dirname, require, etc
  banner: {
    js: `import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);`,
  },
  esbuildOptions(options) {
    options.platform = 'node'
    options.target = 'node20'
  }
}) 
