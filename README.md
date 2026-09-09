# Site NAVOR GROUP

Site vitrine de NAVOR GROUP — entreprise de services du numérique basée à Lomé, Togo.
« Conçu pour tenir ses promesses. »

## Voir le site

Aucune installation n'est nécessaire : ce sont des pages HTML statiques.

- **Le plus simple** : ouvrir `index.html` dans un navigateur.
- **Avec un petit serveur local** (recommandé, les liens entre pages fonctionnent mieux) :

```bash
python3 -m http.server 4300
```

Puis ouvrir http://localhost:4300

## Structure

| Fichier | Page |
|---|---|
| `index.html` | Accueil |
| `qui-sommes-nous.html` | Qui sommes-nous — les fondateurs |
| `offres.html` | Nos offres — les 4 domaines |
| `methode.html` | Notre méthode — cadrer, construire, transmettre |
| `valeurs.html` | Nos valeurs |
| `contact.html` | Contact |
| `mentions-legales.html` | Mentions légales |
| `assets/style.css` | Feuille de style unique, partagée par toutes les pages |
| `assets/script.js` | Menu mobile, animation de la page Méthode, formulaire |
| `assets/*.svg` `*.png` | Logos |
| `sitemap.xml` `robots.txt` | Référencement |

## Publier un article

Créer un fichier dans `contenu/articles/`, par exemple `mon-sujet.txt` :

```
titre: Le titre de l'article
description: La phrase que Google affichera sous le titre.
chapeau: L'accroche affichée en haut de la page.
date: 2026-09-15
---
<p>Le corps de l'article, en HTML simple.</p>
<h2>Un intertitre</h2>
<p>La suite.</p>
```

Puis :

```bash
python3 outils/publier.py
```

La page de l'article, la liste `articles.html` et le `sitemap.xml` sont
régénérés. Le nom du fichier devient l'adresse de la page — le choisir court
et descriptif, il compte pour le référencement.

## Modifier le menu ou le pied de page

Ils ne sont écrits qu'une seule fois, dans `gabarit/entete.html` et
`gabarit/pied.html`. Après modification :

```bash
python3 outils/gabarit.py
```

L'outil les recopie dans les dix-sept pages, en adaptant les chemins des
sous-dossiers et en marquant l'entrée de menu active. Il ne touche à rien
d'autre.

**Ne pas modifier l'en-tête ou le pied directement dans une page** : le
prochain passage de l'outil écraserait la modification.

## Modifier un texte

Tous les textes sont directement dans les fichiers `.html`, en clair. Pour corriger une
phrase, il suffit de l'éditer dans le fichier de la page concernée.

Les couleurs, tailles et espacements sont centralisés en haut de `assets/style.css`,
dans le bloc `:root` — les modifier là les change sur tout le site.

## Points à finaliser avant la mise en ligne

- [ ] Nom de l'hébergeur, à renseigner dans `mentions-legales.html` (obligation légale)
- [ ] Formulaire de contact : il ouvre aujourd'hui la messagerie du visiteur.
      À brancher sur un vrai service d'envoi pour que les messages arrivent directement.
- [ ] Photos des fondateurs (actuellement : initiales sur pastille indigo)
- [ ] Liens réseaux sociaux (LinkedIn), si souhaité
- [ ] Brancher le domaine navorgroup.net
- [ ] **Mesure d'audience** : coller le jeton Cloudflare Web Analytics en tête de
      `assets/script.js`, puis remplacer la section « Cookies et mesure d'audience »
      de `mentions-legales.html` par le texte ci-dessous.

  > Ce site ne dépose aucun cookie et n'utilise aucun outil de publicité ou de
  > profilage. Une mesure d'audience sans cookie est en place : elle comptabilise
  > les pages consultées et la provenance des visites, sans identifiant individuel.
  > Elle ne permet ni de vous reconnaître d'une visite à l'autre, ni de vous suivre
  > sur d'autres sites. Les polices de caractères sont hébergées sur le serveur du
  > site : aucune autre connexion à un service tiers n'a lieu.

## Validation

Merci de faire vos retours sur les textes, les intitulés de poste et les coordonnées.
Les adresses des pages, les titres et les descriptions ont été optimisés pour le
référencement : merci de ne pas renommer les fichiers sans prévenir.
