# Administration Moluki Alembakate

Le site public, le panier, le catalogue et l’enregistrement des commandes restent en place. `/admin` est le centre de contrôle. Il lit et écrit les mêmes fichiers locaux, à travers des dépôts dédiés. Aucun composant d’interface n’ouvre un JSON.

Les fichiers locaux ne sont pas une base de production. Chaque dépôt pourra être remplacé par Supabase/PostgreSQL sans changer les pages.

## Navigation

Barre latérale, icônes outline.

| Entrée | Route |
| --- | --- |
| Overview | `/admin` |
| Commandes | `/admin/orders` |
| Catalogue | `/admin/products` |
| Stock | `/admin/inventory` |
| Clients | `/admin/customers` |
| Promotions | `/admin/promotions` |
| Analytics | `/admin/analytics` |
| Rapports | `/admin/reports` |
| Contenu | `/admin/content` |
| Paramètres | `/admin/settings` |

Routes liées, accessibles depuis ces sections :

- `/admin/orders/[id]`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/categories`
- `/admin/collections`
- `/admin/customers/[id]`
- `/admin/media`
- `/admin/search`

Le logo et « Voir la boutique » renvoient à `/`. L’aperçu ouvre le site public dans un nouvel onglet.

Sur mobile, la barre devient un panneau. À partir de la tablette, elle se réduit aux icônes, puis reprend les libellés sur grand écran.

## Authentification et rôles

Un seul accès aujourd’hui : `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans l’environnement, cookie httpOnly signé. Le mot de passe n’est pas écrit dans le code ni dans le journal.

Le rôle effectif de cette session est `owner`. Les permissions prévues :

- `products.read`, `products.write`
- `orders.read`, `orders.write`
- `inventory.read`, `inventory.write`
- `customers.read`
- `analytics.read`
- `settings.write`

Rôles prévus pour plus tard : `owner`, `admin`, `manager`, `editor`. Aucun second compte n’est inventé.

## Données

| Dépôt | Source actuelle | Rôle |
| --- | --- | --- |
| `productsRepository` | `lib/inventory.ts`, `data/overrides.json`, catalogue de base | pièces, prix, images, variantes, archivage |
| `ordersRepository` | `data/orders.json` | commandes, statuts, notes, historique |
| `customersRepository` | dérivé des commandes | profil, commandes, montants |
| `inventoryRepository` | stock produit + `data/stock-movements.json` | seuils, mouvements |
| `analyticsRepository` | commandes et pièces réelles | KPI, séries, tops |
| `promotionsRepository` | `data/promotions.json` | codes et campagnes |
| `taxonomyRepository` | catalogue de base + `data/taxonomy.json` | catégories et collections |
| `contentRepository` | `data/content.json` | textes préparés, non branchés à la vitrine |
| `settingsRepository` | `data/settings.json` | seuil, contact, SEO |
| `mediaRepository` | `public/media` | bibliothèque, dépôts dans `uploads` |
| `auditRepository` | `data/audit.json` | qui, quoi, quand |
| `searchRepository` | produits, commandes, clients | recherche d’en-tête |

Le chiffre d’affaires ne compte que les commandes dont le paiement est `paid`. Aujourd’hui le prestataire est `unconfigured` et le statut reste `not_charged` : le CA affiché est donc 0, sans pourcentage inventé. Les commandes enregistrées sont montrées à part, comme des demandes, pas comme des ventes encaissées.

Statuts de commande : `pending_payment` (nouvelle), `confirmed`, `preparing`, `shipped`, `delivered`, `cancelled`. L’encaissement n’est pas simulé depuis l’admin.

Variantes : taille, couleur, stock, SKU. Le stock public reste la somme des variantes, pour ne pas casser la boutique.

Les nouvelles catégories et collections sont enregistrées pour l’admin. La vitrine publique lit encore le catalogue de base, afin de ne pas modifier Shop ni les collections publiques dans cette étape.

## Composants

- `AdminGate` : entrée
- `AdminShell` : barre, en-tête, recherche, notifications, profil
- `Kpi`, `SalesChart`, `EmptyState`, `ConfirmButton`
- formulaires produit, commande, stock, promotion, réglages

Les tableaux passent en cartes sous le point de rupture mobile. Les pages vides expliquent l’absence de données. `app/admin/loading.tsx` couvre le chargement.

## Évolutions

1. Brancher les dépôts sur Postgres.
2. Appliquer les codes promo au checkout.
3. Lire le contenu admin sur la homepage.
4. Publier les catégories créées dans la boutique.
5. Ajouter les comptes et les permissions réelles.
6. Export PDF des rapports.
