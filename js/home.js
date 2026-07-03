// ===========================================
// KIVUSTREAM HERO SLIDER
// ===========================================

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const hero = document.querySelector(".hero");

let current = 0;
let autoSlide;

// Don't run slider if there is only one slide
if (slides.length > 1) {

    function showSlide(index) {

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        current = index;
    }

    function nextSlide() {

        let next = current + 1;

        if (next >= slides.length) {
            next = 0;
        }

        showSlide(next);

    }

    function prevSlide() {

        let prev = current - 1;

        if (prev < 0) {
            prev = slides.length - 1;
        }

        showSlide(prev);

    }

    function startSlider() {

        autoSlide = setInterval(nextSlide, 6000);

    }

    function stopSlider() {

        clearInterval(autoSlide);

    }

    nextBtn.addEventListener("click", () => {

        stopSlider();
        nextSlide();
        startSlider();

    });

    prevBtn.addEventListener("click", () => {

        stopSlider();
        prevSlide();
        startSlider();

    });

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            stopSlider();
            showSlide(index);
            startSlider();

        });

    });

    hero.addEventListener("mouseenter", stopSlider);
    hero.addEventListener("mouseleave", startSlider);

    showSlide(0);
    startSlider();

}
document.addEventListener("DOMContentLoaded", async () => {

    try {

        await loadTrending();

        await loadLatestMovies();

        await loadSeries();

        await loadTopRated();

    } catch (error) {

        console.error("Homepage error:", error);

    }

});
