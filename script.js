/**
 * DM TECH - SCRIPT OTIMIZADO (2025)
 *
 * Este script controla todas as interatividades do site, incluindo:
 * - Menu de navegação (hamburguer e rolagem suave)
 * - Destaque dinâmico do link ativo no menu
 * - Animações de entrada ao rolar a página
 * - Validação e envio do formulário de orçamento para o WhatsApp
 */

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
    // Selecionar todos os elementos uma única vez para melhor performance.
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const quoteForm = document.getElementById('quoteForm');
    const successMessage = document.getElementById('successMessage');

    // --- 2. NAVEGAÇÃO E MENU MOBILE ---
    const toggleMenu = () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMenu();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (this.hash !== "") {
                event.preventDefault();
                const targetSection = document.querySelector(this.hash);
                if (targetSection) {
                    const headerOffset = header.offsetHeight;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- 3. LÓGICA DE SCROLL (EFEITOS E MENU ATIVO) ---
    let lastScroll = 0;

    const handleScroll = () => {
        // Efeito de esconder/mostrar header
        const currentScroll = window.scrollY;
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
            if (currentScroll > lastScroll) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;

        // Destaque do link ativo no menu
        let activeSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 50;
            if (currentScroll >= sectionTop) {
                activeSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll); // Garante o estado correto ao carregar a página

    // --- 4. ANIMAÇÕES DE ENTRADA (INTERSECTION OBSERVER) ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.will-animate').forEach(el => {
        animationObserver.observe(el);
    });

    // --- 5. FORMULÁRIO DE ORÇAMENTO ---
    const handleQuoteForm = (event) => {
        event.preventDefault();
        const formData = new FormData(quoteForm);
        const data = {
            name: formData.get('name')?.trim(),
            device: formData.get('device'),
            brand: formData.get('brand')?.trim(),
            services: formData.getAll('services'),
            problem: formData.get('problem')?.trim(),
            urgency: formData.get('urgency')
        };

        if (!validateForm(data)) return;

        sendToWhatsApp(data);
        showSuccessMessage();
        quoteForm.reset();
    };

    const validateForm = (data) => {
        if (!data.name) {
            alert("Por favor, preencha o campo 'Nome'.");
            return false;
        }
        if (!data.device) {
            alert("Por favor, selecione o 'Tipo de Equipamento'.");
            return false;
        }
        if (data.services.length === 0) {
            alert("Por favor, selecione pelo menos um serviço desejado.");
            return false;
        }
        return true;
    };

    const sendToWhatsApp = (data) => {
        const serviceNames = {
            formatacao: "Formatação", teclado: "Troca de Teclado", memoria: "Upgrade de Memória RAM",
            ssd: "Substituição HD por SSD", limpeza: "Limpeza Interna", outros: "Outros Serviços"
        };
        const deviceText = document.querySelector(`#device option[value="${data.device}"]`).textContent;
        const urgencyText = document.querySelector(`#urgency option[value="${data.urgency}"]`).textContent;

        const messageParts = [
            `*Novo Orçamento - DM TECH*`,
            `\n*Cliente:* ${data.name}`,
            `*Equipamento:* ${deviceText}`,
            data.brand && `*Marca/Modelo:* ${data.brand}`,
            `\n*Serviços Desejados:*`,
            ...data.services.map(s => `- ${serviceNames[s] || s}`),
            data.problem && `\n*Descrição do Problema:*\n${data.problem}`,
            `\n*Urgência:* ${urgencyText}`
        ];

        const whatsappNumber = '5575998587081';
        const encodedMessage = encodeURIComponent(messageParts.filter(Boolean).join('\n'));
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, "_blank");
    };

    const showSuccessMessage = () => {
        if (quoteForm && successMessage) {
            quoteForm.style.display = 'none';
            successMessage.style.display = 'block';
            // Opcional: reverter após alguns segundos para permitir novo envio
            // setTimeout(() => {
            //     quoteForm.style.display = 'block';
            //     successMessage.style.display = 'none';
            // }, 5000);
        }
    };

    if (quoteForm) {
        quoteForm.addEventListener("submit", handleQuoteForm);
    }
});
