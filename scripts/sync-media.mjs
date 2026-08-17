import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function copy(src,dst){fs.mkdirSync(dst,{recursive:true});for(const e of fs.readdirSync(src,{withFileTypes:true})){const s=path.join(src,e.name),d=path.join(dst,e.name);e.isDirectory()?copy(s,d):fs.copyFileSync(s,d)}}
copy(path.join(root,'public','media'), path.join(root,'dist','media'));
console.log('Media synced into dist/.');
