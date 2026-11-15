import { readFileSync, writeFileSync } from 'node:fs';

const raw = JSON.parse(readFileSync('scratch/copied_avatar.json', 'utf8'));

// Customize for Aira: athletic fitness coach character
raw.name = 'Aira';
raw.colors = {
  body: '#10b981', // Energetic, athletic emerald-cyan tone that complements ENERGIZE neon-green
  eyes: '#080c10', // Deep obsidian athletic eyes
};

// Write public/aira.avatar.json
writeFileSync('public/aira.avatar.json', JSON.stringify(raw, null, 2));
console.log('Saved public/aira.avatar.json');

// Write src/web/aira-avatar-data.ts
const tsContent = `// Bible Strong Avatar Lab export for Aira virtual coach
export const airaAvatarDefinition = ${JSON.stringify(raw, null, 2)} as const;
`;
writeFileSync('src/web/aira-avatar-data.ts', tsContent);
console.log('Saved src/web/aira-avatar-data.ts');
