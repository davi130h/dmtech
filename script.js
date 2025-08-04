/**
 * DM TECH - SCRIPT REFINADO (V2)
 *
 * Este script controla todas as interatividades do site, incluindo:
 * - Menu de navegação (hamburguer e rolagem suave)
 * - Destaque dinâmico do link ativo no menu
 * - Animações de entrada ao rolar a página
 * - Botão "Voltar ao Topo"
 * - Validação e envio do formulário de orçamento para o WhatsApp
 */

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const quoteForm = document.getElementById('quoteForm');
    const successMessage = document.getElementById('successMessage');
    const backToTopButton = document.querySelector('.back-to-top');

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
            // A rolagem suave é controlada pelo CSS (scroll-behavior: smooth)
            // O JavaScript apenas fecha o menu se estiver aberto
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- 3. LÓGICA DE SCROLL (EFEITOS, MENU ATIVO, BOTÃO TOPO) ---
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.scrollY;

        // Efeito de esconder/mostrar header
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
            if (currentScroll > lastScroll && !navMenu.classList.contains('active')) {
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
            const sectionTop = section.offsetTop - header.offsetHeight - 100;
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

        // Lógica do botão "Voltar ao Topo"
        if (backToTopButton) {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);

    // --- 4. FORMULÁRIO DE ORÇAMENTO ---
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
        if (!data.name) { alert("Por favor, preencha o campo 'Nome'."); return false; }
        if (!data.device) { alert("Por favor, selecione o 'Tipo de Equipamento'."); return false; }
        if (data.services.length === 0) { alert("Por favor, selecione pelo menos um serviço desejado."); return false; }
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
            `*Novo Orçamento - DM TECH*`, `\n*Cliente:* ${data.name}`, `*Equipamento:* ${deviceText}`,
            data.brand && `*Marca/Modelo:* ${data.brand}`, `\n*Serviços Desejados:*`,
            ...data.services.map(s => `- ${serviceNames[s] || s}`),
            data.problem && `\n*Descrição do Problema:*\n${data.problem}`, `\n*Urgência:* ${urgencyText}`
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
        }
    };

    if (quoteForm) {
        quoteForm.addEventListener("submit", handleQuoteForm);
    }
});
