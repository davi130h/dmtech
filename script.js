// Versão final e unificada do script.js
document.addEventListener('DOMContentLoaded', function() {
    // --- SEÇÃO DE ELEMENTOS DO DOM ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const quoteForm = document.getElementById("quoteForm");
    const successMessage = document.getElementById("successMessage");

    // --- SEÇÃO DE MENU E NAVEGAÇÃO (CORRIGIDA) ---

    // Função para abrir/fechar o menu mobile
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Impede a rolagem do corpo da página quando o menu está aberto
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    // 1. Evento de clique no ícone de hamburguer
    hamburger.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique se propague para outros elementos
        toggleMenu();
    });

    // 2. Evento de clique nos links do menu para rolagem suave
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Verifica se o link é uma âncora para a mesma página
            if (this.hash !== "") {
                event.preventDefault(); // Impede o comportamento padrão do link

                const targetId = this.hash;
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    // Calcula a posição correta, descontando a altura do header
                    const headerOffset = header.offsetHeight;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    // Rola suavemente para a seção
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }

            // 3. Fecha o menu se estiver aberto (apenas em modo mobile)
            if (navMenu.classList.contains('active')) {
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
        event.preventDefault();

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

        if (!validateForm(data)) {
            return;
        }

        sendToWhatsApp(data);
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
