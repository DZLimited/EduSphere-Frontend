// Generates a branded course thumbnail as a PNG data URL, entirely client-side.
// No external API, no cost, no API keys — draws a gradient + pattern + the
// course title using our design system's colors and Fraunces typeface.

const PALETTES = [
  { from: '#4338CA', to: '#6D5FE0', text: '#EEF2FF' }, // indigo
  { from: '#D97706', to: '#F59E0B', text: '#451A03' }, // amber
  { from: '#047857', to: '#10B981', text: '#ECFDF5' }, // emerald
  { from: '#3730A3', to: '#D97706', text: '#FFFBEB' }, // indigo -> amber blend
];

const PATTERNS = ['diagonal', 'dots', 'blobs'];

// Simple deterministic hash so the same title+seed always produces the same look,
// but changing the seed (Regenerate button) gives a genuinely different result.
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 3); // cap at 3 lines so it never overflows the card
};

const drawPattern = (ctx, type, w, h, color) => {
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (type === 'diagonal') {
    ctx.lineWidth = 14;
    for (let x = -h; x < w; x += 46) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h, h);
      ctx.stroke();
    }
  } else if (type === 'dots') {
    for (let y = 20; y < h; y += 40) {
      for (let x = 20; x < w; x += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (type === 'blobs') {
    const blobs = [[w * 0.85, h * 0.15, 90], [w * 0.1, h * 0.85, 70], [w * 0.9, h * 0.85, 50]];
    blobs.forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
};

export const generateThumbnailDataUrl = async ({ title, category, seed = 0 }) => {
  const width = 800;
  const height = 450;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const hash = hashString(`${title}-${category}-${seed}`);
  const palette = PALETTES[hash % PALETTES.length];
  const pattern = PATTERNS[(hash >> 3) % PATTERNS.length];

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, palette.from);
  gradient.addColorStop(1, palette.to);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Decorative pattern layer
  drawPattern(ctx, pattern, width, height, palette.text);

  // Wait for the Fraunces webfont to be ready before drawing text,
  // otherwise canvas silently falls back to a default serif.
  try {
    await document.fonts.load('600 46px Fraunces');
    await document.fonts.ready;
  } catch {
    // If the font API isn't available, canvas just uses its default serif — not fatal.
  }

  // Title text, wrapped, bottom-anchored
  ctx.fillStyle = palette.text;
  ctx.font = '600 44px Fraunces, serif';
  ctx.textBaseline = 'alphabetic';
  const lines = wrapText(ctx, title || 'Untitled course', width - 100);
  const lineHeight = 54;
  const startY = height - 60 - (lines.length - 1) * lineHeight;
  lines.forEach((line, i) => {
    ctx.fillText(line, 50, startY + i * lineHeight);
  });

  // Category label pill, top-left
  if (category) {
    ctx.font = '600 15px Inter, sans-serif';
    const labelWidth = ctx.measureText(category.toUpperCase()).width + 32;
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.roundRect(50, 40, labelWidth, 34, 17);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = palette.text;
    ctx.fillText(category.toUpperCase(), 66, 62);
  }

  return canvas.toDataURL('image/png');
};