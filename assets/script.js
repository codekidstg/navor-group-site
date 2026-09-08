/* NAVOR GROUP — comportements partagés : menu mobile, suivi de méthode, formulaire. */
(function(){
  'use strict';

  // ---- menu mobile ----
  var hamburger = document.getElementById('hamburger');
  var primaryNav = document.getElementById('primaryNav');
  if(hamburger && primaryNav){
    hamburger.addEventListener('click', function(){
      var isOpen = primaryNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    primaryNav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        primaryNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded','false');
      });
    });
  }

  // ---- arc de progression de la page Méthode ----
  var arc = document.getElementById('arcProgress');
  var blocks = document.querySelectorAll('.method-block');
  if(arc && blocks.length && 'IntersectionObserver' in window){
    var circumference = 2 * Math.PI * 50;
    var progressByStep = {1: circumference/3, 2: (circumference/3)*2, 3: circumference};
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var val = progressByStep[entry.target.getAttribute('data-step')] || 0;
          arc.setAttribute('stroke-dasharray', val.toFixed(1) + ' ' + circumference.toFixed(1));
        }
      });
    }, {threshold:0.5});
    blocks.forEach(function(b){ io.observe(b); });
  }

  // ---- formulaire de contact -> ouverture de la messagerie ----
  var form = document.getElementById('contactForm');
  var confirmMsg = document.getElementById('confirmMsg');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var val = function(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var name = val('f-name'), email = val('f-email'), org = val('f-org'), message = val('f-message');
      var subject = encodeURIComponent('Contact site — ' + name);
      var body = encodeURIComponent(
        'Nom: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Structure: ' + (org || '—') + '\n\n' +
        'Message:\n' + message
      );
      if(confirmMsg){ confirmMsg.classList.add('show'); }
      window.location.href = 'mailto:contact@navorgroup.net?subject=' + subject + '&body=' + body;
    });
  }
})();

/* ---- sélecteur de besoin (accueil) ----
   Le formulaire fonctionne sans script : il envoie ?besoin=… vers contact.html.
   Le script ne fait qu'ajouter le retour visuel et activer le bouton. */
(function(){
  'use strict';
  var form = document.getElementById('besoinForm');
  if(!form) return;
  var btn  = document.getElementById('besoinBtn');
  var note = document.getElementById('besoinNote');
  var cartes = form.querySelectorAll('.besoin-card');

  form.addEventListener('change', function(e){
    if(e.target.name !== 'besoin') return;
    cartes.forEach(function(c){ c.classList.toggle('is-checked', c.contains(e.target)); });
    btn.disabled = false;
    btn.firstChild.nodeValue = 'Continuer — ' + e.target.getAttribute('data-label') + ' ';
    note.textContent = 'Nous préparerons votre message avec cette information.';
  });
})();

/* ---- page contact : reprise du besoin choisi ---- */
(function(){
  'use strict';
  var rappel = document.getElementById('besoinRappel');
  if(!rappel) return;

  var TEXTES = {
    'developpement-logiciel': ['Développement logiciel',
      'Nous souhaitons faire développer un logiciel ou une application.'],
    'audit-it': ['Audit IT',
      'Nous souhaitons un état des lieux de notre système d\'information.'],
    'staffing-formation': ['Staffing & formation',
      'Nous cherchons des compétences IT pour renforcer notre équipe.'],
    'cybersecurite-reseau': ['Cybersécurité & réseau',
      'Nous souhaitons sécuriser nos systèmes et notre réseau.'],
    'gestion-de-projet': ['Gestion de projet',
      'Nous avons un projet à piloter, ou un projet en difficulté.'],
    'appels-offres': ['Appels d\'offres',
      'Nous préparons une consultation ou un appel d\'offres et souhaitons vous transmettre le dossier.'],
    'autre': ['Autre besoin', 'Nous souhaitons échanger sur notre situation.']
  };

  var params = new URLSearchParams(window.location.search);
  var choix = params.get('besoin');
  if(!choix || !TEXTES[choix]) return;

  document.getElementById('besoinRappelTexte').textContent = TEXTES[choix][0];
  rappel.classList.add('show');

  var message = document.getElementById('f-message');
  if(message && !message.value){
    message.value = TEXTES[choix][1] + '\n\n';
    message.setAttribute('placeholder', 'Décrivez votre contexte en quelques lignes — même imparfaitement.');
  }
})();
