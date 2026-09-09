#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Propage l'en-tête et le pied de page dans toutes les pages du site.

L'en-tête et le pied vivent dans gabarit/. On les modifie là, une seule fois,
puis on lance :

    python3 outils/gabarit.py

Le reste de chaque page n'est pas touché : l'outil ne remplace que les deux
blocs <header class="site"> et <footer class="site">.
"""
import re, os, sys, glob

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RACINE)

ENTETE = open("gabarit/entete.html", encoding="utf-8").read().strip()
PIED   = open("gabarit/pied.html",   encoding="utf-8").read().strip()

# Quelle entrée de menu est active, selon la page.
ACTIF = {
    "index.html": "index.html",
    "qui-sommes-nous.html": "qui-sommes-nous.html",
    "offres.html": "offres.html",
    "methode.html": "methode.html",
    "valeurs.html": "valeurs.html",
    "contact.html": "contact.html",
    "articles.html": "articles.html",
}
# Les pages de service et d'articles sont des sous-pages : c'est leur rubrique
# parente qui doit apparaître active.
PARENT = {
    "developpement-logiciel.html": "offres.html",
    "audit-it.html": "offres.html",
    "staffing-formation.html": "offres.html",
    "cybersecurite-reseau.html": "offres.html",
    "gestion-de-projet.html": "offres.html",
    "appels-offres.html": "offres.html",
}

def prefixe(chemin):
    """Les pages rangées dans un sous-dossier remontent d'un cran."""
    return "../" * chemin.count(os.sep)

def adapter(bloc, page, marquer_actif=False):
    p = prefixe(page)
    if p:
        bloc = re.sub(r'(href|src)="(?!https?:|mailto:|tel:|#)', r'\1="' + p, bloc)
    # L'état actif ne vaut que pour le menu principal : le pied de page
    # reprend les mêmes adresses et ne doit rien mettre en évidence.
    if marquer_actif:
        nom = os.path.basename(page)
        cible = ACTIF.get(nom) or PARENT.get(nom)
        # tout article est une sous-page de la rubrique Articles
        if not cible and page.startswith("articles" + os.sep):
            cible = "articles.html"
        if cible:
            bloc = bloc.replace('<a href="%s%s">' % (p, cible),
                                '<a href="%s%s" class="active" aria-current="page">' % (p, cible), 1)
    return bloc

def appliquer(page):
    h = open(page, encoding="utf-8").read()
    avant = h
    if '<header class="site">' in h:
        h = re.sub(r'<header class="site">.*?</header>', lambda m: adapter(ENTETE, page, marquer_actif=True), h, flags=re.S)
    if '<footer class="site">' in h:
        h = re.sub(r'<footer class="site">.*?</footer>', lambda m: adapter(PIED, page), h, flags=re.S)
    if h != avant:
        open(page, "w", encoding="utf-8").write(h)
        return True
    return False

if __name__ == "__main__":
    pages = sorted(glob.glob("*.html") + glob.glob("articles/*.html"))
    modifiees = [p for p in pages if appliquer(p)]
    print("%d pages parcourues, %d modifiées" % (len(pages), len(modifiees)))
    for p in modifiees:
        print("  ·", p)
