const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        // Filter gallery items
        galleryItems.forEach(item => {
            if (filterValue === 'all') {
                item.classList.remove('hidden');
                item.style.animation = 'fadeIn 0.4s ease';
            } else {
                if (item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeIn 0.4s ease';
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    });
});


const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentImageSpan = document.getElementById('currentImage');
const totalImagesSpan = document.getElementById('totalImages');

let currentImageIndex = 0;
let visibleImages = [];

// Get visible images (not hidden by filter)
function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
}

// Open lightbox when clicking on gallery item
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        updateVisibleImages();
        // Find the index of clicked item in visible images
        currentImageIndex = visibleImages.indexOf(item);
        openLightbox();
    });
});

// Open lightbox function
function openLightbox() {
    const img = visibleImages[currentImageIndex].querySelector('.gallery-img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    updateImageCounter();
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Update image counter
function updateImageCounter() {
    currentImageSpan.textContent = currentImageIndex + 1;
    totalImagesSpan.textContent = visibleImages.length;
}

closeBtn.addEventListener('click', closeLightbox);

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    const img = visibleImages[currentImageIndex].querySelector('.gallery-img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    updateImageCounter();
});
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    const img = visibleImages[currentImageIndex].querySelector('.gallery-img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    updateImageCounter();
});
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
        case 'Escape':
            // Back - Close lightbox on Escape key
            closeLightbox();
            break;
        case 'ArrowLeft':
            // Previous image on left arrow
            currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
            const prevImg = visibleImages[currentImageIndex].querySelector('.gallery-img');
            lightboxImg.src = prevImg.src;
            lightboxImg.alt = prevImg.alt;
            updateImageCounter();
            break;
        case 'ArrowRight':
            // Next image on right arrow
            currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
            const nextImg = visibleImages[currentImageIndex].querySelector('.gallery-img');
            lightboxImg.src = nextImg.src;
            lightboxImg.alt = nextImg.alt;
            updateImageCounter();
            break;
    }
});
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

window.addEventListener('load', () => {
    totalImagesSpan.textContent = galleryItems.length;
});

let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swiped left - show next image
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        const img = visibleImages[currentImageIndex].querySelector('.gallery-img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        updateImageCounter();
    }
    if (touchEndX > touchStartX + 50) {
        // Swiped right - show previous image
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        const img = visibleImages[currentImageIndex].querySelector('.gallery-img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        updateImageCounter();
    }
}

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);
