// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Active link highlighting
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Add animation keyframes to the document
const style = document.createElement('style');
style.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// About section read more functionality
document.addEventListener('DOMContentLoaded', function() {
    const aboutDescription = document.querySelector('.about-description');
    if (aboutDescription) {
        aboutDescription.addEventListener('click', function(e) {
            if (e.target === this || e.target === this.querySelector('::after')) {
                this.classList.toggle('expanded');
            }
        });
    }

    // Gallery Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterButtons = document.querySelectorAll('.filter-button');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadMoreBtn = document.getElementById('loadMore');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-nav.prev');
    const lightboxNext = document.querySelector('.lightbox-nav.next');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');

    let currentFilter = 'all';
    let currentImageIndex = 0;
    let visibleItems = 4;
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            currentFilter = filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items
            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                item.classList.add('hidden');
                
                if (filter === 'all' || filter === category) {
                    if (index < visibleItems) {
                        item.classList.remove('hidden');
                    }
                }
            });
            
            updateLoadMoreButton();
        });
    });

    // Load More functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const hiddenItems = Array.from(galleryItems).filter(item => {
                const category = item.getAttribute('data-category');
                return item.classList.contains('hidden') && 
                       (currentFilter === 'all' || currentFilter === category);
            });

            hiddenItems.slice(0, 4).forEach(item => {
                item.classList.remove('hidden');
            });

            updateLoadMoreButton();
        });
    }

    // Lightbox functionality
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            const img = item.querySelector('img');
            const title = item.querySelector('.item-content h3');
            const description = item.querySelector('.item-content p');
            
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            
            if (title) lightboxTitle.textContent = title.textContent;
            if (description) lightboxDescription.textContent = description.textContent;
            
            lightbox.classList.add('active');
        });
    });

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    // Navigate lightbox
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxImage();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
            updateLightboxImage();
        });
    }

    // Update lightbox image
    function updateLightboxImage() {
        const item = galleryItems[currentImageIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('.item-content h3');
        const description = item.querySelector('.item-content p');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        if (title) lightboxTitle.textContent = title.textContent;
        if (description) lightboxDescription.textContent = description.textContent;
    }

    // Helper function to update load more button visibility
    function updateLoadMoreButton() {
        if (!loadMoreBtn) return;

        const hiddenItems = Array.from(galleryItems).filter(item => {
            const category = item.getAttribute('data-category');
            return item.classList.contains('hidden') && 
                   (currentFilter === 'all' || currentFilter === category);
        });

        loadMoreBtn.style.display = hiddenItems.length > 0 ? 'inline-block' : 'none';
    }

    // Initialize the gallery
    filterButtons[0]?.click();

    // Close lightbox when clicking outside
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('active')) return;

        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        } else if (e.key === 'ArrowLeft' && lightboxPrev) {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight' && lightboxNext) {
            lightboxNext.click();
        }
    });
});

// Contact Button Click Handler
document.querySelector('.tech-btn').addEventListener('click', function() {
    // Phone number to call
    const phoneNumber = '+919867235445';
    
    // Check if it's a mobile device
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Mobile device - open dialer
        window.location.href = `tel:${phoneNumber}`;
    } else {
        // Desktop - show alert with number
        const message = `Please call: ${phoneNumber}`;
        alert(message);
    }
});
