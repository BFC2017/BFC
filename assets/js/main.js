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

  // Galeria interativa (grid + modal)
  (function(){
    const grid = document.querySelector('.galeria-grid');
    const modal = document.getElementById('galeria-modal');
    if(!grid || !modal) return;
    const imgs = Array.from(grid.querySelectorAll('figure.galeria-card img'));
    const imgEl = document.getElementById('galeria-modal-img');
    const btnClose = modal.querySelector('.galeria-close');
    const btnPrev = modal.querySelector('.galeria-nav.prev');
    const btnNext = modal.querySelector('.galeria-nav.next');
    let index = 0;
    function show(i){
      index = i;
      const src = imgs[index].getAttribute('src');
      const alt = imgs[index].getAttribute('alt') || '';
      imgEl.src = src;
      imgEl.alt = alt;
  // caption removido conforme solicitação (descrições ocultas)
  modal.hidden = false;
  modal.classList.add('open');
      updateNav();
      btnClose.focus();
    }
  function close(){ modal.hidden = true; modal.classList.remove('open'); }
    function prev(){ if(index>0) show(index-1); }
    function next(){ if(index<imgs.length-1) show(index+1); }
    function updateNav(){
      btnPrev.disabled = index===0;
      btnNext.disabled = index===imgs.length-1;
    }
    imgs.forEach((img,i)=>{
      const fig = img.closest('figure');
      fig.tabIndex = 0;
      fig.addEventListener('click', ()=>show(i));
      fig.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); show(i);} });
    });
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);
    document.addEventListener('keydown', e=>{
      if(modal.hidden) return;
      if(e.key==='Escape') close();
      if(e.key==='ArrowLeft') prev();
      if(e.key==='ArrowRight') next();
    });
    modal.addEventListener('click', e=>{ if(e.target===modal) close(); });
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
