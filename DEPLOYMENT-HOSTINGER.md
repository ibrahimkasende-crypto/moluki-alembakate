# Déploiement Hostinger — Moluki Alembakate

Application Next.js déployée comme Node.js Web App, depuis le dépôt GitHub `moluki-alembakate`.

Adresse publique : `https://moluki.newsystemcorps.com`

## Version Node

Next.js 16.1.7 exige Node.js 20.9 ou plus récent.

Sur Hostinger, choisir **Node.js 22**.

La machine locale peut utiliser une version plus récente. Le champ `engines` de `package.json` refuse une version inférieure à 20.9.

## Commandes

| Étape | Commande |
| --- | --- |
| Installation | `npm install` |
| Build | `npm run build` (`next build --webpack`) |
| Démarrage | `npm run start` |

`npm run start` lance `next start`. Next.js écoute la variable `PORT` fournie par Hostinger, sinon le port 3000.

Le build utilise Webpack. Le compilateur Turbopack de Next.js 16 s'interrompt sur le constructeur Hostinger.

## Variables d'environnement

À définir dans le panneau Hostinger **avant** le build. Les variables `NEXT_PUBLIC_` sont figées au moment de `npm run build`.

| Nom | Rôle |
| --- | --- |
| `ADMIN_EMAIL` | Compte de connexion à `/admin` |
| `ADMIN_PASSWORD` | Mot de passe de `/admin` |
| `NEXT_PUBLIC_SITE_URL` | `https://moluki.newsystemcorps.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numéro WhatsApp, chiffres seuls. Vide si inutilisé |
| `NEXT_PUBLIC_INSTAGRAM_URL` | URL Instagram. Vide si inutilisé |

Ne pas coller ces valeurs dans le dépôt. Le fichier `.env.example` ne contient que les noms. `.env`, `.env.local` et `.env.production` sont ignorés par Git.

Si `NEXT_PUBLIC_SITE_URL` est absente au build, le code retombe sur `https://moluki.newsystemcorps.com`. Cette adresse sert au sitemap, à `robots.txt` et aux balises Open Graph.

## Configuration Hostinger

1. hPanel → Websites → Node.js → Create application, ou l'application déjà liée au dépôt.
2. Méthode : **Deploy from GitHub**.
3. Dépôt : `moluki-alembakate`, branche `main`.
4. Framework : Next.js.
5. Node.js : **22**.
6. Répertoire racine : `/` (la racine du dépôt).
7. Build command : `npm run build`
8. Start command : `npm run start`
9. Ne pas activer une sortie statique seule. L'application a des pages dynamiques et des routes API.
10. Variables d'environnement : la liste ci-dessus.
11. Domaine : `moluki.newsystemcorps.com`, avec HTTPS.

Aucun fichier d'entrée `.js` n'est à indiquer. Le démarrage est `npm run start`.

## Procédure de déploiement

1. Pousser `main` sur GitHub.
2. Renseigner les variables d'environnement dans Hostinger.
3. Lancer le déploiement. Hostinger installe les dépendances, exécute le build, puis `npm run start`.
4. Attendre que le build soit indiqué comme réussi avant d'ouvrir le domaine.

## Procédure de redéploiement

1. Pousser le nouveau commit sur `main`.
2. Dans Hostinger, relancer le déploiement depuis GitHub.
3. Si une variable `NEXT_PUBLIC_` a changé, la modifier **puis** relancer le build. Un simple redémarrage ne suffit pas.
4. Vérifier à nouveau les pages listées plus bas.

Un redéploiement reconstruit l'application depuis Git. Les fichiers JSON créés sur le serveur dans `data/` et les images déposées dans `public/media/uploads/` peuvent disparaître s'ils ne font pas partie du dépôt.

## Données

Les commandes, messages, inscriptions, stocks modifiés, promotions et réglages sont écrits dans des fichiers JSON sous `data/`. Ce n'est pas une base de données. Ce n'est pas un stockage fiable pour la production.

Le code d'accès est déjà séparé :

- `lib/store.ts` lit et écrit les fichiers ;
- `lib/repositories/` est le point prévu pour remplacer ce stockage par Supabase ou PostgreSQL.

Le paiement n'est pas connecté. Une commande enregistrée a le statut de paiement « non facturé ». Aucune clé de paiement n'est requise.

## Médias

Les images et les vidéos sont dans `public/media/` et appelées par des chemins du type `/media/videos/hero-fashion.mp4`. Elles ne dépendent pas de localhost. Elles sont servies par le même domaine que le site.

## Après la mise en ligne

- `https://moluki.newsystemcorps.com` affiche l'accueil.
- `/shop`, `/collections`, `/lookbook`, `/about`, `/contact`, `/cart`, `/checkout` répondent.
- `/sitemap.xml` et `/robots.txt` utilisent `https://moluki.newsystemcorps.com`.
- `/robots.txt` interdit `/admin` et `/api/`.
- Une vidéo, par exemple `/media/videos/hero-fashion.mp4`, se charge depuis le domaine public.
- `/admin` affiche la connexion. L'entrée se fait avec les variables d'environnement, pas avec une valeur écrite dans le code.
- Passer une commande de test, puis la retrouver dans `/admin/orders`.
- Le cadenas HTTPS est actif sur le sous-domaine.
