// Mobile Menu Functionality - Versão Otimizada e Corrigida
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navContainer = document.querySelector('.nav-container');
    const header = document.querySelector('.header');

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
            if (this.hash) {
                e.preventDefault();
                const targetId = this.hash.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
            
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Fechar menu ao clicar fora (apenas mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !e.target.closest('.nav-container') && 
            navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Header scroll effect - Suavizado
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            
            // Esconde o header ao rolar para baixo
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Intersection Observer for animations - Otimizado
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    };

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    // Inicializações
    function init() {
        // Adiciona classes CSS para animação
        const animatedElements = document.querySelectorAll(
            '.service-card, .feature-item, .contact-item, .hero-text, .hero-banner'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('will-animate');
            observer.observe(el);
        });

        // Efeitos hover nos cards - Suavizado
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 25px rgba(0, 119, 204, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });

        // Formulário de orçamento
        const quoteForm = document.getElementById("quoteForm");
        if (quoteForm) {
            quoteForm.addEventListener("submit", handleQuoteForm);
        }
    }

    // Manipulador do formulário - Melhorado
    function handleQuoteForm(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        data.services = formData.getAll("services");

        if (!validateForm(data)) return;

        // Feedback visual antes do redirecionamento
        showSuccessMessage();
        
        // Delay para o usuário ver a mensagem de sucesso
        setTimeout(() => {
            sendToWhatsApp(data);
            this.reset();
        }, 1500);
    }

    function validateForm(data) {
        const requiredFields = ["name", "device"];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            const fieldNames = {
                name: "Nome Completo",
                device: "Tipo de Equipamento"
            };
            
            alert(`Por favor, preencha os seguintes campos obrigatórios:\n${missingFields.map(f => fieldNames[f]).join(', ')}`);
            return false;
        }
        
        if (!data.services || data.services.length === 0) {
            alert("Por favor, selecione pelo menos um serviço.");
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

        const urgencyNames = {
            normal: "Normal (até 7 dias)",
            urgente: "Urgente (até 3 dias)",
            "muito-urgente": "Muito Urgente (até 24h)"
        };

        const messageParts = [
            `*Novo Orçamento - DMTECH*`,
            `\n*Dados do Cliente:*`,
            `👤 Nome: ${data.name}`,
            data.city && `🏙️ Cidade: ${data.city}`,
            `\n*Detalhes do Equipamento:*`,
            `💻 Tipo: ${data.device === 'notebook' ? 'Notebook' : 
                      data.device === 'desktop' ? 'Computador Desktop' : 
                      data.device === 'all-in-one' ? 'All-in-One' : 'Outros'}`,
            data.brand && `🔧 Marca/Modelo: ${data.brand}`,
            `\n*Serviços Desejados:*`,
            ...data.services.map(s => `✔️ ${serviceNames[s] || s}`),
            data.problem && `\n*Descrição do Problema:*\n${data.problem}`,
            `\n*⏱️ Urgência:* ${urgencyNames[data.urgency] || data.urgency}`
        ];

        const whatsappURL = `https://wa.me/5575998587081?text=${
            encodeURIComponent(messageParts.filter(Boolean).join('\n')
        }`;

        window.open(whatsappURL, "_blank");
    }

    function showSuccessMessage() {
        const quoteForm = document.getElementById("quoteForm");
        const successMessage = document.getElementById("successMessage");
        
        if (quoteForm && successMessage) {
            quoteForm.style.opacity = '0';
            quoteForm.style.pointerEvents = 'none';
            
            successMessage.style.display = "block";
            setTimeout(() => {
                successMessage.style.opacity = '1';
            }, 50);
        }
    }

    // Inicializa a aplicação
    init();
});
