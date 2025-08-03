// Versão final e unificada do script.js
document.addEventListener('DOMContentLoaded', function() {
    // --- SEÇÃO DE ELEMENTOS DO DOM ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const quoteForm = document.getElementById("quoteForm");
    const successMessage = document.getElementById("successMessage");

    // --- SEÇÃO DE MENU E NAVEGAÇÃO ---

    // Função para abrir/fechar o menu mobile
    const toggleMenu = () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    // Evento de clique no ícone de hamburguer
    hamburger.addEventListener('click', toggleMenu);

    // Fecha o menu ao clicar em um link (para navegação na mesma página)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- SEÇÃO DE EFEITOS DE SCROLL E ANIMAÇÕES ---

    // Efeito de sombra e ocultação do header ao rolar a página
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            if (currentScroll > lastScroll) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Animação de elementos ao aparecerem na tela
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .feature-item, .contact-item, .hero-text, .hero-banner').forEach(el => {
        el.classList.add('will-animate');
        observer.observe(el);
    });

    // --- SEÇÃO DO FORMULÁRIO DE ORÇAMENTO ---

    // Função principal que lida com o envio do formulário
    function handleQuoteForm(event) {
        event.preventDefault(); // Impede o envio padrão

        const formData = new FormData(this);
        const data = {
            name: formData.get('name')?.trim(),
            city: formData.get('city')?.trim(),
            device: formData.get('device'),
            brand: formData.get('brand')?.trim(),
            services: formData.getAll('services'),
            problem: formData.get('problem')?.trim(),
            urgency: formData.get('urgency')
        };

        // Valida os dados antes de continuar
        if (!validateForm(data)) {
            return; // Para a execução se a validação falhar
        }

        // Se a validação passar, envia para o WhatsApp
        sendToWhatsApp(data);

        // Mostra a mensagem de sucesso e reseta o formulário
        showSuccessMessage();
        this.reset();
    }

    // Função para validar os campos do formulário
    function validateForm(data) {
        if (!data.name) {
            alert("Por favor, preencha o campo 'Nome Completo'.");
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
    }

    // Função para montar a mensagem e redirecionar para o WhatsApp
    function sendToWhatsApp(data) {
        const serviceNames = {
            formatacao: "Formatação",
            teclado: "Troca de Teclado",
            memoria: "Upgrade de Memória RAM",
            ssd: "Substituição HD por SSD",
            limpeza: "Limpeza Interna",
            outros: "Outros Serviços"
        };

        const deviceText = document.querySelector(`#device option[value="${data.device}"]`).textContent;
        const urgencyText = document.querySelector(`#urgency option[value="${data.urgency}"]`).textContent;

        const messageParts = [
            `Olá! Gostaria de solicitar um orçamento.\n`,
            `*Nome:* ${data.name}`,
            data.city && `*Cidade:* ${data.city}`,
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

        // Abre o WhatsApp em uma nova aba. Esta é a ação de redirecionamento.
        window.open(whatsappURL, "_blank" );
    }

    // Função para mostrar a mensagem de sucesso na tela
    function showSuccessMessage() {
        if (quoteForm && successMessage) {
            quoteForm.style.display = 'none';
            successMessage.style.display = 'block';
        }
    }

    // Adiciona o "ouvinte" de evento ao formulário, se ele existir na página
    if (quoteForm) {
        quoteForm.addEventListener("submit", handleQuoteForm);
    }
});
