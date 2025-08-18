#!/usr/bin/env node
/**
 * MASTERMIND BUILD SYSTEM
 * Chess master approach to building - strategic, minimal, maximum impact
 */

import fs from 'fs';
import path from 'path';

console.log('🧠 Mastermind Build System Activated');

// Create dist directory
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Core files to include (minimal strategic selection)
const coreFiles = [
  'index.html',
  'master.css', 
  'core.js',
  'config.json'
];

// Copy core files
coreFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`✓ Copied: ${file}`);
  }
});

// Optimize HTML - Inline critical CSS for psychological speed
if (fs.existsSync('dist/index.html') && fs.existsSync('dist/master.css')) {
  let html = fs.readFileSync('dist/index.html', 'utf8');
  const css = fs.readFileSync('dist/master.css', 'utf8');
  
  // Extract critical CSS (first 2KB for above-fold content)
  const criticalCSS = css.substring(0, 2048);
  
  // Inline critical CSS and defer the rest
  html = html.replace(
    '<link rel="stylesheet" href="master.css">',
    `<style>${criticalCSS}</style><link rel="preload" href="master.css" as="style" onload="this.onload=null;this.rel='stylesheet'">`
  );
  
  fs.writeFileSync('dist/index.html', html);
  console.log('✓ Optimized: Critical CSS inlined');
}

// Minify JS for production
if (fs.existsSync('dist/core.js')) {
  let js = fs.readFileSync('dist/core.js', 'utf8');
  
  // Basic minification - remove comments and extra whitespace
  js = js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
    
  fs.writeFileSync('dist/core.min.js', js);
  console.log('✓ Minified: core.js');
}

// Create service worker for performance psychology
const serviceWorker = `
// MASTERMIND SERVICE WORKER - Strategic Caching
const CACHE_NAME = 'mastermind-v1';
const urlsToCache = ['/', '/master.css', '/core.js', '/config.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
`;

fs.writeFileSync('dist/sw.js', serviceWorker);
console.log('✓ Created: Service Worker');

// Generate sitemap for SEO psychology
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://shopglow-mastermind.com/</loc><priority>1.0</priority></url>
  <url><loc>https://shopglow-mastermind.com/curated</loc><priority>0.9</priority></url>
  <url><loc>https://shopglow-mastermind.com/categories</loc><priority>0.8</priority></url>
  <url><loc>https://shopglow-mastermind.com/partners</loc><priority>0.7</priority></url>
</urlset>`;

fs.writeFileSync('dist/sitemap.xml', sitemap);
console.log('✓ Generated: Sitemap');

// Build stats
const stats = {
  buildTime: new Date().toISOString(),
  files: fs.readdirSync('dist').length,
  totalSize: fs.readdirSync('dist').reduce((total, file) => {
    return total + fs.statSync(path.join('dist', file)).size;
  }, 0)
};

fs.writeFileSync('dist/build-stats.json', JSON.stringify(stats, null, 2));

console.log(`🎯 Mastermind Build Complete!`);
console.log(`📁 Files: ${stats.files}`);
console.log(`📦 Size: ${(stats.totalSize / 1024).toFixed(2)}KB`);
console.log('🚀 Ready for deployment to GitHub Pages');