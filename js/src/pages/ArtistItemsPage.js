import { initHeader } from "../layout/renderHeader.js";
import { getArtist, setAuctionStatus } from "../utils/global.js";
import { formatDate, startTimer, auctionTime } from "../utils/dates.js";
import { getItems } from "../../data/db.js";

export function initArtistItemsPage() {
  initHeader("artist");
  const currentArtist = getArtist();

  if (!currentArtist) {
    console.error("No artist is currently logged in.");
    return;
  }

  // Initialize or retrieve items from localStorage
  let items = getItems();
  localStorage.setItem("items", JSON.stringify(items));

  const artistItems = items.filter((item) => item.artist === currentArtist);
  const itemsContainer = document.querySelector("#artistItemsContainer");

  renderArtistItems(artistItems);

  function renderArtistItems(items) {
    itemsContainer.innerHTML = ""; // Clear container before rendering

    if (items.length === 0) {
      itemsContainer.innerHTML = "<p>No items found.</p>";
      return;
    }

    items.forEach((item) => {
      const itemCard = document.createElement("div");
      itemCard.classList.add("card");

      itemCard.innerHTML = `
        <img src="${item.image}" class="card-img" alt="${item.title}">
        <div class="card-body flex-column-display">
          <div class="card-body-top flex-space-between-display">
            <div class="left-side">
              <h3 class="card-title">${item.title}</h3>
              <p class="card-description item-date-created">${formatDate(
                item.dateCreated
              )}</p>
            </div>
            <p class="card-price">$${item.price}</p>
          </div>
          <div class="card-body-content">
            <p class="card-description">${item.description}</p>
          </div>
          <div class="card-body-bottom flex-space-between-display">
            <button class="btn-send-to-auction btn-blue" data-id="${item.id}">
              ${item.isAuctioning ? "End Auction" : "Send to Auction"}
            </button>
            <button class="btn-publish-toggle btn-green" data-id="${item.id}">
              ${item.isPublished ? "Unpublish" : "Publish"}
            </button>
            <button class="btn-remove btn-red" data-id="${
              item.id
            }">Remove</button>
            <button class="btn-edit btn-light" data-id="${
              item.id
            }">Edit</button>
          </div>
        </div>
      `;

      itemCard.addEventListener("click", (event) => {
        const target = event.target.closest("button");
        if (!target) return;
        const itemId = parseInt(target.dataset.id);
        if (target.classList.contains("btn-send-to-auction")) {
          handleAuction(itemId);
        } else if (target.classList.contains("btn-publish-toggle")) {
          togglePublish(itemId);
        } else if (target.classList.contains("btn-remove")) {
          confirmRemove(itemId);
        } else if (target.classList.contains("btn-edit")) {
          openEditPage(itemId);
        }
      });
      itemsContainer.appendChild(itemCard);
    });
  }

  function handleAuction(itemId) {
    const item = items.find((item) => item.id === itemId);
    if (item) {
      if (!item.isAuctioning) {
        items.forEach((item) => {
          item.isAuctioning = false;
        });

        localStorage.setItem("auctionTimer", auctionTime);
        setAuctionStatus(true); // Set auction status to ongoing
        startTimer(auctionTime);
      }
      item.isAuctioning = !item.isAuctioning;
    }
    const newItems = items.map((i) => {
      if (i.id === itemId) {
        return item;
      }
      return i;
    });

    localStorage.setItem("items", JSON.stringify(newItems));
    renderArtistItems(newItems.filter((item) => item.artist === currentArtist));
  }

  function togglePublish(itemId) {
    const item = items.find((item) => item.id === itemId);
    item.isPublished = !item.isPublished;
    saveItemsToLocalStorage();
    renderArtistItems(items.filter((item) => item.artist === currentArtist));
  }

  function openNewPage() {
    localStorage.setItem("editMode", "false");
    localStorage.removeItem("itemId");
    location.hash = "#artistAddNewItemPage";
    document.querySelector("#description").value = "";
    document.querySelector("#price").value = "";
    document.querySelector("#imageURL").value = "";
    document.querySelector("#title").value = "";
  }

  function openEditPage(itemId) {
    // Set edit mode and load item ID into localStorage
    localStorage.setItem("editMode", "true");
    localStorage.setItem("itemId", itemId);

    // Wait for the next page (artistAddNewItemPage) to load
    location.hash = "#artistAddNewItemPage";
  }

  function confirmRemove(itemId) {
    // Single confirmation step
    const confirmed = confirm("Are you sure you want to remove this item?");
    if (confirmed) {
      items = items.filter((item) => item.id !== itemId);
      saveItemsToLocalStorage();
      renderArtistItems(items.filter((item) => item.artist === currentArtist));
    }
  }

  document.getElementById("addNewItemPanel").addEventListener("click", () => {
    openNewPage();
  });

  function saveItemsToLocalStorage() {
    localStorage.setItem("items", JSON.stringify(items));
  }
}
