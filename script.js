// =========================================
// PORTFÓLIO - SCRIPT PRINCIPAL
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initActiveNavLink();
  initScrollReveal();
  initBackToTop();
  initContactForm();
  initCurrentYear();
});

/**
 * Adiciona classe ao header quando a página é rolada,
 * usada para dar um efeito de fundo/sombra.
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const toggleScrolled = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled);
}

/**
 * Controla a abertura/fechamento do menu mobile.
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Fecha o menu ao clicar em um link (útil no mobile)
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/**
 * Destaca o link de navegação correspondente à seção
 * atualmente visível na tela.
 */
function initActiveNavLink() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Anima elementos com a classe "reveal" quando entram
 * na viewport durante a rolagem.
 */
function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.section__title, .section__subtitle, .project-card, .skill-card, .sobre__content > *, .contact__content > *'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

/**
 * Mostra/esconde o botão "voltar ao topo" e trata o clique.
 */
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  const toggleVisibility = () => {
    backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
    backToTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  };

  backToTop.style.transition = 'opacity 0.3s ease';
  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Envia o formulário de contato via fetch para o Formspree.
 * Em caso de sucesso, substitui o formulário por uma mensagem de sucesso.
 * Em caso de erro, exibe uma mensagem de erro amigável acima do botão.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formContainer = document.getElementById('contact-form-container');
  const errorMessage = document.getElementById('form-error');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form || !formContainer) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    errorMessage?.setAttribute('hidden', '');
    setFormLoading(form, submitBtn, true);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        showFormSuccess(formContainer);
      } else {
        errorMessage?.removeAttribute('hidden');
        setFormLoading(form, submitBtn, false);
      }
    } catch (error) {
      errorMessage?.removeAttribute('hidden');
      setFormLoading(form, submitBtn, false);
    }
  });
}

/**
 * Habilita/desabilita os campos do formulário e o botão de envio
 * enquanto a requisição está em andamento.
 */
function setFormLoading(form, submitBtn, isLoading) {
  [...form.elements].forEach((el) => {
    el.disabled = isLoading;
  });

  if (submitBtn) {
    submitBtn.textContent = isLoading ? 'Enviando...' : 'Enviar Mensagem';
  }
}

/**
 * Substitui o conteúdo do formulário por uma mensagem de sucesso.
 */
function showFormSuccess(formContainer) {
  formContainer.innerHTML = `
    <div class="form-success">
      <span class="form-success__icon">&#10003;</span>
      <h3 class="form-success__title">Mensagem enviada!</h3>
      <p class="form-success__text">
        Obrigado pelo contato. Vou responder o quanto antes.
      </p>
    </div>
  `;
}

/**
 * Atualiza o ano exibido no rodapé automaticamente.
 */
function initCurrentYear() {
  const yearEl = document.getElementById('year');
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}
