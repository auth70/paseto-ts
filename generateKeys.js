import { generateKeys } from './dist/v4/index.js';

async function g(type) {
  console.log('----------------------------------');
  console.log('type: '+type);
  const keys = await generateKeys(type);
  console.log(keys);
}

await g("local");
await g("public");
