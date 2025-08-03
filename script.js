// Mobile Menu Functionality - Versão Corrigida
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu - Corrigido
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on links (mobile)
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
            
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside - Corrigido
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
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

// Observe elements
function setupAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Service card hover effects
function setupServiceCards() {
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
}

// Tracking functions
function setupTracking() {
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
}

// Banner image loader
function loadBannerImage() {
    const bannerImage = document.querySelector('.banner-image');
    if (bannerImage) {
        bannerImage.style.opacity = '1';
    }
}

// Quote form handling - Versão Melhorada
function setupQuoteForm() {
    const quoteForm = document.getElementById("quoteForm");
    if (!quoteForm) return;

    const successMessage = document.getElementById("successMessage");
    
    quoteForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(quoteForm);
        const data = Object.fromEntries(formData.entries());
        data.services = formData.getAll("services");

        // Validação
        const requiredFields = ["name", "device"];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            alert(`Por favor, preencha: ${missingFields
                .map(f => f === "name" ? "Nome" : "Tipo de Equipamento")
                .join(", ")}`);
            return;
        }
        
        if (!data.services || data.services.length === 0) {
            alert("Selecione pelo menos um serviço.");
            return;
        }

        // Format message
        const messageParts = [
            `*Novo Orçamento - TechRepair*`,
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
        quoteForm.reset();
        
        // Feedback visual
        quoteForm.style.display = "none";
        successMessage.style.display = "block";
        setTimeout(() => {
            successMessage.style.display = "none";
            quoteForm.style.display = "block";
        }, 5000);
    });
}

// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    setupAnimations();
    setupServiceCards();
    setupTracking();
    loadBannerImage();
    setupQuoteForm();
});
