let slideIndex = 0;
let slideInterval;

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// Start the slideshow with auto-scrolling
function startSlideshow() {
  slideInterval = setInterval(showSlides, 3000);
}

// Stop the auto-scrolling
function stopSlideshow() {
  clearInterval(slideInterval);
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Set the first slide and dot to be active
document.addEventListener("DOMContentLoaded", function(event) {
  showSlides();
});

// Start the slideshow
startSlideshow();
