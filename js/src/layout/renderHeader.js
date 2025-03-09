import { getArtist } from "../utils/global.js";

export function initHeader(userType) {
  const logo = document.getElementById("logo");
  const headerTitle = document.getElementById("headerTitle");
  const artistName = document.getElementById("artistName");
  const auctionButton = document.getElementById("auctionButton");
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const artistMenu = document.getElementById("artistMenu");

  // Reset visibility
  [
    logo,
    headerTitle,
    artistName,
    auctionButton,
    hamburgerMenu,
    artistMenu,
  ].forEach((el) => el.classList.add("hidden"));

  if (userType === "landing") {
    headerTitle.classList.remove("hidden");
  } else if (userType === "visitor") {
    [logo, headerTitle, auctionButton].forEach((el) =>
      el.classList.remove("hidden")
    );
  } else if (userType === "artist") {
    const selectedArtist = getArtist();
    [logo, artistName, hamburgerMenu].forEach((el) =>
      el.classList.remove("hidden")
    );
    artistName.textContent = selectedArtist;

    // Remove any existing event listener to prevent duplicates
    hamburgerMenu.removeEventListener("click", toggleArtistMenu);
    // Add the click event listener
    hamburgerMenu.addEventListener("click", toggleArtistMenu);
  }
}

// Function to toggle the artist menu visibility
function toggleArtistMenu() {
  const artistMenu = document.getElementById("artistMenu");
  artistMenu.classList.toggle("hidden");
}
