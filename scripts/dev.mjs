import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = path.dirname(__filename);
const root = path.resolve(scriptsDir, '..');

const buildScript = path.join(scriptsDir, 'build.mjs');
const serveScript = path.join(scriptsDir, 'serve.mjs');

let buildRunning = false;
let buildQueued = false;
let debounceTimer = null;
let serverProcess = null;

const watchedRoots = [
  path.join(root, 'src'),
  path.join(root, 'public'),
];

const watchedFiles = new Set([
  path.join(root, 'index.html'),
]);

function printDivider() {
  console.log('');
  console.log('────────────────────────────────────────────');
  console.log('');
}

function runInitialBuild() {
  console.log('');
  console.log('💜 FENDISHA DEV MODE');
  console.log('Building project...');
  printDivider();

  const result = spawnSync(
    process.execPath,
    [buildScript],
    {
      cwd: root,
      stdio: 'inherit',
    }
  );

  if (result.status !== 0) {
    console.error('');
    console.error('❌ Initial build failed.');
    console.error('Fix the error above and run npm start again.');
    process.exit(1);
  }

  console.log('');
  console.log('✅ Initial build complete.');
}

function runBuild(reason = 'file changed') {
  if (buildRunning) {
    buildQueued = true;
    return;
  }

  buildRunning = true;

  console.log('');
  console.log(`🔄 ${reason}`);
  console.log('Rebuilding...');
  printDivider();

  const child = spawn(
    process.execPath,
    [buildScript],
    {
      cwd: root,
      stdio: 'inherit',
    }
  );

  child.on('exit', (code) => {
    buildRunning = false;

    if (code === 0) {
      console.log('');
      console.log('✅ Rebuilt successfully.');
      console.log('🌷 Server is still running — just refresh the browser.');
    } else {
      console.log('');
      console.log('❌ Build failed.');
      console.log('The server is still alive. Fix the file and save again.');
    }

    if (buildQueued) {
      buildQueued = false;

      setTimeout(() => {
        runBuild('another change was waiting');
      }, 80);
    }
  });
}

function scheduleBuild(reason) {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    runBuild(reason);
  }, 180);
}

function shouldIgnore(filename) {
  if (!filename) return false;

  const normalized = String(filename).replaceAll('\\', '/');

  return (
    normalized.includes('/dist/') ||
    normalized.includes('/node_modules/') ||
    normalized.endsWith('~') ||
    normalized.endsWith('.tmp') ||
    normalized.endsWith('.swp') ||
    normalized.endsWith('.DS_Store')
  );
}

function watchDirectory(directory) {
  if (!fs.existsSync(directory)) {
    console.warn(`⚠️ Watch directory missing: ${directory}`);
    return;
  }

  const watcher = fs.watch(
    directory,
    {
      recursive: true,
    },
    (eventType, filename) => {
      if (shouldIgnore(filename)) return;

      const relative = filename
        ? path.relative(root, path.join(directory, filename))
        : path.relative(root, directory);

      scheduleBuild(
        `${eventType}: ${relative}`
      );
    }
  );

  watcher.on('error', (error) => {
    console.error(
      `Watcher error for ${directory}:`,
      error
    );
  });
}

function watchSingleFile(file) {
  if (!fs.existsSync(file)) {
    console.warn(`⚠️ Watch file missing: ${file}`);
    return;
  }

  const watcher = fs.watch(
    file,
    (eventType) => {
      scheduleBuild(
        `${eventType}: ${path.relative(root, file)}`
      );
    }
  );

  watcher.on('error', (error) => {
    console.error(
      `Watcher error for ${file}:`,
      error
    );
  });
}

function startServer() {
  console.log('');
  console.log('🚀 Starting birthday experience server...');
  printDivider();

  serverProcess = spawn(
    process.execPath,
    [serveScript],
    {
      cwd: root,
      stdio: 'inherit',
    }
  );

  serverProcess.on('exit', (code, signal) => {
    if (signal) {
      console.log(`Server stopped with ${signal}.`);
    } else if (code !== 0) {
      console.error(`Server exited with code ${code}.`);
    }
  });
}

function startWatchers() {
  for (const directory of watchedRoots) {
    watchDirectory(directory);
  }

  for (const file of watchedFiles) {
    watchSingleFile(file);
  }

  console.log('');
  console.log('👀 Watching:');
  console.log('   src/');
  console.log('   public/');
  console.log('   index.html');
  console.log('');
  console.log('Save a file → automatic rebuild.');
  console.log('No more npm run build every damn time 😂');
  console.log('');
}

function shutdown() {
  console.log('');
  console.log('Stopping dev server...');

  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

runInitialBuild();
startServer();
startWatchers();