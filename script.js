document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".cards-cont");
  let cards = Array.from(document.querySelectorAll(".card-wrapper"));
  const dots = document.querySelectorAll(".e-nav-dot");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  const cardCount = cards.length;
  let currentIndex = 0;
  let cloneCard = null;

  function getVisibleCount() {
    return window.innerWidth >= 830 ? 2 : 1;
  }

  function clearClone() {
    if (cloneCard) {
      container.removeChild(cloneCard);
      cloneCard = null;
      cards = Array.from(container.querySelectorAll(".card-wrapper"));
    }
  }

  function updateSlider() {
    const visibleCount = getVisibleCount();
    container.style.transition = "transform 0.5s ease";

    // Reset styles and display all cards by default
    cards.forEach((card) => {
      card.style.display = "block";
      card.style.minWidth = visibleCount === 1 ? "100%" : "50%";
      card.style.maxWidth = visibleCount === 1 ? "100%" : "50%";
      card.style.flexShrink = 0;
    });

    if (visibleCount === 1) {
      // Single card: just translate to show current card
      clearClone();
      container.style.transform = `translateX(${-currentIndex * 100}%)`;
    } else {
      // Two cards view
      if (currentIndex === 2) {
        // Slide 3: show cards 3 & 1
        // If no clone, add clone of first card at end
        if (!cloneCard) {
          cloneCard = cards[0].cloneNode(true);
          container.appendChild(cloneCard);
          cards.push(cloneCard);
        }

        // Translate to show card 3 and cloned card 1 side by side
        container.style.transform = `translateX(${-2 * 50}%)`; // -100%
      } else {
        // Normal slides (0 or 1)
        clearClone();
        container.style.transform = `translateX(${-currentIndex * 50}%)`;
      }
    }

    // Update dots
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[currentIndex].classList.add("active");
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % cardCount;
    updateSlider();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + cardCount) % cardCount;
    updateSlider();
  }

  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);
  window.addEventListener("resize", () => {
    updateSlider();
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      currentIndex = idx;
      updateSlider();
    });
  });

  updateSlider();
});

document.addEventListener("DOMContentLoaded", () => {
  const allLayouts = document.querySelectorAll(".img-layout");

  allLayouts.forEach((layout) => {
    const imgCont = layout.querySelector(".img-wrapper");
    const eachImg = Array.from(layout.querySelectorAll(".slide-img-cont"));
    const imgDots = layout.querySelectorAll(".e-inner-slide-nav-dot");

    const imgTotal = eachImg.length;
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let movedX = 0;

    imgCont.style.width = `${imgTotal * 100}%`;
    eachImg.forEach((card) => {
      card.style.width = `${100 / imgTotal}%`;
      card.style.flexShrink = "0";
    });

    function updateSlider() {
      imgCont.style.transition = "transform 0.5s ease";
      imgCont.style.transform = `translateX(-${
        (100 / imgTotal) * currentIndex
      }%)`;

      imgDots.forEach((dot) => dot.classList.remove("active"));
      if (imgDots[currentIndex]) {
        imgDots[currentIndex].classList.add("active");
      }
    }

    imgDots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        currentIndex = idx;
        updateSlider();
      });
    });

    imgCont.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX;
      imgCont.style.transition = "none";
    });

    imgCont.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      movedX = e.pageX - startX;
      imgCont.style.transform = `translateX(calc(-${
        (100 / imgTotal) * currentIndex
      }% + ${movedX}px))`;
    });

    imgCont.addEventListener("mouseup", () => {
      isDragging = false;
      handleSwipe();
    });

    imgCont.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        handleSwipe();
      }
    });

    imgCont.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      imgCont.style.transition = "none";
    });

    imgCont.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      movedX = e.touches[0].clientX - startX;
      imgCont.style.transform = `translateX(calc(-${
        (100 / imgTotal) * currentIndex
      }% + ${movedX}px))`;
    });

    imgCont.addEventListener("touchend", () => {
      isDragging = false;
      handleSwipe();
    });

    function handleSwipe() {
      const threshold = 50;
      if (movedX > threshold && currentIndex > 0) {
        currentIndex--;
      } else if (movedX < -threshold && currentIndex < imgTotal - 1) {
        currentIndex++;
      }
      movedX = 0;
      updateSlider();
    }

    let autoplayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % imgTotal;
      updateSlider();
    }, 4000);

    layout.addEventListener("mouseenter", () => {
      clearInterval(autoplayInterval);
    });

    layout.addEventListener("mouseleave", () => {
      autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % imgTotal;
        updateSlider();
      }, 4000);
    });

    updateSlider();
  });
});
