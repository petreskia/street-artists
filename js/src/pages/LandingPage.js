import { initHeader } from "../layout/renderHeader.js";
import { setArtist } from "../utils/global.js";

const usersSelect = document.querySelector("#users");
const artistCard = document.querySelector("#artistCard");
const visitorCard = document.querySelector("#visitorCard");

export function initLandingPage() {
  initHeader("landing");
  fetchArtists();

  // Make the artist card clickable
  artistCard.addEventListener("click", () => {
    usersSelect.focus();
  });

  // Redirect visitor card to visitor's homepage
  visitorCard.addEventListener("click", () => {
    location.hash = "#visitorHomePage";
  });
}

// Async function to fetch artists
async function fetchArtists() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const artists = await response.json();
    populateArtistDropDown(artists);
  } catch (error) {
    console.error("Failed to fetch artists:", error);
  }
}

// Funciton to populate the artist dropdown
function populateArtistDropDown(artists) {
  // Set default "Choose" option
  usersSelect.innerHTML = `<option value="" disabled selected>Choose</option>`;
  // Populate the select with artist names
  usersSelect.innerHTML += artists
    .map((artist) => `<option value="${artist.name}">${artist.name}</option>`)
    .join("");
  // Event listener for artist selection
  usersSelect.addEventListener("change", function () {
    const selectedArtist = usersSelect.value;
    setArtist(selectedArtist);
    window.location.hash = "#artistHomePage";
  });
}
