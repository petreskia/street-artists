import { getItems, itemTypes } from "../../data/db.js";
import { initHeader } from "../layout/renderHeader.js";

// Initialize Visitor Listing Page
export function initVisitorListingPage() {
  initHeader("visitor");
  const publishedItems = getItems().filter((item) => item.isPublished);
  const itemsContainer = document.querySelector("#itemsContainer");
  const filterButton = document.querySelector("#filterButton");
  const applyFilterBtn = document.querySelector("#applyFilterBtn");
  const closeFilterBtn = document.querySelector("#closeFilterBtn");
  const resetFiltersBtn = document.querySelector("#resetFiltersBtn");

  // Filter input elements
  const itemTitleInput = document.querySelector("#itemTitleInput");
  const artistSelect = document.querySelector("#artist");
  const minPriceInput = document.querySelector("#minPrice");
  const maxPriceInput = document.querySelector("#maxPrice");
  const itemTypeInput = document.querySelector("#itemTypeInput");
  populateFilterOptions();
  renderVisitorItems(publishedItems);

  // Event listeners for filter controls
  filterButton.addEventListener("click", () => toggleFilterPanel(true));
  closeFilterBtn.addEventListener("click", () => toggleFilterPanel(false));
  applyFilterBtn.addEventListener("click", applyFilters);
  resetFiltersBtn.addEventListener("click", resetFilters);

  // Toggle the visibility of the filter panel
  function toggleFilterPanel(show) {
    document.querySelector("#visitorFiltersPage").style.display = show
      ? "flex"
      : "none";
    document.querySelector("#visitorListingPage").style.display = show
      ? "none"
      : "flex";
  }

  function populateFilterOptions() {
    // Clear existing options to avoid duplication
    artistSelect.innerHTML = '<option value="Choose">Choose</option>';
    itemTypeInput.innerHTML = '<option value="type">Choose</option>';
    // Populate unique artist option
    const uniqueArtists = [...new Set(getItems().map((item) => item.artist))];
    uniqueArtists.forEach((artist) => {
      const option = document.createElement("option");
      option.value = artist;
      option.textContent = artist;
      artistSelect.appendChild(option);
    });

    // Populate unique item types
    itemTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      itemTypeInput.appendChild(option);
    });
  }

  // Apply filters based on user input
  function applyFilters() {
    const title = itemTitleInput.value.trim().toLowerCase();
    const artist = artistSelect.value !== "Choose" ? artistSelect.value : "";
    const priceMin = minPriceInput.value
      ? parseFloat(minPriceInput.value)
      : null;
    const priceMax = maxPriceInput.value
      ? parseFloat(maxPriceInput.value)
      : null;
    const type = itemTypeInput.value !== "type" ? itemTypeInput.value : "";

    // Filter items based on all criteria
    const filteredItems = getItems().filter((item) => {
      const matchesTitle = title
        ? item.title.toLowerCase().includes(title)
        : true;
      const matchesArtist = artist ? item.artist === artist : true;
      const matchesMinPrice = priceMin !== null ? item.price >= priceMin : true;
      const matchesMaxPrice = priceMax !== null ? item.price <= priceMax : true;
      const matchesType = type ? item.type === type : true;
      return (
        item.isPublished &&
        matchesTitle &&
        matchesArtist &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesType
      );
    });

    renderVisitorItems(filteredItems);
    toggleFilterPanel(false); // Hide filter panel after applying filters
  }

  // Reset filters and display all items
  function resetFilters() {
    // Clear all filter inputs
    itemTitleInput.value = "";
    artistSelect.value = "Choose";
    minPriceInput.value = "";
    maxPriceInput.value = "";
    itemTypeInput.value = "type";

    // Display all published items
    renderVisitorItems(publishedItems);
  }

  function renderVisitorItems(items) {
    itemsContainer.innerHTML = ""; // Clear existing items
    if (items.length === 0) {
      itemsContainer.innerHTML = "<p>No items found.</p>";
      return;
    }
    items.forEach((item, index) => {
      const itemCard = document.createElement("div");
      itemCard.classList.add("card");
      itemCard.innerHTML = `
      <img src="${item.image}" class="card-img" alt="${item.title}">
      <div class="card-body flex-column-display ${
        index % 2 === 0 ? "even" : "odd"
      }">
      <div class="card-body-top flex-space-between-display">
        <h2 class="card-artist styled-text">${item.artist}</h2>
        <p class="card-price">$${item.price}</p></div>
        <div class="card-body-bottom">
        <p class="card-title subtitle">${item.title}</p>
        <p class="card-description">${item.description}</p></div>
      </div>
    `;
      itemsContainer.appendChild(itemCard);
    });
  }
}
