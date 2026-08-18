import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appPath = path.join(root, 'src', 'app.js');

if (!fs.existsSync(appPath)) {
  console.error('Could not find src/app.js. Run this from the project root.');
  process.exit(1);
}

let app = fs.readFileSync(appPath, 'utf8');

if (!app.includes("from './components/DarionAI.js'")) {
  const marker = "import {\n  PreBirthdayGate,\n} from './components/PreBirthdayGate.js';";

  if (!app.includes(marker)) {
    console.error('Could not find the PreBirthdayGate import. Patch app.js manually using SETUP.txt.');
    process.exit(1);
  }

  app = app.replace(
    marker,
    `${marker}\n\nimport {\n  DarionAI,\n} from './components/DarionAI.js';`
  );
}

if (!app.includes('<${DarionAI}')) {
  const rootMarker = `  render() {\n    return html\`\n      <div>\n`;

  if (!app.includes(rootMarker)) {
    console.error('Could not find the ExperienceApp root render. Patch app.js manually using SETUP.txt.');
    process.exit(1);
  }

  const widget = `\n        <${'${DarionAI}'}\n          sceneId=${'${'}\n            this.state.unlocked\n              ? EXPERIENCE_SCENES[\n                  this.state.sceneIndex\n                ]?.id ||\n                'experience'\n              : 'entry-gate'\n          }\n        />\n`;

  app = app.replace(
    rootMarker,
    `${rootMarker}${widget}`
  );
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('✅ Darion AI mounted in src/app.js');
console.log('   It appears from Entry Gate onward, never on the pre-birthday gate.');
