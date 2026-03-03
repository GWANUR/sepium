document.addEventListener("DOMContentLoaded", function () {

    var card = document.querySelector(".item");
    var maxCard = 6;
    const container = document.querySelector(".container");
    container.innerHTML = "";
    for (let i = 0; i < maxCard; i++) {
        container.appendChild(card.cloneNode(true));
    }

    let splides = [];

    function initSplides() {
        document.querySelectorAll('.splide').forEach((el, index) => {

            if (splides[index]) splides[index].destroy();

            let splide = new Splide(el, {
                type: 'loop',
                drag: false,
                snap: true,
                pagination: false,
                breakpoints: {
                    1000: {
                        perPage: 1,
                        autoplay: true,
                        interval: 3000,
                        arrows: false,
                    }
                }
            });

            splide.mount();
            splides[index] = splide;

            const pagination = el.parentElement.querySelector('.my-pagination');
            if (!pagination) return;
            pagination.innerHTML = "";

            const slidesCount = splide.Components.Slides.getLength(true);
            for (let i = 0; i < slidesCount; i++) {
                const dot = document.createElement('button');
                dot.className = "my-dot";
                dot.dataset.index = i;
                dot.addEventListener('click', () => splide.go(i));
                pagination.appendChild(dot);
            }

            function updateDots(index) {
                const realIndex = index % slidesCount;
                pagination.querySelectorAll('.my-dot').forEach(dot => dot.classList.remove('is-active'));
                const activeDot = pagination.querySelectorAll('.my-dot')[realIndex];
                if (activeDot) activeDot.classList.add('is-active');
            }

            splide.on('move', newIndex => updateDots(newIndex));
            updateDots(splide.index); 
        });
    }

    initSplides();

    document.querySelectorAll('.item').forEach(function(item) {
        var materialList = item.querySelector('.material-checkbox');
        if (materialList) {
            materialList.addEventListener('click', function (e) {
                e.stopPropagation();
                const item = e.target.closest('li');
                if (!item) return;

                materialList.querySelectorAll('li').forEach(li => {
                    li.classList.remove('active');
                    const icon = li.querySelector('i');
                    if (icon) icon.remove();
                });

                item.classList.add('active');

                const icon = document.createElement('i');
                icon.className = 'bi bi-check-circle-fill';
                item.prepend(icon);
            });
        }

    });
    document.querySelectorAll('.item').forEach(function(item) {
        const zoomBtn = item.querySelector('.zoom');
        zoomBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();

            const slides = Array.from(item.querySelectorAll('.splide__slide:not(.splide__slide--clone) img'));
            if (!slides.length) return;

            let currentIndex = slides.findIndex(img => img.closest('.splide__slide').classList.contains('is-active'));
            if (currentIndex === -1) currentIndex = 0;

            const overlay = document.createElement('div');
            overlay.className = "fancybox-overlay";

            const container = document.createElement('div');
            container.className = "fancybox-container";
            overlay.appendChild(container);

            const prevArrow = document.createElement('div');
            prevArrow.className = "fancybox-arrow prev";
            prevArrow.innerHTML = "❮";

            const nextArrow = document.createElement('div');
            nextArrow.className = "fancybox-arrow next";
            nextArrow.innerHTML = "❯";

            container.appendChild(prevArrow);
            container.appendChild(nextArrow);

            const zoomImg = document.createElement('img');
            zoomImg.className = "main-img";
            zoomImg.src = slides[currentIndex].src;
            container.appendChild(zoomImg);

            const thumbsContainer = document.createElement('div');
            thumbsContainer.className = "fancybox-thumbs";
            slides.forEach((slide, i) => {
                const thumb = document.createElement('img');
                thumb.src = slide.src;
                if (i === currentIndex) thumb.classList.add('active-thumb');
                thumb.addEventListener('click', () => showImage(i));
                thumbsContainer.appendChild(thumb);
            });
            container.appendChild(thumbsContainer);

            document.body.appendChild(overlay);

            function showImage(index) {
                if (index < 0) index = slides.length - 1;
                if (index >= slides.length) index = 0;
                currentIndex = index;
                zoomImg.src = slides[currentIndex].src;

                thumbsContainer.querySelectorAll('img').forEach((t, i) => {
                    t.classList.toggle('active-thumb', i === currentIndex);
                });
            }

            prevArrow.addEventListener('click', e => { e.stopPropagation(); showImage(currentIndex - 1); });
            nextArrow.addEventListener('click', e => { e.stopPropagation(); showImage(currentIndex + 1); });

            overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

            document.addEventListener('keydown', function keyHandler(e) {
                if (!document.body.contains(overlay)) return document.removeEventListener('keydown', keyHandler);
                if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentIndex + 1);
                if (e.key === 'Escape') overlay.remove();
            });
        });
    });

    window.addEventListener('resize', () => initSplides());

    document.querySelectorAll('.item').forEach(function(item, index) {
        item.addEventListener('click', function(e) {
            if (e.target.closest('.like, .calc, button')) return;

            const url = `page/card/card.html?id=${index + 1}`;
            window.open(url, '_blank'); 
        });
        item.querySelector('.button-middle').addEventListener('click', function(e) {
            e.stopPropagation(); 
            const url = `page/card/card.html?id=${index + 1}`;
            window.open(url, '_blank'); 
        });

        item.querySelector('div.like').addEventListener('click', function(e) {
            e.stopPropagation();
            const likeIcon = this.querySelector('i');
            const likeNumber = this.querySelector('span.like');
            
            let count = parseInt(likeNumber.textContent);

            if (this.classList.contains('active')) {
                // дизлайк
                likeNumber.textContent = count - 1;
                likeIcon.style.color = '#A1A5AD';
                likeIcon.classList.remove('animate-like');
                likeIcon.classList.remove('animate-dislike'); // сброс
                void likeIcon.offsetWidth; // перезапуск анимации
                likeIcon.classList.add('animate-dislike');
            } else {
                // лайк
                likeNumber.textContent = count + 1;
                likeIcon.style.color = '#ff655d';

                // триггерим анимацию
                likeIcon.classList.remove('animate-dislike');
                likeIcon.classList.remove('animate-like'); // сброс
                void likeIcon.offsetWidth; // перезапуск анимации
                likeIcon.classList.add('animate-like');
            }

            this.classList.toggle('active');
        });
    });


});