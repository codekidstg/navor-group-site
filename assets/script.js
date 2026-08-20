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
      window.location.href = 'mailto:contact@navorgroup.tg?subject=' + subject + '&body=' + body;
    });
  }
})();
