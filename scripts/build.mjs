import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

function resolveTailwindRoot() {
  try {
    const resolved = require.resolve('tailwindcss');
    return path.resolve(resolved, '..', '..');
  } catch {
    const globalRoot = '/opt/nvm/versions/node/v22.16.0/lib/node_modules/tailwindcss';

    if (fs.existsSync(globalRoot)) {
      return globalRoot;
    }

    throw new Error('TailwindCSS is not installed. Run npm install first.');
  }
}


function resolvePackageRoot(packageName) {
  try {
    const entry = require.resolve(packageName);

    let dir = path.dirname(entry);

    while (true) {
      const packageJson = path.join(dir, 'package.json');

      if (fs.existsSync(packageJson)) {
        try {
          const pkg = JSON.parse(
            fs.readFileSync(packageJson, 'utf8')
          );

          if (pkg.name === packageName) {
            return dir;
          }
        } catch {
          // Keep walking upward.
        }
      }

      const parent = path.dirname(dir);

      if (parent === dir) break;

      dir = parent;
    }

    throw new Error(`Could not locate ${packageName} package root.`);
  } catch (error) {
    throw new Error(
      `${packageName} could not be resolved.\n${error.message}`
    );
  }
}



function collectFiles(dir, extensions = ['.html', '.js']) {
  const out = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === 'dist' ||
      entry.name === 'node_modules'
    ) {
      continue;
    }

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      out.push(...collectFiles(full, extensions));
    } else if (extensions.includes(path.extname(entry.name))) {
      out.push(full);
    }
  }

  return out;
}

function collectCandidates() {
  const classes = new Set([
    // Existing dynamic state classes.
    'bg-purple-500',
    'bg-purple-200',
    'opacity-50',

    // Birthday Room dynamic state classes.
    'ring-2',
    'ring-purple-300/50',

    'translate-x-4',
    '-skew-y-3',
    'opacity-30',

    'hover:-translate-y-1',
    'hover:shadow-[0_28px_75px_rgba(111,61,139,.30)]',
  ]);

  for (const file of collectFiles(root)) {
    const text = fs
      .readFileSync(file, 'utf8')
      .replace(/\\"/g, '"');

    /*
     * Finds normal literal Tailwind classes such as:
     *
     * className="flex items-center bg-purple-500"
     *
     * Dynamic classes inside ${...} still need to be listed
     * manually in the Set above.
     */
    const literalClassRe =
      /class(?:Name)?\s*=\s*["'`]([^"'`]+)["'`]/g;

    let match;

    while ((match = literalClassRe.exec(text))) {
      for (const token of match[1].split(/\s+/)) {
        const clean = token.trim();

        if (clean) {
          classes.add(clean);
        }
      }
    }
  }

  return [...classes];
}

function copyRecursive(src, dst) {
  if (!fs.existsSync(src)) {
    return;
  }

  fs.mkdirSync(dst, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const source = path.join(src, entry.name);
    const destination = path.join(dst, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(source, destination);
    } else {
      fs.copyFileSync(source, destination);
    }
  }
}

function copyFileChecked(source, destination) {
  if (!fs.existsSync(source)) {
    throw new Error(
      `Required runtime file is missing: ${source}`
    );
  }

  fs.mkdirSync(
    path.dirname(destination),
    { recursive: true }
  );

  fs.copyFileSync(source, destination);
}

function copyBrowserRuntime() {
  const reactRoot = resolvePackageRoot('react');
  const reactDomRoot = resolvePackageRoot('react-dom');
  const htmRoot = resolvePackageRoot('htm');

  const vendorDir = path.join(dist, 'vendor');

  /*
   * Your index.html expects:
   *
   * /vendor/react.production.min.js
   * /vendor/react-dom.production.min.js
   * /vendor/htm.umd.js
   *
   * We copy them into dist/vendor every build.
   */

  copyFileChecked(
    path.join(
      reactRoot,
      'umd',
      'react.production.min.js'
    ),
    path.join(
      vendorDir,
      'react.production.min.js'
    )
  );

  copyFileChecked(
    path.join(
      reactDomRoot,
      'umd',
      'react-dom.production.min.js'
    ),
    path.join(
      vendorDir,
      'react-dom.production.min.js'
    )
  );

  copyFileChecked(
    path.join(
      htmRoot,
      'dist',
      'htm.umd.js'
    ),
    path.join(
      vendorDir,
      'htm.umd.js'
    )
  );
}

function validateBrowserRuntime() {
  const runtimeFiles = [
    'react.production.min.js',
    'react-dom.production.min.js',
    'htm.umd.js',
  ];

  for (const file of runtimeFiles) {
    const full = path.join(
      dist,
      'vendor',
      file
    );

    if (!fs.existsSync(full)) {
      throw new Error(
        `Missing browser runtime after build: ${full}`
      );
    }

    const start = fs
      .readFileSync(full, 'utf8')
      .trimStart()
      .slice(0, 80);

    /*
     * If the file begins with "<", something returned HTML
     * instead of JavaScript. That is the exact situation that
     * produces:
     *
     * Unexpected token '<'
     */
    if (start.startsWith('<')) {
      throw new Error(
        `${file} contains HTML instead of JavaScript.`
      );
    }
  }
}

async function build() {
  /*
   * Clean build.
   */
  fs.rmSync(
    dist,
    {
      recursive: true,
      force: true,
    }
  );

  fs.mkdirSync(
    dist,
    {
      recursive: true,
    }
  );

  /*
   * Tailwind.
   */
  const twRoot = resolveTailwindRoot();

  const { compile } = require(
    path.join(
      twRoot,
      'dist',
      'lib.js'
    )
  );

  const defaultTheme = fs.readFileSync(
    path.join(
      twRoot,
      'theme.css'
    ),
    'utf8'
  );

  const preflight = fs.readFileSync(
    path.join(
      twRoot,
      'preflight.css'
    ),
    'utf8'
  );

  const input = fs.readFileSync(
    path.join(
      root,
      'src',
      'styles.input.css'
    ),
    'utf8'
  );

  const result = await compile(
    `${defaultTheme}\n${input}`
  );

  const candidates = collectCandidates();

  const utilities = result.build(
    candidates
  );

  fs.writeFileSync(
    path.join(
      dist,
      'styles.css'
    ),
    `${preflight}\n${utilities}`,
    'utf8'
  );

  /*
   * Main HTML.
   */
  fs.copyFileSync(
    path.join(
      root,
      'index.html'
    ),
    path.join(
      dist,
      'index.html'
    )
  );

  /*
   * App source.
   *
   * src/config.js
   * becomes:
   *
   * dist/config.js
   *
   * src/pages/*
   * becomes:
   *
   * dist/pages/*
   */
  copyRecursive(
    path.join(
      root,
      'src'
    ),
    dist
  );

  /*
   * Static assets.
   *
   * public/art/*
   * becomes:
   *
   * dist/art/*
   *
   * public/audio/*
   * becomes:
   *
   * dist/audio/*
   */
  copyRecursive(
    path.join(
      root,
      'public'
    ),
    dist
  );

  /*
   * IMPORTANT:
   *
   * Runtime gets copied LAST.
   *
   * This means even if public/vendor contains something stale,
   * React / ReactDOM / HTM cannot accidentally be overwritten.
   */
  copyBrowserRuntime();

  /*
   * Fail the build immediately if the runtime is broken.
   */
  validateBrowserRuntime();

  console.log(
    `Built ${candidates.length} Tailwind candidates.`
  );

  console.log(
    'Runtime OK: React + ReactDOM + HTM copied to dist/vendor.'
  );

  console.log(
    `Output: ${dist}`
  );
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});