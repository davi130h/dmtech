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
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quoteForm');
    const successMessage = document.getElementById('successMessage');

    // Manipulador de envio do formulário
    quoteForm.addEventListener('submit', function(event) {
        // 1. Impede o envio padrão do formulário
        event.preventDefault();

        // 2. Coleta dos dados do formulário
        const name = document.getElementById('name').value.trim();
        const city = document.getElementById('city').value.trim();
        const device = document.getElementById('device').value;
        const brand = document.getElementById('brand').value.trim();
        const problem = document.getElementById('problem').value.trim();
        const urgency = document.getElementById('urgency').value;

        // Coleta dos serviços selecionados (checkboxes)
        const selectedServices = [];
        const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
        serviceCheckboxes.forEach(checkbox => {
            // Pega o texto do label associado ao checkbox
            const label = checkbox.closest('.checkbox-item').querySelector('.checkbox-text');
            selectedServices.push(label.textContent.trim());
        });

        // 3. Validação simples (verifica se o nome foi preenchido)
        if (!name) {
            alert('Por favor, preencha seu nome completo.');
            document.getElementById('name').focus();
            return;
        }

        // 4. Formatação da mensagem para o WhatsApp
        let message = `Olá! Gostaria de solicitar um orçamento.\n\n`;
        message += `*Nome:* ${name}\n`;
        if (city) message += `*Cidade:* ${city}\n`;
        
        // Adiciona detalhes do equipamento se selecionado
        if (device) {
            const deviceText = document.querySelector(`#device option[value="${device}"]`).textContent;
            message += `*Equipamento:* ${deviceText}\n`;
        }
        if (brand) message += `*Marca/Modelo:* ${brand}\n`;

        // Adiciona os serviços desejados se algum for selecionado
        if (selectedServices.length > 0) {
            message += `\n*Serviços Desejados:*\n- ${selectedServices.join('\n- ')}\n`;
        }

        // Adiciona a descrição do problema se preenchida
        if (problem) {
            message += `\n*Descrição do Problema:*\n${problem}\n`;
        }
        
        // Adiciona a urgência
        const urgencyText = document.querySelector(`#urgency option[value="${urgency}"]`).textContent;
        message += `\n*Urgência:* ${urgencyText}`;

        // 5. Geração do link do WhatsApp
        const whatsappNumber = '5575998587081'; // Seu número com código do país
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // 6. Redirecionamento e feedback ao usuário
        // Mostra a mensagem de sucesso no site
        quoteForm.style.display = 'none';
        successMessage.style.display = 'block';

        // Abre o WhatsApp em uma nova aba
        window.open(whatsappUrl, '_blank' );
    });

    // Código para o menu hamburguer (se já não tiver)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
});
