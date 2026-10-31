const slides = Array.from(document.querySelectorAll(".banner-slider .slide"));

if (slides.length > 0) {
    let currentSlide = slides.findIndex(slide => slide.classList.contains("active"));
    if (currentSlide === -1) {
        currentSlide = 0;
    }

    function showSlide(index) {
        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === index;
            slide.classList.toggle("active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });
    }

    showSlide(currentSlide);

    if (slides.length > 1) {
        window.setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 4000);
    }
}