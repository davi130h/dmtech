// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Disable scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on links (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's an anchor link
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
            
            // Close menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
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

// Observe service cards and feature items
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add hover effects to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        if (card.classList.contains('featured')) {
            card.style.transform = 'scale(1.05)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// WhatsApp button click tracking
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        // You can add analytics tracking here if needed
        console.log('WhatsApp link clicked');
    });
});

// Phone number click tracking
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        // You can add analytics tracking here if needed
        console.log('Phone number clicked');
    });
});

// Add loading animation for banner image
window.addEventListener('load', () => {
    const bannerImage = document.querySelector('.banner-image');
    if (bannerImage) {
        bannerImage.style.opacity = '1';
    }
});

// Quote form handling
document.addEventListener("DOMContentLoaded", () => {
    const quoteForm = document.getElementById("quoteForm");
    const successMessage = document.getElementById("successMessage");
    
    if (quoteForm) {
        quoteForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(quoteForm);
            const data = {};
            
            // Convert form data to object
            for (let [key, value] of formData.entries()) {
                if (key === "services") {
                    if (!data.services) data.services = [];
                    data.services.push(value);
                } else {
                    data[key] = value;
                }
            }
            
            // Validate required fields
            const requiredFields = ["name", "device"];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                alert("Por favor, preencha todos os campos obrigatórios: " + missingFields.join(", ").replace("name", "Nome").replace("device", "Tipo de Equipamento") + ".");
                return;
            }
            
            if (!data.services || data.services.length === 0) {
                alert("Por favor, selecione pelo menos um serviço.");
                return;
            }
            
            // Construct WhatsApp message
            let message = `*Novo Orçamento - TechRepair*\n\n`;
            message += `*Dados do Cliente:*\n`;
            message += `Nome: ${data.name}\n`;
            if (data.city) message += `Cidade: ${data.city}\n`;
            message += `\n*Detalhes do Equipamento:*\n`;
            message += `Tipo: ${data.device}\n`;
            if (data.brand) message += `Marca/Modelo: ${data.brand}\n`;
            message += `\n*Serviços Desejados:*\n`;
            data.services.forEach(service => {
                message += `- ${service.charAt(0).toUpperCase() + service.slice(1)}\n`;
            });
            if (data.problem) message += `\n*Problema/Necessidade:*\n${data.problem}\n`;
            message += `\n*Urgência:* ${data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)}\n`;
            
            // Replace with your WhatsApp number
            const whatsappNumber = "5575998587081"; // Seu número de WhatsApp aqui
            const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
            
            // Redirect to WhatsApp
            window.open(whatsappURL, "_blank");
            
            // Show success message (optional, as user is redirected)
            quoteForm.style.display = "none";
            successMessage.style.display = "block";
            quoteForm.reset();
            
            setTimeout(() => {
                successMessage.style.display = "none";
                quoteForm.style.display = "block";
            }, 5000); // Hide after 5 seconds
        });
    }
});
