# LBN Ébénisterie – site web

Site vitrine statique (HTML, CSS, JavaScript natif) de **LBN Ébénisterie**, ébénisterie et menuiserie à Marly / Fribourg.
Aucun outil de compilation, aucune dépendance à installer : le site fonctionne tel quel sur GitHub Pages.

---

## 1. Arborescence

```
/
├── index.html                  Page d'accueil (one-page : atelier, prestations, méthode, réalisations, contact)
├── mentions-legales.html       Mentions légales et protection des données
├── css/
│   └── style.css               Styles (couleurs, polices et dimensions en variables CSS en haut du fichier)
├── js/
│   └── script.js               Menu mobile, galerie, filtres, horaires, formulaire
├── assets/
│   ├── icons/
│   │   └── sprite.svg          Icônes (téléphone, e-mail, réseaux sociaux…)
│   └── images/
│       ├── brand/              Logo (PNG transparent) et image de partage (og-image.jpg)
│       └── realisations/       Photos optimisées : AVIF + JPEG, en 720 px et 1600 px
├── favicon.svg                 Icône d'onglet (tuiles du logo)
├── apple-touch-icon.png        Icône pour l'écran d'accueil iPhone / iPad
├── robots.txt
├── sitemap.xml
├── README.md
└── _sources/                   Photos et logo d'origine (non publiés : GitHub Pages ignore les dossiers « _ »)
```

---

## 2. Fonctionnalités

| Élément | Détail |
|---|---|
| En-tête fixe | Logo, navigation, téléphone cliquable, bouton « Demander un devis » ; section active soulignée |
| Menu mobile | Plein écran, se ferme avec Échap, au clic sur un lien ou en passant en grand écran ; focus géré au clavier |
| Accueil | Titre, présentation, boutons « Devis » et « Appeler », photo de réalisation |
| L'atelier | Présentation reprise du site actuel (aucune information inventée) |
| Prestations | 4 domaines (ébénisterie, menuiserie intérieure, extérieure, entretien) ; « Tarif : sur devis » ; chaque lien présélectionne le type de projet dans le formulaire |
| Méthode | Entretien conseil → devis et plans (2D, 3D, croquis) → réalisation et suivi |
| Réalisations | 14 photos, filtres (Cuisines / Agencements et portes / Mobilier), visionneuse plein écran (clavier, flèches, glissement au doigt) |
| Contact | Appel, e-mail, deux adresses, itinéraire Google Maps, horaires avec statut « Ouvert / Fermé » calculé à l'heure de Zurich, réseaux sociaux |
| Formulaire de devis | Validation avec messages d'erreur clairs ; envoi via la messagerie du visiteur (ou via un service de formulaires, voir § 4) |
| Barre mobile | Boutons « Appeler » et « Demander un devis » fixés en bas de l'écran sur smartphone |
| SEO | Titre et description uniques, H1/H2/H3 cohérents, textes alternatifs, Open Graph, données structurées Schema.org (`HomeAndConstructionBusiness`), sitemap |
| Accessibilité | Lien d'évitement, focus visibles, contrastes AA, libellés de formulaire, `prefers-reduced-motion` respecté |
| Performance | Images AVIF (≈ 300 Ko pour toutes les vignettes), chargement différé, dimensions fixées, 2 polices / 4 variantes, aucun framework |
| Confidentialité | Aucun cookie, aucun outil de statistiques, polices via Bunny Fonts (alternative européenne à Google Fonts) |

---

## 3. Informations à compléter ou vérifier avant la mise en ligne

1. **Adresse définitive du site** – remplacer partout `https://UTILISATEUR.github.io/NOM-DU-DEPOT/`
   (balises Open Graph et données structurées de `index.html`, `robots.txt`, `sitemap.xml`).
   Depuis le dossier du projet, sur Mac :
   ```bash
   grep -rl "https://UTILISATEUR.github.io/NOM-DU-DEPOT/" --include=*.html --include=*.xml --include=*.txt . | xargs sed -i '' 's#https://UTILISATEUR.github.io/NOM-DU-DEPOT/#https://VOTRE-ADRESSE/#g'
   ```
   (sous Linux : `sed -i` sans les `''`). L'adresse doit se terminer par `/`.
2. **Mentions légales** (`mentions-legales.html`, éléments surlignés en jaune) : raison sociale et forme juridique, personne responsable, numéro IDE si l'entreprise est inscrite au registre du commerce.
3. **Photos** : vérifier que les 14 photos sont bien des réalisations de LBN et que les légendes sont exactes (elles décrivent seulement ce qui est visible, sans préciser d'essence de bois).
4. **Propriété intellectuelle** : confirmer que LBN détient les droits sur les photos et le logo.
5. **Faire relire** les mentions légales par une personne compétente : elles décrivent les fonctionnalités réelles du site, mais ne constituent pas un avis juridique.

Informations **volontairement absentes** faute de données vérifiées : avis clients, années d'expérience, certifications, tarifs, zone d'intervention précise (seul « canton de Fribourg » est indiqué, d'après le site actuel), coordonnées GPS.

---

## 4. Formulaire de contact

GitHub Pages n'exécute pas de code serveur : le formulaire ne peut pas envoyer d'e-mail seul.

**Fonctionnement par défaut (aucune configuration)** : au clic sur « Envoyer », le logiciel de messagerie du visiteur s'ouvre avec un e-mail pré-rempli (objet, coordonnées, description), adressé à `marcbovigny@leboisnaturellement.ch`. Le visiteur n'a plus qu'à l'envoyer et peut y joindre photos ou plans.
Limite : le visiteur doit disposer d'une messagerie configurée sur son appareil (c'est le cas sur la plupart des smartphones). Le message affiché après le clic rappelle l'adresse e-mail et le numéro de téléphone.

**Option recommandée pour un envoi direct : Formspree** (offre gratuite limitée en nombre d'envois par mois)
1. Créer un compte sur <https://formspree.io> avec l'adresse de l'entreprise.
2. Créer un formulaire et copier son adresse (de la forme `https://formspree.io/f/abcdwxyz`).
3. Dans `index.html`, sur la balise `<form … data-quote-form`, renseigner : `data-endpoint="https://formspree.io/f/abcdwxyz"`.
4. Mettre à jour le paragraphe « Demandes de contact et de devis » de `mentions-legales.html` : les données transitent alors par Formspree (entreprise américaine).
5. Publier, envoyer une demande test et confirmer l'adresse e-mail dans Formspree.

Le script envoie alors la demande sans quitter la page, affiche un message de confirmation ou d'erreur, et le texte d'information sous le bouton change automatiquement. Ce lien n'est pas une clé secrète : il peut figurer dans le code public.

---

## 5. Publier sur GitHub Pages

1. Créer un compte sur <https://github.com> si nécessaire.
2. Cliquer sur **New repository**, nommer le dépôt (ex. `lbn-ebenisterie`), le laisser **Public**, puis **Create repository**.
3. Ajouter les fichiers :
   - **Sans ligne de commande** : sur la page du dépôt, *Add file → Upload files*, glisser **le contenu** du dossier du projet (pas le dossier lui-même ; `index.html` doit se trouver à la racine), puis *Commit changes*.
   - **Avec Git** (depuis le dossier du projet) :
     ```bash
     git init && git add . && git commit -m "Site LBN Ébénisterie" && git branch -M main
     git remote add origin https://github.com/UTILISATEUR/lbn-ebenisterie.git
     git push -u origin main
     ```
4. Vérifier que `index.html` est à la racine du dépôt.
5. Ouvrir **Settings → Pages**.
6. Dans *Build and deployment* : *Source* = **Deploy from a branch**, *Branch* = **main**, dossier **/ (root)**.
7. Cliquer sur **Save**.
8. Attendre 1 à 2 minutes (l'avancement est visible dans l'onglet *Actions*).
9. Ouvrir l'adresse affichée : `https://UTILISATEUR.github.io/lbn-ebenisterie/`.
10. Vérifier le site sur ordinateur et sur smartphone (checklist § 7), puis remplacer l'adresse provisoire (§ 3.1).

Tous les chemins sont relatifs : le site fonctionne aussi bien dans un sous-dossier (`/lbn-ebenisterie/`) qu'à la racine d'un domaine.

### Utiliser le domaine leboisnaturellement.ch (facultatif)
1. *Settings → Pages → Custom domain* : saisir `www.leboisnaturellement.ch`, puis *Save*.
2. Chez le gestionnaire du domaine, créer :
   - un enregistrement **CNAME** `www` → `UTILISATEUR.github.io`
   - quatre enregistrements **A** pour le domaine nu → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Une fois le domaine vérifié, cocher **Enforce HTTPS**.
4. Remplacer l'adresse provisoire par `https://www.leboisnaturellement.ch/` (§ 3.1).

Attention : le site actuel est hébergé ailleurs ; changer les DNS remplace ce site par le nouveau.

---

## 6. Modifier le site

Modifier un fichier, puis le republier (sur GitHub : ouvrir le fichier → icône crayon → *Commit changes* ; ou `git add . && git commit -m "…" && git push`). La mise à jour est en ligne en 1 à 2 minutes.

- **Coordonnées** : rechercher `076 522 11 59`, `+41765221159` et `marcbovigny@` dans `index.html` et `mentions-legales.html`.
- **Horaires** : dans `index.html`, modifier pour chaque jour l'attribut `data-hours` (utilisé pour le statut « Ouvert / Fermé ») **et** le texte affiché, puis le bloc `openingHoursSpecification` des données structurées (en haut du fichier).
- **Prestations** : section `<!-- PRESTATIONS -->` de `index.html`. Si un nouveau type de projet est ajouté, l'ajouter aussi à la liste `<select>` du formulaire (même texte que l'attribut `data-service` du lien).
- **Couleurs, polices, arrondis** : variables en tête de `css/style.css` (`--color-…`, `--font-…`, `--radius-…`).
- **Ajouter une photo** :
  1. Ouvrir la photo dans <https://squoosh.app>, la redimensionner à 720 px (grand côté), exporter en **AVIF** puis en **JPEG** ; recommencer en 1600 px.
  2. Nommer les fichiers `nom-descriptif-720.avif`, `-720.jpg`, `-1600.avif`, `-1600.jpg` et les déposer dans `assets/images/realisations/`.
  3. Copier un bloc `<li class="gallery__item">` de la galerie, adapter les chemins, `width` / `height` (dimensions de la version 720), `data-width` / `data-height` (version 1600), le texte `alt`, la légende et `data-category` (`cuisine`, `agencement` ou `mobilier`). Ajouter `gallery__item--tall` pour une photo verticale.

---

## 7. Checklist après publication

- [ ] La page s'affiche sans erreur à l'adresse GitHub Pages, logo et photos compris.
- [ ] Navigation : chaque lien du menu mène à la bonne section (ordinateur et smartphone).
- [ ] Menu mobile : il s'ouvre, se ferme et se parcourt au clavier (Tab, Échap).
- [ ] Les boutons « Appeler » composent bien le 076 522 11 59 sur smartphone.
- [ ] Les liens e-mail ouvrent la messagerie avec la bonne adresse.
- [ ] Le formulaire affiche les erreurs si un champ obligatoire est vide, puis ouvre l'e-mail pré-rempli (ou envoie via Formspree si configuré). Faire un envoi test.
- [ ] Le lien « Itinéraire vers l'atelier » ouvre Google Maps sur Rte de Corbaroche 7, Marly.
- [ ] Les liens Instagram, Facebook et Pinterest ouvrent les bons profils.
- [ ] Galerie : filtres, ouverture de la visionneuse, flèches et fermeture.
- [ ] Le statut des horaires correspond à l'heure réelle.
- [ ] La page Mentions légales est complétée (§ 3.2).
- [ ] Les adresses provisoires `UTILISATEUR.github.io/NOM-DU-DEPOT` sont remplacées (§ 3.1).
- [ ] Test de partage : <https://www.opengraph.xyz> affiche le titre, la description et l'image.
- [ ] Données structurées : <https://search.google.com/test/rich-results> ne signale pas d'erreur.
- [ ] Mesure Lighthouse (Chrome → Outils de développement → Lighthouse) en mode mobile.
- [ ] Google Search Console : ajouter le site et soumettre `sitemap.xml`.
- [ ] Google Business Profile : vérifier que nom, adresse, téléphone et horaires sont identiques au site, et y ajouter le lien du nouveau site.

---

## 8. Limitations connues

- **Formulaire** : sans service externe, l'envoi passe par la messagerie du visiteur (§ 4).
- **robots.txt et sitemap.xml** ne sont lus par les moteurs de recherche qu'à la racine d'un domaine : ils ne sont pleinement utiles qu'avec un domaine personnalisé (ou un dépôt `UTILISATEUR.github.io`). Le sitemap peut de toute façon être soumis manuellement dans Google Search Console.
- **Statut « Ouvert / Fermé »** : il se base sur les horaires hebdomadaires et ne tient pas compte des jours fériés ni des vacances.
- **Avis clients** : aucune section d'avis, faute d'avis authentiques fournis. Si des avis Google existent, un lien vers la fiche Google peut être ajouté.
- **Carte** : un lien d'itinéraire a été préféré à une carte intégrée (plus léger, sans traceur tiers).
- **Polices** : chargées depuis Bunny Fonts. Pour ne dépendre d'aucun service tiers, télécharger les fichiers `.woff2` (Cormorant Garamond 500 et 500 italique, Jost 400 et 500), les placer dans `assets/fonts/` et remplacer la balise `<link>` des polices par des règles `@font-face`.
- **Performances** : aucun score Lighthouse n'a été mesuré dans l'environnement de développement ; le mesurer après publication.
