// Mobile Menu Functionality - Versão Otimizada
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navContainer = document.querySelector('.nav-container');

    // Função para alternar o menu
    const toggleMenu = () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    // Evento do hamburguer
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Fechar menu ao clicar nos links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
            
            toggleMenu();
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Inicializações
    function init() {
        // Animações
        const animatedElements = document.querySelectorAll('.service-card, .feature-item, .contact-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Efeitos hover nos cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = card.classList.contains('featured') 
                    ? 'translateY(-10px) scale(1.07)'
                    : 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = card.classList.contains('featured') 
                    ? 'scale(1.05)'
                    : 'translateY(0) scale(1)';
            });
        });

        // Tracking
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            link.addEventListener('click', () => {
                console.log('WhatsApp link clicked');
            });
        });

        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Phone number clicked');
            });
        });

        // Banner image
        const bannerImage = document.querySelector('.banner-image');
        if (bannerImage) {
            bannerImage.style.opacity = '1';
        }

        // Formulário de orçamento
        const quoteForm = document.getElementById("quoteForm");
        if (quoteForm) {
            quoteForm.addEventListener("submit", handleQuoteForm);
        }
    }

    // Manipulador do formulário
    function handleQuoteForm(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        data.services = formData.getAll("services");

        // Validação
        if (!validateForm(data)) return;

        // Enviar para WhatsApp
        sendToWhatsApp(data);
        
        // Feedback visual
        showSuccessMessage();
        this.reset();
    }

    function validateForm(data) {
        const requiredFields = ["name", "device"];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            alert(`Por favor, preencha: ${missingFields
                .map(f => f === "name" ? "Nome" : "Tipo de Equipamento")
                .join(", ")}`);
            return false;
        }
        
        if (!data.services || data.services.length === 0) {
            alert("Selecione pelo menos um serviço.");
            return false;
        }
        
        return true;
    }

    function sendToWhatsApp(data) {
        const messageParts = [
            `*Novo Orçamento - DMTECH*`, // Corrigido para DMTECH (consistente com seu HTML)
            `\n*Dados do Cliente:*`,
            `Nome: ${data.name}`,
            data.city && `Cidade: ${data.city}`,
            `\n*Detalhes do Equipamento:*`,
            `Tipo: ${data.device}`,
            data.brand && `Marca/Modelo: ${data.brand}`,
            `\n*Serviços Desejados:*`,
            ...data.services.map(s => `- ${s.charAt(0).toUpperCase() + s.slice(1)}`),
            data.problem && `\n*Problema/Necessidade:*\n${data.problem}`,
            `\n*Urgência:* ${data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)}`
        ];

        const whatsappURL = `https://wa.me/5575998587081?text=${
            encodeURIComponent(messageParts.filter(Boolean).join('\n'))
        }`;

        window.open(whatsappURL, "_blank");
    }

    function showSuccessMessage() {
        const quoteForm = document.getElementById("quoteForm");
        const successMessage = document.getElementById("successMessage");
        
        if (quoteForm && successMessage) {
            quoteForm.style.display = "none";
            successMessage.style.display = "block";
            
            setTimeout(() => {
                successMessage.style.display = "none";
                quoteForm.style.display = "block";
            }, 5000);
        }
    }

    // Inicializa a aplicação
    init();
});
