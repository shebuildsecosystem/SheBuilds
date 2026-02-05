/**
 * Image Conversion Script - Convert PNG/JPG to WebP
 *
 * Usage:
 * 1. Install sharp: npm install sharp --save-dev
 * 2. Run: node scripts/convert-to-webp.js
 *
 * This will convert all PNG and JPG images in /public to WebP format
 * with optimized compression settings.
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = './public';
const QUALITY = 80; // WebP quality (0-100)

async function convertImage(inputPath, outputPath) {
  try {
    const info = await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const inputStats = await stat(inputPath);
    const outputStats = await stat(outputPath);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✓ ${basename(inputPath)} → ${basename(outputPath)}`);
    console.log(`  Original: ${(inputStats.size / 1024 / 1024).toFixed(2)}MB → WebP: ${(outputStats.size / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)`);

    return { input: inputStats.size, output: outputStats.size };
  } catch (error) {
    console.error(`✗ Failed to convert ${inputPath}:`, error.message);
    return null;
  }
}

async function processDirectory(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let totalInputSize = 0;
  let totalOutputSize = 0;
  let convertedCount = 0;

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      const subResult = await processDirectory(fullPath);
      totalInputSize += subResult.totalInput;
      totalOutputSize += subResult.totalOutput;
      convertedCount += subResult.count;
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const outputPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        const result = await convertImage(fullPath, outputPath);
        if (result) {
          totalInputSize += result.input;
          totalOutputSize += result.output;
          convertedCount++;
        }
      }
    }
  }

  return { totalInput: totalInputSize, totalOutput: totalOutputSize, count: convertedCount };
}

async function main() {
  console.log('🖼️  Converting images to WebP format...\n');
  console.log(`Directory: ${PUBLIC_DIR}`);
  console.log(`Quality: ${QUALITY}%\n`);
  console.log('─'.repeat(50));

  const result = await processDirectory(PUBLIC_DIR);

  console.log('─'.repeat(50));
  console.log('\n📊 Summary:');
  console.log(`   Images converted: ${result.count}`);
  console.log(`   Original size: ${(result.totalInput / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   WebP size: ${(result.totalOutput / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Total savings: ${((result.totalInput - result.totalOutput) / 1024 / 1024).toFixed(2)}MB (${((1 - result.totalOutput / result.totalInput) * 100).toFixed(1)}%)`);
  console.log('\n✨ Done! Remember to update image references in your code to use .webp extension.');
}

main().catch(console.error);
