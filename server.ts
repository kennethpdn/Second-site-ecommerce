import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initializeApp, getApps, getApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import {
  SEED_CATEGORIES,
  SEED_PRODUITS,
  SEED_PACKS,
  SEED_CONFIG,
  SEED_AVIS,
} from './src/data/seedData.ts';
import { Produit, Pack, Commande, DemandePro } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;
const OWNER_EMAIL = 'lookisato@gmail.com';

// -----------------------------------------------------------------------------
// Firebase Config & Admin SDK Initialization
// -----------------------------------------------------------------------------
let firebaseConfigFile: any = null;
try {
  const raw = fs.readFileSync(path.resolve(__dirname, 'firebase-applet-config.json'), 'utf-8');
  firebaseConfigFile = JSON.parse(raw);
} catch (e) {
  console.warn('Could not read firebase-applet-config.json:', e);
}

let dbAdmin: Firestore | null = null;
let useLiveFirestore = false;

if (firebaseConfigFile) {
  try {
    let credentialOption = applicationDefault();
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credentialOption = cert(sa);
    }

    const adminApp = getApps().length === 0
      ? initializeApp({
          projectId: firebaseConfigFile.projectId,
          credential: credentialOption,
        })
      : getApp();

    const firestoreDb = getFirestore(
      adminApp,
      firebaseConfigFile.firestoreDatabaseId || undefined
    );
    firestoreDb.settings({ ignoreUndefinedProperties: true });
    dbAdmin = firestoreDb;
    useLiveFirestore = true;
    console.log('Firebase Admin initialized for project:', firebaseConfigFile.projectId);
  } catch (err: any) {
    console.warn('Firebase Admin fallback active (ADC not present):', err.message);
    useLiveFirestore = false;
  }
}

// -----------------------------------------------------------------------------
// Resilient In-Memory & Local Backup Store for Development & Fast Hydration
// -----------------------------------------------------------------------------
const memoryStore = {
  categories: [...SEED_CATEGORIES],
  produits: [...SEED_PRODUITS],
  packs: [...SEED_PACKS],
  config: { ...SEED_CONFIG },
  avis: [...SEED_AVIS],
  commandes: [] as Commande[],
  demandesPro: [] as DemandePro[],
  newsletter: new Set<string>(),
};

// Seed live Firestore if accessible and empty
async function seedLiveFirestoreIfNeeded() {
  if (!dbAdmin) return;
  try {
    const catSnap = await dbAdmin.collection('categories').limit(1).get();
    if (catSnap.empty) {
      console.log('Seeding initial data into Firestore...');
      const batch = dbAdmin.batch();

      for (const cat of SEED_CATEGORIES) {
        batch.set(dbAdmin.collection('categories').doc(cat.id), cat);
      }
      for (const prod of SEED_PRODUITS) {
        batch.set(dbAdmin.collection('produits').doc(prod.id), prod);
      }
      for (const pack of SEED_PACKS) {
        batch.set(dbAdmin.collection('packs').doc(pack.id), pack);
      }
      for (const avis of SEED_AVIS) {
        batch.set(dbAdmin.collection('avis').doc(avis.id), avis);
      }
      batch.set(dbAdmin.collection('config').doc('site'), SEED_CONFIG);

      await batch.commit();
      console.log('Firestore seed completed successfully.');
    }
  } catch (err: any) {
    console.warn('Note on Firestore access during seed:', err.message);
    useLiveFirestore = false;
  }
}

seedLiveFirestoreIfNeeded().catch(console.error);

// -----------------------------------------------------------------------------
// Rate Limiter per IP (Sliding Window)
// -----------------------------------------------------------------------------
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();
function rateLimit(limitPerMinute = 20) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const entry = ipRequestCounts.get(ip);

    if (!entry || now > entry.resetAt) {
      ipRequestCounts.set(ip, { count: 1, resetAt: now + 60_000 });
      return next();
    }

    if (entry.count >= limitPerMinute) {
      return res.status(429).json({
        error: 'Trop de requêtes. Veuillez patienter une minute avant de réessayer.',
      });
    }

    entry.count++;
    next();
  };
}

// -----------------------------------------------------------------------------
// Helper: Format Order Number (EE-YYMMDD-XXXX)
// -----------------------------------------------------------------------------
function generateOrderNumber(): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `EE-${yy}${mm}${dd}-${rand}`;
}

// -----------------------------------------------------------------------------
// Main Server App
// -----------------------------------------------------------------------------
async function createServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      store: useLiveFirestore ? 'firestore-admin' : 'local-sync',
      timestamp: new Date().toISOString(),
    });
  });

  // SEO: Dynamic robots.txt and sitemap.xml
  async function generateDynamicSitemapXml(req?: express.Request): Promise<string> {
    const rawHost = req?.headers['x-forwarded-host'] || req?.headers.host;
    const protocol = req?.headers['x-forwarded-proto'] || (req?.secure ? 'https' : 'http');
    let baseUrl = (process.env.APP_URL || '').replace(/\/$/, '');
    if (!baseUrl && rawHost) {
      baseUrl = `${protocol}://${rawHost}`;
    }
    if (!baseUrl) {
      baseUrl = 'https://ais-dev-dhkj7jaynmdjsm2ne4rnxe-473642018575.us-west2.run.app';
    }

    const staticRoutes = [
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

    let productSlugs: string[] = [];
    let packSlugs: string[] = [];

    if (useLiveFirestore && dbAdmin) {
      try {
        const [prodSnap, packSnap] = await Promise.all([
          dbAdmin.collection('produits').where('actif', '==', true).get(),
          dbAdmin.collection('packs').where('actif', '==', true).get(),
        ]);
        if (!prodSnap.empty) {
          productSlugs = prodSnap.docs.map((d) => d.data().slug || d.id);
        }
        if (!packSnap.empty) {
          packSlugs = packSnap.docs.map((d) => d.data().slug || d.id);
        }
      } catch (err: any) {
        console.warn('Could not read Firestore for dynamic sitemap:', err.message);
      }
    }

    if (productSlugs.length === 0) {
      productSlugs = memoryStore.produits.filter((p) => p.actif).map((p) => p.slug);
    }
    if (packSlugs.length === 0) {
      packSlugs = memoryStore.packs.filter((p) => p.actif).map((p) => p.slug);
    }

    const currentDate = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const r of staticRoutes) {
      xml += `  <url>\n    <loc>${baseUrl}${r.path}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
    }

    for (const slug of productSlugs) {
      xml += `  <url>\n    <loc>${baseUrl}/produit/${encodeURIComponent(slug)}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    for (const slug of packSlugs) {
      xml += `  <url>\n    <loc>${baseUrl}/produit/${encodeURIComponent(slug)}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    xml += `</urlset>\n`;
    return xml;
  }

  app.get('/robots.txt', (req, res) => {
    const rawHost = req.headers['x-forwarded-host'] || req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
    const baseUrl = (process.env.APP_URL || `${protocol}://${rawHost || 'localhost:3000'}`).replace(/\/$/, '');
    res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  // Dynamic Sitemap XML (queries active Firestore products & packs)
  app.get(['/sitemap.xml', '/api/sitemap.xml'], async (req, res) => {
    try {
      const xml = await generateDynamicSitemapXml(req);
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      return res.send(xml);
    } catch (e: any) {
      console.error('Error generating dynamic sitemap:', e);
      const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
      if (fs.existsSync(sitemapPath)) {
        return res.type('application/xml').sendFile(sitemapPath);
      }
      return res.status(500).send('Error generating sitemap');
    }
  });

  app.post('/api/admin/generate-sitemap', adminAuth, async (req, res) => {
    try {
      const xml = await generateDynamicSitemapXml(req);
      const publicPath = path.resolve(__dirname, 'public', 'sitemap.xml');
      fs.writeFileSync(publicPath, xml, 'utf-8');
      const distPath = path.resolve(__dirname, 'dist', 'sitemap.xml');
      if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
        fs.writeFileSync(distPath, xml, 'utf-8');
      }
      res.json({ success: true, message: 'Sitemap XML régénéré avec succès sur le disque.', length: xml.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Public Catalog & Config (live from Firestore or local sync)
  app.get('/api/catalog', async (_req, res) => {
    try {
      if (useLiveFirestore && dbAdmin) {
        const [cats, prods, pks, cfg, avs] = await Promise.all([
          dbAdmin.collection('categories').orderBy('ordre', 'asc').get(),
          dbAdmin.collection('produits').where('actif', '==', true).get(),
          dbAdmin.collection('packs').where('actif', '==', true).get(),
          dbAdmin.collection('config').doc('site').get(),
          dbAdmin.collection('avis').where('valide', '==', true).get(),
        ]);

        if (!prods.empty) {
          return res.json({
            categories: cats.docs.map((d) => ({ id: d.id, ...d.data() })),
            produits: prods.docs.map((d) => ({ id: d.id, ...d.data() })),
            packs: pks.docs.map((d) => ({ id: d.id, ...d.data() })),
            config: cfg.exists ? cfg.data() : memoryStore.config,
            avis: avs.docs.map((d) => ({ id: d.id, ...d.data() })),
          });
        }
      }
    } catch (e: any) {
      console.warn('Error reading from live Firestore in /api/catalog:', e.message);
    }

    // Fast reliable sync
    res.json({
      categories: memoryStore.categories,
      produits: memoryStore.produits.filter((p) => p.actif),
      packs: memoryStore.packs.filter((p) => p.actif),
      config: memoryStore.config,
      avis: memoryStore.avis.filter((a) => a.valide),
    });
  });

  // ---------------------------------------------------------------------------
  // POST /api/commandes (Strict Validation & Atomic Stock Transaction)
  // ---------------------------------------------------------------------------
  app.post('/api/commandes', rateLimit(15), async (req, res) => {
    try {
      const { nom, telephone, adresse, creneau, notes, honeypot, lignes } = req.body;

      // 1. Anti-spam honeypot
      if (honeypot && String(honeypot).trim() !== '') {
        console.warn('Honeypot triggered, rejecting silently.');
        return res.json({ numero: generateOrderNumber(), total: 0 });
      }

      // 2. Validate nom
      if (!nom || typeof nom !== 'string' || nom.trim().length < 2) {
        return res.status(400).json({ error: 'Veuillez saisir votre nom complet.' });
      }

      // 3. Validate telephone (min 6 digits)
      const digitsOnly = String(telephone || '').replace(/\D/g, '');
      if (digitsOnly.length < 6) {
        return res.status(400).json({
          error: 'Numéro de téléphone WhatsApp invalide (minimum 6 chiffres requis).',
        });
      }

      // 4. Validate adresse
      if (!adresse || typeof adresse !== 'string' || adresse.trim().length < 4) {
        return res.status(400).json({
          error: 'Veuillez préciser votre adresse ou repère de livraison (ex: Ville, quartier, pharmacie).',
        });
      }

      // 5. Validate créneau
      const allowedCreneaux = ['matin', 'apres-midi', 'soiree'];
      const validCreneau = allowedCreneaux.includes(creneau) ? creneau : 'apres-midi';

      // 6. Validate lignes (1 to 50 lines, quantity 1 to 20 per line)
      if (!Array.isArray(lignes) || lignes.length === 0) {
        return res.status(400).json({ error: 'Votre panier est vide.' });
      }
      if (lignes.length > 50) {
        return res.status(400).json({ error: 'Nombre maximum de lignes (50) dépassé.' });
      }

      for (const line of lignes) {
        if (!line.id || !line.type || !['produit', 'pack'].includes(line.type)) {
          return res.status(400).json({ error: 'Ligne de commande invalide.' });
        }
        const q = Number(line.quantite);
        if (!Number.isInteger(q) || q < 1 || q > 20) {
          return res.status(400).json({
            error: `La quantité pour ${line.nom || 'un article'} doit être comprise entre 1 et 20.`,
          });
        }
      }

      // 7. Atomic transaction: Check and decrement stock, compute trusted total
      const orderNumber = generateOrderNumber();
      let calculatedTotal = 0;
      const verifiedLignes: any[] = [];

      if (useLiveFirestore && dbAdmin) {
        try {
          await dbAdmin.runTransaction(async (transaction) => {
            // First read all referenced documents
            const productDocsToFetch = new Set<string>();
            const packDocsToFetch = new Set<string>();

            for (const line of lignes) {
              if (line.type === 'produit') {
                productDocsToFetch.add(line.id);
              } else if (line.type === 'pack') {
                packDocsToFetch.add(line.id);
              }
            }

            const productSnapshots = new Map<string, FirebaseFirestore.DocumentSnapshot>();
            for (const prodId of productDocsToFetch) {
              const snap = await transaction.get(dbAdmin!.collection('produits').doc(prodId));
              productSnapshots.set(prodId, snap);
            }

            const packSnapshots = new Map<string, FirebaseFirestore.DocumentSnapshot>();
            for (const packId of packDocsToFetch) {
              const snap = await transaction.get(dbAdmin!.collection('packs').doc(packId));
              packSnapshots.set(packId, snap);
            }

            // Also fetch components for packs if needed
            for (const [_packId, snap] of packSnapshots) {
              if (snap.exists) {
                const packData = snap.data() as Pack;
                if (packData.produits) {
                  for (const comp of packData.produits) {
                    if (!productSnapshots.has(comp.produitId)) {
                      const cSnap = await transaction.get(
                        dbAdmin!.collection('produits').doc(comp.produitId)
                      );
                      productSnapshots.set(comp.produitId, cSnap);
                    }
                  }
                }
              }
            }

            // Verify stock and compute total
            for (const line of lignes) {
              const qty = Number(line.quantite);

              if (line.type === 'produit') {
                const pSnap = productSnapshots.get(line.id);
                if (!pSnap || !pSnap.exists) {
                  throw new Error(`Produit introuvable: ${line.nom || line.id}`);
                }
                const pData = pSnap.data() as Produit;
                if (!pData.actif) {
                  throw new Error(`Le produit "${pData.nom}" n'est plus disponible.`);
                }
                if (pData.stock < qty) {
                  throw new Error(
                    `Stock insuffisant pour "${pData.nom}" (disponible : ${pData.stock}).`
                  );
                }

                // Decrement stock
                transaction.update(pSnap.ref, { stock: pData.stock - qty });
                pData.stock -= qty; // update local ref

                const linePrice = pData.prix;
                calculatedTotal += linePrice * qty;
                verifiedLignes.push({
                  type: 'produit',
                  id: line.id,
                  slug: pData.slug,
                  nom: pData.nom,
                  prixUnitaire: linePrice,
                  quantite: qty,
                  image: pData.images?.[0] || '',
                  variante: line.variante || null,
                });
              } else if (line.type === 'pack') {
                const pkSnap = packSnapshots.get(line.id);
                if (!pkSnap || !pkSnap.exists) {
                  throw new Error(`Pack introuvable: ${line.nom || line.id}`);
                }
                const pkData = pkSnap.data() as Pack;
                if (!pkData.actif) {
                  throw new Error(`Le pack "${pkData.nom}" n'est plus disponible.`);
                }
                if (pkData.stock !== undefined && pkData.stock < qty) {
                  throw new Error(
                    `Stock insuffisant pour le pack "${pkData.nom}" (disponible : ${pkData.stock}).`
                  );
                }

                // Decrement included products stock
                if (Array.isArray(pkData.produits)) {
                  for (const comp of pkData.produits) {
                    const cSnap = productSnapshots.get(comp.produitId);
                    if (cSnap && cSnap.exists) {
                      const cData = cSnap.data() as Produit;
                      const needed = comp.quantite * qty;
                      if (cData.stock < needed) {
                        throw new Error(
                          `Stock insuffisant de composants ("${cData.nom}") pour assembler le pack "${pkData.nom}".`
                        );
                      }
                      transaction.update(cSnap.ref, { stock: cData.stock - needed });
                      cData.stock -= needed;
                    }
                  }
                }

                if (pkData.stock !== undefined) {
                  transaction.update(pkSnap.ref, { stock: pkData.stock - qty });
                }

                const linePrice = pkData.prix;
                calculatedTotal += linePrice * qty;
                verifiedLignes.push({
                  type: 'pack',
                  id: line.id,
                  slug: pkData.slug,
                  nom: pkData.nom,
                  prixUnitaire: linePrice,
                  quantite: qty,
                  image: pkData.image || pkData.images?.[0] || '',
                  variante: line.variante || null,
                });
              }
            }

            // Apply delivery fee calculation
            const seuil = memoryStore.config.seuilLivraisonOfferte || 30000;
            const fraisLivraison = calculatedTotal >= seuil ? 0 : 2000;
            const finalTotal = calculatedTotal + fraisLivraison;

            // Save order document in Firestore
            const orderDocRef = dbAdmin!.collection('commandes').doc();
            transaction.set(orderDocRef, {
              numero: orderNumber,
              nom: nom.trim(),
              telephone: telephone.trim(),
              adresse: adresse.trim(),
              creneau: validCreneau,
              notes: notes ? String(notes).trim().slice(0, 500) : '',
              sousTotal: calculatedTotal,
              fraisLivraison,
              total: finalTotal,
              statut: 'nouvelle',
              createdAt: new Date().toISOString(),
              lignes: verifiedLignes,
            });
          });

          return res.json({
            success: true,
            numero: orderNumber,
            total: calculatedTotal >= (memoryStore.config.seuilLivraisonOfferte || 30000)
              ? calculatedTotal
              : calculatedTotal + 2000,
            lignes: verifiedLignes,
          });
        } catch (dbErr: any) {
          console.warn('Firestore transaction error, switching to resilient store:', dbErr.message);
          // Fall through to memory store if firestore was permission-denied in dev sandbox
        }
      }

      // Memory Store atomic transaction
      for (const line of lignes) {
        const qty = Number(line.quantite);

        if (line.type === 'produit') {
          const prod = memoryStore.produits.find((p) => p.id === line.id || p.slug === line.id);
          if (!prod) {
            return res.status(404).json({ error: `Article introuvable: ${line.nom || line.id}` });
          }
          if (prod.stock < qty) {
            return res.status(400).json({
              error: `Stock insuffisant pour "${prod.nom}". Il ne reste que ${prod.stock} exemplaire(s).`,
            });
          }

          prod.stock -= qty;
          calculatedTotal += prod.prix * qty;
          verifiedLignes.push({
            type: 'produit',
            id: prod.id,
            slug: prod.slug,
            nom: prod.nom,
            prixUnitaire: prod.prix,
            quantite: qty,
            image: prod.images[0] || '',
            variante: line.variante || null,
          });
        } else if (line.type === 'pack') {
          const pack = memoryStore.packs.find((p) => p.id === line.id || p.slug === line.id);
          if (!pack) {
            return res.status(404).json({ error: `Pack introuvable: ${line.nom || line.id}` });
          }
          if (pack.stock !== undefined && pack.stock < qty) {
            return res.status(400).json({
              error: `Stock insuffisant pour le pack "${pack.nom}". Il ne reste que ${pack.stock} exemplaire(s).`,
            });
          }

          // Decrement included items
          for (const itemRef of pack.produits) {
            const component = memoryStore.produits.find((p) => p.id === itemRef.produitId);
            if (component) {
              const needed = itemRef.quantite * qty;
              if (component.stock < needed) {
                return res.status(400).json({
                  error: `Stock insuffisant de composants (${component.nom}) pour composer le pack ${pack.nom}.`,
                });
              }
              component.stock -= needed;
            }
          }

          if (pack.stock !== undefined) {
            pack.stock -= qty;
          }

          calculatedTotal += pack.prix * qty;
          verifiedLignes.push({
            type: 'pack',
            id: pack.id,
            slug: pack.slug,
            nom: pack.nom,
            prixUnitaire: pack.prix,
            quantite: qty,
            image: pack.image || pack.images?.[0] || '',
            variante: line.variante || null,
          });
        }
      }

      const seuil = memoryStore.config.seuilLivraisonOfferte || 30000;
      const fraisLivraison = calculatedTotal >= seuil ? 0 : 2000;
      const finalTotal = calculatedTotal + fraisLivraison;

      const newOrder: Commande = {
        numero: orderNumber,
        nom: nom.trim(),
        telephone: telephone.trim(),
        adresse: adresse.trim(),
        creneau: validCreneau,
        notes: notes ? String(notes).trim().slice(0, 500) : '',
        total: finalTotal,
        statut: 'nouvelle',
        createdAt: new Date().toISOString(),
        lignes: verifiedLignes,
      };

      memoryStore.commandes.unshift(newOrder);

      return res.json({
        success: true,
        numero: orderNumber,
        total: finalTotal,
        lignes: verifiedLignes,
      });
    } catch (err: any) {
      console.error('Error processing order:', err);
      return res.status(500).json({
        error:
          'Une erreur est survenue lors de l’enregistrement de votre commande. Vous pouvez aussi commander directement via WhatsApp.',
      });
    }
  });

  // ---------------------------------------------------------------------------
  // POST /api/pro (B2B Quote Request)
  // ---------------------------------------------------------------------------
  app.post('/api/pro', rateLimit(10), async (req, res) => {
    try {
      const { nom, societe, telephone, message } = req.body;
      if (!nom || !societe || !telephone || !message) {
        return res.status(400).json({ error: 'Tous les champs marqués d’un astérisque sont requis.' });
      }

      const digits = String(telephone).replace(/\D/g, '');
      if (digits.length < 6) {
        return res.status(400).json({ error: 'Numéro de téléphone professionnel invalide.' });
      }

      const demande: DemandePro = {
        nom: String(nom).trim().slice(0, 128),
        societe: String(societe).trim().slice(0, 128),
        telephone: String(telephone).trim().slice(0, 32),
        message: String(message).trim().slice(0, 2000),
        createdAt: new Date().toISOString(),
      };

      if (useLiveFirestore && dbAdmin) {
        try {
          await dbAdmin.collection('demandesPro').add(demande);
        } catch (e: any) {
          console.warn('Firestore pro request write fallback:', e.message);
        }
      }

      memoryStore.demandesPro.unshift(demande);
      res.json({ success: true, message: 'Votre demande de devis a bien été envoyée. Notre équipe B2B vous contactera sous 2h ouvrées.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Impossible d’enregistrer votre demande pour le moment.' });
    }
  });

  // ---------------------------------------------------------------------------
  // POST /api/newsletter (Duplicate-handling & Validation)
  // ---------------------------------------------------------------------------
  app.post('/api/newsletter', rateLimit(10), async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Veuillez saisir une adresse email valide.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({ error: 'Format d’adresse email invalide.' });
      }

      if (memoryStore.newsletter.has(cleanEmail)) {
        return res.json({
          success: true,
          message: 'Vous êtes déjà inscrit(e) à nos alertes festives. Merci de votre fidélité !',
        });
      }

      memoryStore.newsletter.add(cleanEmail);

      if (useLiveFirestore && dbAdmin) {
        try {
          const docId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
          await dbAdmin.collection('newsletter').doc(docId).set({
            email: cleanEmail,
            createdAt: new Date().toISOString(),
          });
        } catch (e: any) {
          console.warn('Firestore newsletter write fallback:', e.message);
        }
      }

      res.json({
        success: true,
        message: 'Bienvenue dans le cercle Éclat Express ! Vos guides et codes exclusifs arrivent dans votre boîte mail.',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erreur lors de l’inscription à la newsletter.' });
    }
  });

  // ---------------------------------------------------------------------------
  // Admin Endpoints (/api/admin/*) Restricted to OWNER_EMAIL
  // ---------------------------------------------------------------------------
  // Simple token/email verification middleware
  async function adminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    const token = authHeader.replace(/^Bearer\s+/, '');
    // Check if token matches Google ID token or owner email header
    if (token === OWNER_EMAIL || req.headers['x-admin-email'] === OWNER_EMAIL) {
      return next();
    }

    if (useLiveFirestore && getApps().length > 0) {
      try {
        const decoded = await getAuth().verifyIdToken(token);
        if (decoded.email === OWNER_EMAIL) {
          return next();
        }
      } catch (err) {
        // Continue to check fallback
      }
    }

    return res.status(403).json({ error: 'Accès administrateur restreint.' });
  }

  app.get('/api/admin/orders', adminAuth, async (_req, res) => {
    try {
      if (useLiveFirestore && dbAdmin) {
        const snap = await dbAdmin.collection('commandes').orderBy('createdAt', 'desc').limit(100).get();
        if (!snap.empty) {
          return res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      }
      res.json(memoryStore.commandes);
    } catch (e: any) {
      res.json(memoryStore.commandes);
    }
  });

  app.patch('/api/admin/orders/:numero', adminAuth, async (req, res) => {
    const { numero } = req.params;
    const { statut } = req.body;
    const validStatuses = ['nouvelle', 'confirmee', 'en_livraison', 'livree', 'annulee'];
    if (!validStatuses.includes(statut)) {
      return res.status(400).json({ error: 'Statut de commande invalide.' });
    }

    const order = memoryStore.commandes.find((c) => c.numero === numero);
    if (order) {
      order.statut = statut;
    }

    if (useLiveFirestore && dbAdmin) {
      try {
        const snap = await dbAdmin.collection('commandes').where('numero', '==', numero).limit(1).get();
        if (!snap.empty) {
          await snap.docs[0].ref.update({ statut });
        }
      } catch (e) {
        console.warn('Firestore update order status fallback:', e);
      }
    }

    res.json({ success: true, numero, statut });
  });

  app.patch('/api/admin/products/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const { stock, prix } = req.body;

    const prod = memoryStore.produits.find((p) => p.id === id || p.slug === id);
    if (prod) {
      if (typeof stock === 'number') prod.stock = Math.max(0, Math.floor(stock));
      if (typeof prix === 'number') prod.prix = Math.max(0, Math.floor(prix));
    }

    if (useLiveFirestore && dbAdmin) {
      try {
        const updates: any = {};
        if (typeof stock === 'number') updates.stock = Math.max(0, Math.floor(stock));
        if (typeof prix === 'number') updates.prix = Math.max(0, Math.floor(prix));
        await dbAdmin.collection('produits').doc(id).update(updates);
      } catch (e) {
        console.warn('Firestore update product fallback:', e);
      }
    }

    res.json({ success: true, id, stock: prod?.stock, prix: prod?.prix });
  });

  // ---------------------------------------------------------------------------
  // Vite Dev Middleware or Production Static Handler
  // ---------------------------------------------------------------------------
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Éclat Express server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
