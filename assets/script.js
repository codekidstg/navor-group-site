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

  // ---- formulaire de contact ----
  //
  //  POUR ACTIVER L'ENVOI RÉEL : coller la clé d'accès ci-dessous.
  //  Elle s'obtient gratuitement sur https://web3forms.com en saisissant
  //  l'adresse contact@navorgroup.net — la clé arrive par email.
  //  Tant que la clé est vide, le formulaire ouvre la messagerie du visiteur
  //  comme avant : le site reste utilisable, rien n'est cassé.
  //
  var CLE_FORMULAIRE = 'd96d661d-fb3d-49dd-8df6-42e33d9c7b60';
  var DESTINATAIRE   = 'contact@navorgroup.net';

  var form = document.getElementById('contactForm');
  var confirmMsg = document.getElementById('confirmMsg');
  var envoiBtn = document.getElementById('envoiBtn');
  if(!form) return;

  function valeur(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function afficher(texte, etat){
    if(!confirmMsg) return;
    confirmMsg.innerHTML = texte;
    confirmMsg.classList.remove('is-succes', 'is-erreur');
    confirmMsg.classList.add('show', etat);
  }

  // Repli sans clé : on ouvre la messagerie du visiteur, comme auparavant.
  function replMessagerie(){
    var sujet = encodeURIComponent('Contact site — ' + valeur('f-name'));
    var corps = encodeURIComponent(
      'Nom: ' + valeur('f-name') + '\n' +
      'Email: ' + valeur('f-email') + '\n' +
      'Structure: ' + (valeur('f-org') || '—') + '\n\n' +
      'Message:\n' + valeur('f-message')
    );
    afficher('Votre messagerie va s\'ouvrir avec le message prêt à être envoyé. ' +
             'Si rien ne se passe, écrivez-nous à <a href="mailto:' + DESTINATAIRE + '">' +
             DESTINATAIRE + '</a>.', 'is-succes');
    window.location.href = 'mailto:' + DESTINATAIRE + '?subject=' + sujet + '&body=' + corps;
  }

  var cle = document.getElementById('f-cle');
  if(cle) cle.value = CLE_FORMULAIRE;

  // Le sujet reprend le nom, pour repérer les messages d'un coup d'œil.
  form.addEventListener('input', function(){
    var sujet = document.getElementById('f-sujet');
    if(sujet && valeur('f-name')) sujet.value = 'Site NAVOR GROUP — ' + valeur('f-name');
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(!form.checkValidity()){ form.reportValidity(); return; }

    if(!CLE_FORMULAIRE){ replMessagerie(); return; }

    var libelle = envoiBtn ? envoiBtn.textContent : '';
    if(envoiBtn){ envoiBtn.disabled = true; envoiBtn.textContent = 'Envoi en cours…'; }
    afficher('Envoi en cours…', 'is-succes');

    var donnees = {};
    new FormData(form).forEach(function(v, k){ donnees[k] = v; });
    donnees.replyto = valeur('f-email');

    fetch(form.action, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(donnees)
    })
    .then(function(r){ return r.json(); })
    .then(function(res){
      if(res.success){
        form.reset();
        var rappel = document.getElementById('besoinRappel');
        if(rappel) rappel.classList.remove('show');
        afficher('<strong>Message envoyé.</strong> Nous vous répondons personnellement, ' +
                 'généralement sous deux jours ouvrés.', 'is-succes');
      } else {
        throw new Error(res.message || 'envoi refusé');
      }
    })
    .catch(function(){
      afficher('<strong>L\'envoi a échoué.</strong> Vérifiez votre connexion, ou écrivez-nous ' +
               'directement à <a href="mailto:' + DESTINATAIRE + '">' + DESTINATAIRE + '</a> — ' +
               'votre message n\'est pas perdu, il est encore dans le formulaire.', 'is-erreur');
    })
    .then(function(){
      if(envoiBtn){ envoiBtn.disabled = false; envoiBtn.textContent = libelle; }
    });
  });

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

  // le besoin choisi doit aussi partir dans le message, pas seulement s'afficher
  var champ = document.getElementById('f-besoin');
  if(champ) champ.value = TEXTES[choix][0];

  var message = document.getElementById('f-message');
  if(message && !message.value){
    message.value = TEXTES[choix][1] + '\n\n';
    message.setAttribute('placeholder', 'Décrivez votre contexte en quelques lignes — même imparfaitement.');
  }
})();
