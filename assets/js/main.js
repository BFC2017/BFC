// Scroll suave para navegação do cabeçalho

document.addEventListener('DOMContentLoaded', function() {
  // Scroll suave com offset para compensar header sticky
  const links = document.querySelectorAll('nav ul li a, nav .cta, .footer-links a');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          // Calcula a posição com offset para o header sticky
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 70; // fallback de 70px
          const offsetExtra = 30; // margem extra para melhor visualização
          
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - offsetExtra;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Calcular anos de história automaticamente (fundação: 03/03/2017)
  calculateYearsOfHistory();

  // Animação dos números do Sobre (após calcular anos)
  setupSobreObserver();
  
  // Configurar animações de scroll
  setupScrollAnimations();
  
  // Animar hero na carga da página e incluir no sistema de reanimação
  setTimeout(() => {
    const hero = document.querySelector('.hero-animate');
    if (hero) {
      hero.classList.add('animate');
    }
  }, 300);

  // Ano dinâmico no footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Botão voltar ao topo
  initToTopButton();
  // Ler mais do Sobre
  initSobreReadMore();

  // Galeria interativa (grid + modal) com acessibilidade aprimorada
  (function(){
    const grid = document.querySelector('.galeria-grid');
    const modal = document.getElementById('galeria-modal');
    if(!grid || !modal) return;
    const body = document.body;
    const imgs = Array.from(grid.querySelectorAll('figure.galeria-card img'));
    const imgEl = document.getElementById('galeria-modal-img');
    const btnClose = modal.querySelector('.galeria-close');
    const btnPrev = modal.querySelector('.galeria-nav.prev');
    const btnNext = modal.querySelector('.galeria-nav.next');
    let statusEl = modal.querySelector('.galeria-status');
    if(!statusEl){
      statusEl = document.createElement('div');
      statusEl.className = 'galeria-status';
      statusEl.setAttribute('aria-live','polite');
      modal.appendChild(statusEl);
    }
    let index = 0;
    let lastFocused = null;
    let previousBodyOverflow = '';

    // Focus trap suporte
    const focusableSelector = 'button:not([disabled])';
    let focusableEls = [];
    let firstEl, lastEl;
    function updateFocusable(){
      focusableEls = Array.from(modal.querySelectorAll(focusableSelector));
      firstEl = focusableEls[0];
      lastEl = focusableEls[focusableEls.length-1];
    }

    function setBackgroundInert(state){
      const parts = [document.querySelector('header'), document.querySelector('main'), document.querySelector('footer')];
      parts.forEach(el=>{
        if(!el || el===modal) return;
        if(state){
          el.setAttribute('aria-hidden','true');
          try { el.inert = true; } catch(_){}
        } else {
          el.removeAttribute('aria-hidden');
          try { el.inert = false; } catch(_){}
        }
      });
    }

    function preloadAround(i){
      [i-1,i+1].forEach(n=>{
        if(n>=0 && n<imgs.length){
          const s = imgs[n].getAttribute('src');
          const im = new Image();
          im.src = s;
        }
      });
    }

    function announce(){
      statusEl.textContent = `Imagem ${index+1} de ${imgs.length}`;
    }

    function updateNav(){
      const atStart = index===0;
      const atEnd = index===imgs.length-1;
      btnPrev.disabled = atStart;
      btnNext.disabled = atEnd;
      btnPrev.setAttribute('aria-label', atStart ? 'Sem imagem anterior' : `Imagem anterior (${index} de ${imgs.length})`);
      const nextPos = index+2 <= imgs.length ? index+2 : imgs.length;
      btnNext.setAttribute('aria-label', atEnd ? 'Sem próxima imagem' : `Próxima imagem (${nextPos} de ${imgs.length})`);
    }

    function show(i){
      index = i;
      const src = imgs[index].getAttribute('src');
      const alt = imgs[index].getAttribute('alt') || '';
      imgEl.src = src;
      imgEl.alt = alt;
      modal.removeAttribute('hidden');
      modal.classList.add('open');
      previousBodyOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
      setBackgroundInert(true);
      updateNav();
      announce();
      preloadAround(index);
      updateFocusable();
      btnClose.focus();
    }

    function close(){
      modal.setAttribute('hidden','');
      modal.classList.remove('open');
      body.style.overflow = previousBodyOverflow;
      setBackgroundInert(false);
      if(lastFocused) { try { lastFocused.focus(); } catch(_){} }
    }

    function prev(){ if(index>0) show(index-1); }
    function next(){ if(index<imgs.length-1) show(index+1); }

    // Eventos de abertura nas figuras
    imgs.forEach((img,i)=>{
      const fig = img.closest('figure');
      fig.tabIndex = 0;
      fig.addEventListener('click', ()=>{ lastFocused = fig; show(i); });
      fig.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); lastFocused = fig; show(i);} });
    });

    // Botões
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);

    // Click fora para fechar
    modal.addEventListener('click', e=>{ if(e.target === modal) close(); });

    // Keyboard global para navegação extra
    document.addEventListener('keydown', e=>{
      if(modal.hasAttribute('hidden')) return;
      switch(e.key){
        case 'Escape': e.preventDefault(); close(); break;
        case 'ArrowLeft': e.preventDefault(); prev(); break;
        case 'ArrowRight': e.preventDefault(); next(); break;
        case 'Home': e.preventDefault(); show(0); break;
        case 'End': e.preventDefault(); show(imgs.length-1); break;
      }
    });

    // Focus trap
    modal.addEventListener('keydown', e=>{
      if(e.key==='Tab'){
        updateFocusable();
        if(!focusableEls.length) return;
        if(e.shiftKey && document.activeElement === firstEl){ e.preventDefault(); lastEl.focus(); }
        else if(!e.shiftKey && document.activeElement === lastEl){ e.preventDefault(); firstEl.focus(); }
      }
    });

    // Suporte a swipe em mobile
    let startX = null;
    modal.addEventListener('touchstart', e=>{ if(modal.hasAttribute('hidden')) return; if(e.touches.length===1) startX = e.touches[0].clientX; });
    modal.addEventListener('touchend', e=>{
      if(startX===null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx) > 60){ if(dx>0) prev(); else next(); }
      startX = null;
    });
  })();

  // Menu mobile (hamburger)
  (function(){
    const toggle = document.querySelector('.nav-toggle');
    const wrapper = document.querySelector('.nav-wrapper');
    if(!toggle || !wrapper) return;
    function closeMenu(){
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Abrir menu');
      wrapper.classList.remove('open');
      wrapper.style.maxHeight = '0px';
      // Retorna foco ao botão após animação
      setTimeout(()=>{ toggle.focus(); }, 50);
    }
    function openMenu(){
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Fechar menu');
      wrapper.classList.add('open');
      // calcula altura total e aplica
      requestAnimationFrame(()=>{
        const full = wrapper.scrollHeight;
        wrapper.style.maxHeight = full + 'px';
      });
      // Move foco para primeiro link navegável
      const firstLink = wrapper.querySelector('.nav-links a');
      if(firstLink){ setTimeout(()=> firstLink.focus(), 120); }
    }
    toggle.addEventListener('click', ()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });
    // Fechar ao clicar em link
    wrapper.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeMenu));
    // Fechar com ESC
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeMenu(); });
  })();
});

// Configurar animações de scroll
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in, .card-animate, .hero-animate');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Elemento entrando na viewport - animação de entrada
        if (entry.target.classList.contains('hero-animate')) {
          // Delay especial para o hero
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, 200);
        } else {
          entry.target.classList.add('animate');
        }
        
        // Para elementos com stagger animation
        const staggerElements = entry.target.querySelectorAll('.stagger-animation');
        staggerElements.forEach(staggerEl => {
          staggerEl.classList.add('animate');
        });
      } else {
        // Elemento saindo da viewport - remover animação para permitir reentrada
        entry.target.classList.remove('animate');
        
        // Para elementos com stagger animation
        const staggerElements = entry.target.querySelectorAll('.stagger-animation');
        staggerElements.forEach(staggerEl => {
          staggerEl.classList.remove('animate');
        });
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Animação de contagem crescente nos números da seção Sobre
function animateSobreNumbers() {
  const cards = document.querySelectorAll('.stat-card .stat-number');
  cards.forEach(card => {
    const target = card.getAttribute('data-target') || card.textContent.replace(/\D/g, '');
    const isPlus = card.textContent.trim().startsWith('+');
    const final = parseInt(target.replace('+',''));
    let start = 0;
    let duration = 1200;
    let startTime = null;
    function animateNumber(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = Math.floor(progress * final);
      card.textContent = (isPlus ? '+' : '') + value;
      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        card.textContent = (isPlus ? '+' : '') + final;
      }
    }
    card.textContent = isPlus ? '+0' : '0';
    requestAnimationFrame(animateNumber);
  });
}

// Detecta quando a seção Sobre entra na tela e reinicia animação sempre
function setupSobreObserver() {
  const sobre = document.getElementById('sobre');
  if (!sobre) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateSobreNumbers();
    }
  }, { threshold: 0.3 });
  observer.observe(sobre);
}

// Botão voltar ao topo
function initToTopButton() {
  const btn = document.getElementById('to-top');
  if (!btn) return;
  const showAfter = 300; // px
  window.addEventListener('scroll', () => {
    if (window.scrollY > showAfter) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Função para calcular automaticamente os anos de história da BFC
function calculateYearsOfHistory() {
  const foundationDate = new Date('2017-03-03'); // Data de fundação: 03/03/2017
  const currentDate = new Date();
  
  // Calcula a diferença em anos
  let years = currentDate.getFullYear() - foundationDate.getFullYear();
  
  // Ajusta se ainda não passou a data de aniversário no ano atual
  const hasPassedAnniversary = (currentDate.getMonth() > foundationDate.getMonth()) || 
                               (currentDate.getMonth() === foundationDate.getMonth() && currentDate.getDate() >= foundationDate.getDate());
  
  if (!hasPassedAnniversary) {
    years--;
  }
  
  // Atualiza o elemento na página
  const anosHistoriaElement = document.getElementById('anos-historia');
  if (anosHistoriaElement) {
    anosHistoriaElement.textContent = years;
    anosHistoriaElement.setAttribute('data-target', years);
  }
  
  console.log(`BFC fundada em 03/03/2017. Anos de história: ${years}`);
}

// Ler mais da seção Sobre (mobile somente)
function initSobreReadMore(){
  const container = document.querySelector('#sobre .sobre-texto');
  const extra = document.getElementById('sobre-extra');
  const btn = document.getElementById('sobre-read-toggle');
  if(!container || !extra || !btn) return;
  // Referências úteis
  const firstParagraph = container.querySelector('p.sobre-intro') || container.querySelector('p');

  const mq = window.matchMedia('(max-width: 820px)');

  function applyState(){
    if(mq.matches){
      container.classList.remove('expanded');
      btn.textContent = 'Ler mais';
      btn.setAttribute('aria-expanded','false');
      btn.style.display = '';
      extra.setAttribute('aria-hidden','true');
      // Garante que o botão fique ao final do parágrafo intro (colado ao texto)
      if(firstParagraph && btn.parentNode !== firstParagraph){ firstParagraph.appendChild(btn); }
    } else {
      container.classList.add('expanded');
      btn.textContent = 'Ler menos';
      btn.setAttribute('aria-expanded','true');
      btn.style.display = 'none';
      extra.removeAttribute('aria-hidden');
    }
  }

  btn.addEventListener('click', ()=>{
    const expanded = container.classList.toggle('expanded');
    btn.textContent = expanded ? 'Ler menos' : 'Ler mais';
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if(expanded){
      extra.removeAttribute('aria-hidden');
      // Move o botão para o final do último parágrafo do bloco extra ao expandir
      const lastP = extra.querySelector('p:last-of-type');
      if(lastP){ lastP.appendChild(btn); }
      else { extra.appendChild(btn); }
    } else {
      extra.setAttribute('aria-hidden','true');
      // Retorna o botão para dentro do primeiro parágrafo, no fim do texto
      if(firstParagraph && btn.parentNode !== firstParagraph){ firstParagraph.appendChild(btn); }
    }
  });

  applyState();
  if(mq.addEventListener){ mq.addEventListener('change', applyState); }
  else if(mq.addListener){ mq.addListener(applyState); }
}
