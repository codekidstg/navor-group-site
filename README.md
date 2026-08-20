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
- [ ] Brancher le domaine navorgroup.tg

## Validation

Merci de faire vos retours sur les textes, les intitulés de poste et les coordonnées.
Les adresses des pages, les titres et les descriptions ont été optimisés pour le
référencement : merci de ne pas renommer les fichiers sans prévenir.
