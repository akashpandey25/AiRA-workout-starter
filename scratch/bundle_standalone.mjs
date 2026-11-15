import { readFileSync, writeFileSync } from 'node:fs';

let coreCode = readFileSync('scratch/avatar-core/dist/index.js', 'utf8');
// Remove ajv import
coreCode = coreCode.replace('import O from "ajv/dist/2020.js";', '// ajv omitted in standalone browser bundle\nconst O = class {};');
coreCode = coreCode.replace('new O({allErrors:!0,strict:!0})', 'null');
coreCode = coreCode.replace(/let\s+([a-zA-Z0-9_$]+)\s*=\s*[a-zA-Z0-9_$]+\.compile\([a-zA-Z0-9_$]+\)/, 'let $1 = () => true');

writeFileSync('scratch/avatar-core-noajv.js', coreCode);
console.log('Created scratch/avatar-core-noajv.js successfully!');
