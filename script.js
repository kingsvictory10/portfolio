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
  initProjectModals();
  initTypewriter();
  initFaviconSwitcher();
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

// Chave de acesso pública do Web3Forms (https://web3forms.com).
const WEB3FORMS_ACCESS_KEY = '6cc613b8-a0b6-4f27-9530-bea689ffb785';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Envia o formulário de contato via fetch para o Web3Forms.
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

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
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
 * Controla a abertura e o fechamento dos modais de "Saiba mais"
 * dos cards de projeto.
 */
function initProjectModals() {
  const triggers = document.querySelectorAll('.modal-trigger');
  const modals = document.querySelectorAll('[data-modal]');
  if (!triggers.length || !modals.length) return;

  let activeModal = null;

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    activeModal = modal;
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    activeModal = null;
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      openModal(modal);
    });
  });

  modals.forEach((modal) => {
    // Fecha ao clicar fora do conteúdo do modal (na sobreposição escura).
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });

    // Fecha ao clicar no botão "X".
    modal.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => closeModal(modal));
    });
  });

  // Fecha o modal ativo ao pressionar a tecla "Esc".
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeModal) {
      closeModal(activeModal);
    }
  });
}

/**
 * Efeito de digitação (typewriter) em sequência no hero: primeiro digita
 * o nome, e ao terminar, digita o subtítulo — ambos a 120ms por caractere.
 * O cursor "|" acompanha a digitação (movendo-se do nome para o
 * subtítulo) e, 2 segundos após o subtítulo terminar, desaparece com
 * um fade suave.
 */
function initTypewriter() {
  const nameEl = document.getElementById('typewriter-name');
  const subtitleEl = document.getElementById('typewriter-text');
  const cursorEl = document.getElementById('typewriter-cursor');
  if (!nameEl || !subtitleEl || !cursorEl) return;

  const nameText = nameEl.getAttribute('data-full-text') || nameEl.textContent;
  const subtitleText =
    subtitleEl.getAttribute('data-full-text') || subtitleEl.textContent;

  // Respeita a preferência do usuário por menos animações.
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    nameEl.textContent = nameText;
    subtitleEl.textContent = subtitleText;
    return;
  }

  const CHAR_DELAY = 120;

  nameEl.textContent = '';
  subtitleEl.textContent = '';
  cursorEl.classList.add('is-blinking');

  const typeText = (el, text, onDone) => {
    let charIndex = 0;

    const typeNextChar = () => {
      if (charIndex < text.length) {
        el.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, CHAR_DELAY);
      } else {
        onDone();
      }
    };

    typeNextChar();
  };

  const startSubtitle = () => {
    // Move o cursor do final do nome para o final do subtítulo.
    subtitleEl.insertAdjacentElement('afterend', cursorEl);

    typeText(subtitleEl, subtitleText, () => {
      // Subtítulo concluído: cursor pisca por mais 2s e depois some.
      setTimeout(() => {
        cursorEl.classList.remove('is-blinking');
        cursorEl.classList.add('is-hidden');
      }, 2000);
    });
  };

  // Pequeno atraso inicial antes de começar a digitar o nome.
  setTimeout(() => {
    typeText(nameEl, nameText, startSubtitle);
  }, 300);
}

/**
 * Troca o favicon dinamicamente de acordo com a visibilidade da aba.
 * Aba ativa: favicon.svg (padrão). Aba em segundo plano: favicon-inactive.svg
 * (versão apagada com um ponto laranja indicando atividade em pausa).
 */
function initFaviconSwitcher() {
  const favicon = document.getElementById('favicon');
  if (!favicon) return;

  const ACTIVE_ICON = 'favicon.svg';
  const INACTIVE_ICON = 'favicon-inactive.svg';

  document.addEventListener('visibilitychange', () => {
    favicon.href =
      document.visibilityState === 'visible' ? ACTIVE_ICON : INACTIVE_ICON;
  });
}

/**
 * Atualiza o ano exibido no rodapé automaticamente.
 */
function initCurrentYear() {
  const yearEl = document.getElementById('year');
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}
