const slider = document.querySelector('.slider');
const sliderList = slider.querySelector('.slider-list');
const slides = slider.querySelectorAll('.slide');
const prevBtn = slider.querySelector('.slider-prev');
const nextBtn = slider.querySelector('.slider-next');
const playPauseBtn = slider.querySelector('.slider-play-stop');
const dots = slider.querySelectorAll('.dot');

let currentIndex = 0;
let isPlaying = true;
let autoPlayInterval = null;
const intervalTime = 3000;
const slideWidth = slides[0].offsetWidth;
const totalSlides = slides.length;
let isDragging = false;
let startX = 0;

slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (img) img.setAttribute('draggable', 'false');
});

function updateSlider() {
    const offset = -currentIndex * slideWidth;
    sliderList.style.transition = 'transform 0.5s ease';
    sliderList.style.transform = `translateX(${offset}px)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;
}

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentIndex = index;
    updateSlider();
}

function nextSlide() {
    goToSlide((currentIndex + 1) % totalSlides);
}

function prevSlide() {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
}

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, intervalTime);
    playPauseBtn.classList.add('active');
    isPlaying = true;
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    playPauseBtn.classList.remove('active');
    isPlaying = false;
}

function togglePlayPause() {
    isPlaying ? stopAutoPlay() : startAutoPlay();
}

function resetAutoPlay() {
    if (isPlaying) {
        stopAutoPlay();
        startAutoPlay();
    }
}

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
});

playPauseBtn.addEventListener('click', togglePlayPause);

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
});

sliderList.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    sliderList.style.transition = 'none';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    sliderList.style.transform = `translateX(${ -currentIndex * slideWidth + diff }px)`;
}

function onMouseUp(e) {
    const diff = e.clientX - startX;
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    sliderList.style.transition = 'transform 0.5s ease';

    if (diff > 50 && currentIndex > 0) {
        prevSlide();
    } else if (diff < -50 && currentIndex < totalSlides - 1) {
        nextSlide();
    } else {
        updateSlider();
    }
    resetAutoPlay();
}

sliderList.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    sliderList.style.transition = 'none';
});

sliderList.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    sliderList.style.transform = `translateX(${ -currentIndex * slideWidth + diff }px)`;
});

sliderList.addEventListener(`touchend`, (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    isDragging = false;
    sliderList.style.transition = 'transform 0.5s ease';

    if (diff > 50 && currentIndex > 0) {
        prevSlide();
    } else if (diff < -50 && currentIndex < totalSlides - 1) {
        nextSlide();
    } else {
        updateSlider();
    }
    resetAutoPlay();
})
