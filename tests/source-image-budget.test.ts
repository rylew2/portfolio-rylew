import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import sharp from 'sharp';

const sourceImages = [
  {
    path: 'public/images/avatar2.png',
    maxBytes: 340_000,
    format: 'png',
    width: 460,
    height: 607,
    channels: 4,
    hasAlpha: true,
    alphaRange: { min: 255, max: 255 },
  },
  {
    path: 'public/images/book/managersPath/managerspath.png',
    maxBytes: 400_000,
    format: 'png',
    width: 668,
    height: 972,
    channels: 4,
    hasAlpha: true,
    alphaRange: { min: 255, max: 255 },
  },
  {
    path: 'public/images/project/sensecourse/demo.jpg',
    maxBytes: 340_000,
    format: 'jpeg',
    width: 1893,
    height: 1013,
    channels: 3,
    hasAlpha: false,
  },
] as const;

test('source images stay within their byte and metadata budgets', async () => {
  for (const image of sourceImages) {
    const absolutePath = path.join(process.cwd(), image.path);
    const [file, metadata, stats] = await Promise.all([
      stat(absolutePath),
      sharp(absolutePath).metadata(),
      sharp(absolutePath).stats(),
    ]);

    assert.ok(
      file.size <= image.maxBytes,
      `${image.path} is ${file.size} bytes; budget is ${image.maxBytes}`
    );
    assert.equal(metadata.format, image.format, `${image.path} format changed`);
    assert.equal(metadata.width, image.width, `${image.path} width changed`);
    assert.equal(metadata.height, image.height, `${image.path} height changed`);
    assert.equal(
      metadata.channels,
      image.channels,
      `${image.path} channel count changed`
    );
    assert.equal(
      metadata.hasAlpha,
      image.hasAlpha,
      `${image.path} alpha presence changed`
    );

    if ('alphaRange' in image) {
      const alpha = stats.channels.at(-1);
      assert.ok(alpha, `${image.path} alpha channel is missing`);
      assert.equal(
        alpha.min,
        image.alphaRange.min,
        `${image.path} minimum alpha changed`
      );
      assert.equal(
        alpha.max,
        image.alphaRange.max,
        `${image.path} maximum alpha changed`
      );
      assert.equal(stats.isOpaque, true, `${image.path} is no longer opaque`);
    }
  }
});
