# Rapport de choix de base — MOLUKI ALEMBAKATE

Date : 30 septembre 2026

## État du projet actuel

Le dossier `d:\MULUKI` ne contenait aucun code : uniquement `Muluki.jpeg`, la photographie de référence de la griffe (tee-shirt ivoire, wordmark bordeaux en deux lignes, pantalon clair, pose contemporaine). Aucune architecture, aucune dépendance, aucun Supabase à conserver.

## Bases étudiées

| Base | Source | Licence | Verdict |
| --- | --- | --- | --- |
| Your Next Store | https://github.com/yournextstore/yournextstore | MIT (vitrine) | Écartée. Le catalogue, le panier et les commandes passent par l’API hébergée YNS (`YNS_API_KEY`, service payant). Pas de backend autonome. |
| Vercel Next.js Commerce | https://github.com/vercel/commerce | MIT | Écartée pour l’exécution. Excellente qualité, mais la version maintenue exige une boutique Shopify et des secrets pour démarrer. Incompatible avec une mise en route locale immédiate. |
| Fashion Ecommerce | https://github.com/NafisRayan/Fashion-Ecommerce | MIT | Écartée comme fondation principale. Next.js 14, interface proche d’un template Figma générique, dépôt peu mature (fichier de crash inclus). |
| Clothing Store | pas de dépôt de référence stable, licence claire et qualité suffisante | — | Aucun candidat retenu. |
| XILAR | marque commerciale (xilar.in), pas un template open source | — | Inutilisable légalement comme base de code. |
| **E-commerce shadcn / Next.js** | **https://github.com/shadcnspace/ecommerce-shadcn-nextjs-template** | **MIT © 2026 ShadcnSpace** | **Retenue.** |

## Base choisie

- **Nom :** E-commerce Template with shadcn/ui & Next.js
- **Dépôt :** https://github.com/shadcnspace/ecommerce-shadcn-nextjs-template
- **Licence :** MIT. Usage commercial, modification et redistribution autorisés, à condition de conserver la notice de copyright. Le fichier `LICENSE` est conservé.
- **Stack :** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion, composants accessibles.

### Pourquoi elle est adaptée

Elle démarre sans Shopify, sans Stripe et sans clé API. Elle apporte déjà le squelette d’une boutique (catalogue, fiche produit, panier, wishlist, checkout, pages institutionnelles) et une pile moderne compatible avec les animations demandées. Le code est suffisamment simple pour être personnalisé sans combattre une couche headless imposée.

Your Next Store et Vercel Commerce sont de meilleure notoriété, mais ils ne peuvent pas servir de boutique exploitable ici sans un compte tiers. Les importer aurait laissé un site non lançable ou juridiquement lié à un service payant.

## Ce qui est conservé

- Licence MIT (`LICENSE`)
- Socle Next.js 16 / React 19 / TypeScript / Tailwind CSS 4
- Bibliothèque d’animation Motion
- Principe du panier persistant (localStorage), étendu aux variantes taille et couleur
- Principe de la wishlist
- Utilitaire `cn` (clsx + tailwind-merge)
- Structure App Router, métadonnées, images via `next/image`

## Ce qui est remplacé

- Toute l’interface « Nova » du template (hero, grilles, cartes, footer, logo cloud Nike / Adidas / Puma / Vogue)
- Les visuels et produits génériques (électronique, cosmétiques, sacs, montres, logos de marques tierces — non réutilisés)
- La palette, la typographie et les textes
- Le modèle produit, trop pauvre (pas de variantes, collections, stock, badges)
- Le checkout qui simulait une confirmation décorative

## Ce qui est ajouté

- Identité MOLUKI ALEMBAKATE (wordmark, monogramme discret, favicon, palette ivoire / noir / bordeaux)
- Pages : accueil éditorial, boutique filtrable, collections, produit, lookbook, à propos, contact, panier, checkout, conditions, confidentialité
- Administration locale `/admin` (produits, stock, prix, commandes) sur fichiers JSON, sans encaissement
- Architecture de paiement extensible : les commandes sont enregistrées en `pending_payment`, aucun paiement n’est simulé comme réussi
- SEO : title, description, Open Graph, Twitter, sitemap, robots, JSON-LD
- Animations sobres, respect de `prefers-reduced-motion`
- Photographie client conservée comme référence de griffe ; visuels éditoriaux de démonstration remplaçables dans `lib/catalog.ts` et `public/`
