#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Publie les articles du site.

Chaque article est un fichier de contenu/articles/, au format :

    titre: Le titre de l'article
    description: La phrase que Google affichera sous le titre.
    chapeau: L'accroche affichée en haut de la page.
    date: 2026-09-09
    ---
    <p>Le corps de l'article, en HTML simple.</p>
    <h2>Un intertitre</h2>

Puis on lance :

    python3 outils/publier.py

L'outil produit articles/<nom-du-fichier>.html, reconstruit la liste
articles.html, et met le sitemap à jour. L'en-tête et le pied de page
proviennent de gabarit/, via outils/gabarit.py.
"""
import os, re, sys, glob, json, datetime

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RACINE)
sys.path.insert(0, os.path.join(RACINE, "outils"))
import gabarit

BASE = "https://navorgroup.net"
MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août",
        "septembre","octobre","novembre","décembre"]

def lire(chemin):
    brut = open(chemin, encoding="utf-8").read()
    tete, corps = brut.split("\n---\n", 1)
    meta = {}
    for ligne in tete.strip().split("\n"):
        if ":" in ligne:
            cle, val = ligne.split(":", 1)
            meta[cle.strip()] = val.strip()
    meta["slug"] = os.path.splitext(os.path.basename(chemin))[0]
    meta["corps"] = corps.strip()
    d = datetime.date.fromisoformat(meta["date"])
    meta["date_lisible"] = "%d %s %d" % (d.day, MOIS[d.month - 1], d.year)
    meta["mots"] = len(re.sub(r"<[^>]+>", " ", meta["corps"]).split())
    meta["minutes"] = max(1, round(meta["mots"] / 200))
    return meta

def echapper(t):
    return t.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")

def tete_html(titre, description, url, ld=""):
    return '''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%s</title>
<meta name="description" content="%s">
<link rel="canonical" href="%s">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:site_name" content="NAVOR GROUP">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="%s">
<meta property="og:description" content="%s">
<meta property="og:url" content="%s">
<meta property="og:image" content="%s/assets/NAVOR_GROUP_Partage.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1B2340">
<link rel="icon" type="image/svg+xml" href="../assets/NAVOR_GROUP_Logo_Mark.svg">
<link rel="apple-touch-icon" href="../assets/NAVOR_GROUP_Logo_Mark.png">
<link rel="preload" href="../assets/fonts/ibm-plex-sans-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="../assets/fonts/ibm-plex-sans-700-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../assets/fonts.css">
<link rel="stylesheet" href="../assets/style.css">%s
</head>
<body>

<a href="#main" class="skip-link">Aller au contenu</a>

<header class="site"></header>

<main id="main">
''' % (echapper(titre), echapper(description), url, echapper(titre),
       echapper(description), url, BASE, ld)

def page_article(a, autres):
    url = "%s/articles/%s.html" % (BASE, a["slug"])
    ld = {"@context":"https://schema.org","@type":"Article",
          "headline": a["titre"], "description": a["description"],
          "datePublished": a["date"], "inLanguage":"fr",
          "mainEntityOfPage": url,
          "author":{"@type":"Organization","name":"NAVOR GROUP","@id":BASE+"/#organisation"},
          "publisher":{"@type":"Organization","name":"NAVOR GROUP","@id":BASE+"/#organisation",
                       "logo":{"@type":"ImageObject","url":BASE+"/assets/NAVOR_GROUP_Logo_Mark.png"}}}
    fil = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Accueil","item":BASE+"/"},
        {"@type":"ListItem","position":2,"name":"Articles","item":BASE+"/articles.html"},
        {"@type":"ListItem","position":3,"name":a["titre"],"item":url}]}
    bloc_ld = "".join('\n<script type="application/ld+json">\n%s\n</script>'
                      % json.dumps(g, ensure_ascii=False, indent=2) for g in (ld, fil))

    suite = ""
    if autres:
        cartes = "".join('''        <a href="%s.html" class="offer-card">
          <span class="num">%s</span>
          <h3>%s</h3>
          <p>%s</p>
          <span class="go">Lire <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        </a>\n''' % (o["slug"], o["date_lisible"], echapper(o["titre"]), echapper(o["chapeau"][:110].rsplit(" ",1)[0] + "…"))
            for o in autres[:3])
        suite = '''
  <section class="tight" style="padding-top:0;">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">À lire aussi</span>
        <h2>D'autres articles.</h2>
      </div>
      <div class="grid-3">
%s      </div>
    </div>
  </section>
''' % cartes

    return tete_html(a["titre"] + " — NAVOR GROUP", a["description"], url, bloc_ld) + '''<section class="view active">
  <section>
    <div class="wrap">
      <nav class="breadcrumb" aria-label="Fil d'Ariane">
        <a href="../index.html">Accueil</a><span aria-hidden="true">/</span><a href="../articles.html">Articles</a><span aria-hidden="true">/</span><span class="current">%s</span>
      </nav>
      <div class="section-head">
        <span class="eyebrow">%s · %d min de lecture</span>
        <h1>%s</h1>
        <p class="lead">%s</p>
      </div>
      <article class="article-corps">
%s
      </article>
    </div>
  </section>
%s
  <section class="band-dark cta-band">
    <div class="wrap">
      <span class="eyebrow">Parlons de votre projet</span>
      <h2>Une question sur votre propre situation ?</h2>
      <p>Décrivez-nous votre contexte. Nous reviendrons avec des questions précises, pas un discours commercial.</p>
      <a href="../contact.html" class="btn btn-primary">Discuter d'un projet</a>
    </div>
  </section>

</section>

</main>

<footer class="site"></footer>

<script src="../assets/script.js" defer></script>
</body>
</html>
''' % (echapper(a["titre"]), a["date_lisible"], a["minutes"], echapper(a["titre"]),
       echapper(a["chapeau"]), a["corps"], suite)

def page_liste(articles):
    url = BASE + "/articles.html"
    lignes = "".join('''        <a href="articles/%s.html" class="article-item">
          <span class="article-date">%s · %d min</span>
          <h2>%s</h2>
          <p>%s</p>
          <span class="go">Lire l'article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        </a>\n''' % (a["slug"], a["date_lisible"], a["minutes"], echapper(a["titre"]), echapper(a["chapeau"]))
        for a in articles)
    tete = tete_html("Articles — NAVOR GROUP",
        "Ce que nous avons appris sur les projets numériques en Afrique de l'Ouest : appels d'offres, choix technologiques, pilotage. Sans jargon ni discours commercial.",
        url).replace('href="../assets', 'href="assets').replace('href="../', 'href="')
    return tete + '''<section class="view active">
  <section>
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Articles</span>
        <h1>Ce que nous avons appris, écrit noir sur blanc.</h1>
        <p>Nous publions ce que nous savons faire, et ce que nous voyons rater. Sans jargon, sans discours commercial — de quoi décider en connaissance de cause, même si vous ne travaillez jamais avec nous.</p>
      </div>
      <div class="article-liste">
%s      </div>
    </div>
  </section>

  <section class="band-dark cta-band">
    <div class="wrap">
      <span class="eyebrow">Parlons de votre projet</span>
      <h2>Une question qui n'a pas sa réponse ici ?</h2>
      <p>Posez-la-nous directement. Si la réponse intéresse d'autres personnes, elle deviendra le prochain article.</p>
      <a href="contact.html" class="btn btn-primary">Discuter d'un projet</a>
    </div>
  </section>

</section>

</main>

<footer class="site"></footer>

<script src="assets/script.js" defer></script>
</body>
</html>
''' % lignes

if __name__ == "__main__":
    sources = sorted(glob.glob("contenu/articles/*.txt"))
    articles = sorted([lire(s) for s in sources], key=lambda a: a["date"], reverse=True)
    if not articles:
        print("aucun article dans contenu/articles/"); sys.exit(0)

    for a in articles:
        autres = [o for o in articles if o["slug"] != a["slug"]]
        open("articles/%s.html" % a["slug"], "w", encoding="utf-8").write(page_article(a, autres))
    open("articles.html", "w", encoding="utf-8").write(page_liste(articles))

    # en-tête et pied de page communs
    for p in ["articles.html"] + ["articles/%s.html" % a["slug"] for a in articles]:
        gabarit.appliquer(p)

    # sitemap
    sm = open("sitemap.xml", encoding="utf-8").read()
    sm = re.sub(r'\s*<url><loc>%s/articles[^<]*</loc>.*?</url>' % re.escape(BASE), "", sm)
    ajouts = '  <url><loc>%s/articles.html</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n' % BASE
    for a in articles:
        ajouts += '  <url><loc>%s/articles/%s.html</loc><changefreq>yearly</changefreq><priority>0.6</priority></url>\n' % (BASE, a["slug"])
    sm = sm.replace("</urlset>", ajouts + "</urlset>")
    open("sitemap.xml", "w", encoding="utf-8").write(sm)

    print("%d article(s) publié(s) :" % len(articles))
    for a in articles:
        print("  · %-46s %4d mots, %d min" % (a["slug"] + ".html", a["mots"], a["minutes"]))
