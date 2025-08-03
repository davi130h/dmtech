// Versão final e unificada do script.js (v2 - com menu dinâmico)
document.addEventListener('DOMContentLoaded', function() {
    // --- SEÇÃO DE ELEMENTOS DO DOM ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const quoteForm = document.getElementById("quoteForm");
    const successMessage = document.getElementById("successMessage");
    // Seleciona todas as seções que têm um ID
    const sections = document.querySelectorAll('section[id]');

    // --- SEÇÃO DE MENU E NAVEGAÇÃO ---
    const toggleMenu = () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (this.hash !== "") {
                event.preventDefault();
                const targetId = this.hash;
                const targetSection = document.querySelector(targetId);
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

    // --- NOVA FUNÇÃO: ATIVAR LINK DO MENU AO ROLAR A PÁGINA ---
    const activateMenuOnScroll = () => {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - header.offsetHeight - 50; // Adiciona um pequeno offset
            let sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Remove a classe 'active' de todos os links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Adiciona a classe 'active' ao link correspondente à seção visível
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active');
            }
        });
    };

    // Adiciona os "ouvintes" de evento para rolagem e carregamento da página
    window.addEventListener('scroll', activateMenuOnScroll);
    window.addEventListener('load', activateMenuOnScroll);


    // --- SEÇÃO DE EFEITOS DE SCROLL E ANIMAÇÕES ---
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
    function handleQuoteForm(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = {
            name: formData.get('name')?.trim(),
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

    function validateForm(data) {
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
    }

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

    function showSuccessMessage() {
        if (quoteForm && successMessage) {
            quoteForm.style.display = 'none';
            successMessage.style.display = 'block';
        }
    }

    if (quoteForm) {
        quoteForm.addEventListener("submit", handleQuoteForm);
    }
});
