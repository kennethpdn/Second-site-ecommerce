/**
 * Build script to generate sitemap.xml for Éclat Express.
 * Queries active products and packs from Firestore (or seed data fallback),
 * formats an SEO-compliant XML sitemap, and saves it to public/sitemap.xml.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps, getApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { SEED_PRODUITS, SEED_PACKS } from '../src/data/seedData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = (
  process.env.APP_URL ||
  'https://ais-pre-dhkj7jaynmdjsm2ne4rnxe-473642018575.us-west2.run.app'
).replace(/\/$/, '');

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/packs', priority: '0.9', changefreq: 'daily' },
  { path: '/boutique', priority: '0.9', changefreq: 'daily' },
  { path: '/promos', priority: '0.8', changefreq: 'daily' },
  { path: '/livraison-garantie', priority: '0.8', changefreq: 'weekly' },
  { path: '/professionnels', priority: '0.7', changefreq: 'weekly' },
  { path: '/livraison-paiement', priority: '0.7', changefreq: 'weekly' },
  { path: '/faq', priority: '0.7', changefreq: 'weekly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/cgv', priority: '0.3', changefreq: 'monthly' },
  { path: '/mentions-legales', priority: '0.3', changefreq: 'monthly' },
  { path: '/confidentialite', priority: '0.3', changefreq: 'monthly' },
  { path: '/cookies', priority: '0.3', changefreq: 'monthly' },
];

async function fetchActiveSlugs(): Promise<{ productSlugs: string[]; packSlugs: string[] }> {
  let productSlugs: string[] = [];
  let packSlugs: string[] = [];

  const configPath = path.resolve(rootDir, 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      let credentialOption = applicationDefault();
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credentialOption = cert(sa);
      }

      const adminApp =
        getApps().length === 0
          ? initializeApp({
              projectId: config.projectId,
              credential: credentialOption,
            })
          : getApp();

      const db = getFirestore(adminApp, config.firestoreDatabaseId || undefined);
      db.settings({ ignoreUndefinedProperties: true });

      const [prodSnap, packSnap] = await Promise.all([
        db.collection('produits').where('actif', '==', true).get(),
        db.collection('packs').where('actif', '==', true).get(),
      ]);

      if (!prodSnap.empty) {
        productSlugs = prodSnap.docs.map((d) => d.data().slug || d.id);
      }
      if (!packSnap.empty) {
        packSlugs = packSnap.docs.map((d) => d.data().slug || d.id);
      }
      console.log(`Fetched from Firestore: ${productSlugs.length} products, ${packSlugs.length} packs`);
    } catch (err: any) {
      console.warn('Could not query Firestore in build script, falling back to seed data:', err.message);
    }
  }

  // Fallback to seed data if empty
  if (productSlugs.length === 0) {
    productSlugs = SEED_PRODUITS.filter((p) => p.actif).map((p) => p.slug);
  }
  if (packSlugs.length === 0) {
    packSlugs = SEED_PACKS.filter((p) => p.actif).map((p) => p.slug);
  }

  return { productSlugs, packSlugs };
}

export async function generateSitemap() {
  console.log('Generating sitemap.xml for base URL:', BASE_URL);
  const { productSlugs, packSlugs } = await fetchActiveSlugs();

  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static routes
  for (const route of STATIC_ROUTES) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Active products
  for (const slug of productSlugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/produit/${encodeURIComponent(slug)}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // Active packs
  for (const slug of packSlugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/produit/${encodeURIComponent(slug)}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  // Write to public/sitemap.xml
  const publicDir = path.resolve(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicPath = path.resolve(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicPath, xml, 'utf-8');
  console.log(`Successfully written sitemap to ${publicPath} (${xml.length} bytes)`);

  // Also write to dist/sitemap.xml if dist exists
  const distDir = path.resolve(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    const distPath = path.resolve(distDir, 'sitemap.xml');
    fs.writeFileSync(distPath, xml, 'utf-8');
    console.log(`Successfully written sitemap to ${distPath}`);
  }

  return xml;
}

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('generateSitemap.ts')) {
  generateSitemap()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Failed to generate sitemap:', err);
      process.exit(1);
    });
}
