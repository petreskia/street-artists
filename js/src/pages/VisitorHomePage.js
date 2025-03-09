import { initHeader } from "..//layout/renderHeader.js";
import { setArtist } from "../utils/global.js";

export function initVisitorHomePage() {
  initHeader("visitor");
  const carouselSlider = document.querySelector(".carousel-slider");
  const carouselItems = document.querySelectorAll(".carousel-item");
  const findItems = document.querySelector("#findItemsBtn");
  let currentIndex = 0;
  setArtist(null);

  function updateCarousel() {
    carouselSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function nextItem() {
    currentIndex = (currentIndex + 1) % carouselItems.length; // Loop back to start
    updateCarousel();
  }

  function prevItem() {
    currentIndex =
      (currentIndex - 1 + carouselItems.length) % carouselItems.length; // Loop to end
    updateCarousel();
  }

  // Attach event listeners to arrow elements
  document.querySelector(".left-arrow").addEventListener("click", prevItem);
  document.querySelector(".right-arrow").addEventListener("click", nextItem);

  // Initialize the carousel position
  updateCarousel();

  findItems.addEventListener("click", () => {
    location.hash = "#visitorListingPage";
  });
}
