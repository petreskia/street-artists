import { getItems, itemTypes } from "../../data/db.js";
import { initHeader } from "../layout/renderHeader.js";
import { getArtist } from "../utils/global.js";
let isEventListenerAdded = false;

export function initArtistAddNewItemPage() {
  initHeader("artist");

  const currentArtist = getArtist();
  const editMode = localStorage.getItem("editMode") === "true";
  const itemId = parseInt(localStorage.getItem("itemId"));

  const addItemForm = document.getElementById("addItemPanel");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const typeInput = document.getElementById("type");
  const priceInput = document.getElementById("price");
  const isPublishedCheckbox = document.getElementById("checkIsPublished");
  const imageUrl = document.getElementById("imageURL");
  const capturedImageBg = document.getElementById("capturedImageBg");
  const capturedImage = localStorage.getItem("capturedImage");
  const placeholderImage = "https://via.placeholder.com/150";
  if (capturedImage) {
    capturedImageBg.style.backgroundImage = `url(${capturedImage})`;
  }

  populateItemTypes();

  if (editMode && itemId) {
    const items = getItems();
    const itemToEdit = items.find((item) => item.id === itemId);
    if (itemToEdit) {
      prefillForm(itemToEdit);
    }
  } else {
    document.querySelector(".update-on-edit").textContent = "Add new Item";
    document.getElementById("addNewItemBtn").textContent = "Add New Item";
  }

  if (!isEventListenerAdded) {
    isEventListenerAdded = true;
    addItemForm.addEventListener(
      "submit",
      function (event) {
        console.debug("Submitting add item form");
        event.preventDefault();
        const isCancel = event.submitter && event.submitter.id === "cancelBtn";
        if (isCancel) {
          localStorage.removeItem("editMode");
          localStorage.removeItem("itemId");
          localStorage.removeItem("capturedImage");
          console.debug("cancelling", localStorage.getItem("editMode"));
          capturedImageBg.style.backgroundImage = "";
          addItemForm.reset();
          isEventListenerAdded = false;
          location.hash = "#artistItemsPage";
          return;
        }
        const storedItems = getItems();

        const localCapturedImage = localStorage.getItem("capturedImage");
        const newItem = {
          id: editMode ? itemId : generateNewId(),
          title: titleInput.value.trim(),
          description: descriptionInput.value.trim() || "",
          type: typeInput.value.trim(),
          image:
            localCapturedImage || imageUrl.value.trim() || placeholderImage,
          price: parseFloat(priceInput.value),
          artist: currentArtist,
          isPublished: isPublishedCheckbox.checked,
          dateCreated: editMode
            ? storedItems.find((item) => item.id === itemId).dateCreated
            : new Date().toISOString(),
          isAuctioning: false,
        };

        if (!newItem.title || !newItem.type || isNaN(newItem.price)) {
          alert("Please fill all required fields.");
          return;
        }

        if (editMode) {
          const index = storedItems.findIndex((item) => item.id === itemId);
          storedItems[index] = {
            ...newItem,
            dateSold: storedItems[index].dateSold,
            priceSold: storedItems[index].priceSold,
            image:
              storedItems[index].image !== placeholderImage &&
              newItem.image === placeholderImage
                ? storedItems[index].image
                : newItem.image,
          };
        } else {
          storedItems.push(newItem);
        }

        // Save to localStorage
        localStorage.setItem("items", JSON.stringify(storedItems));

        // Reset localStorage after successful edit or add
        localStorage.removeItem("editMode");
        localStorage.removeItem("itemId");
        localStorage.removeItem("capturedImage");
        capturedImageBg.style.backgroundImage = "";

        // Redirect back to artist items page
        isEventListenerAdded = false;
        location.hash = "#artistItemsPage";
      },
      { once: true }
    );
  }

  function populateItemTypes() {
    typeInput.innerHTML = itemTypes
      .map((type) => `<option value="${type}">${type}</option>`)
      .join("");
  }

  function prefillForm(item) {
    titleInput.value = item.title;
    descriptionInput.value = item.description;
    typeInput.value = item.type;
    priceInput.value = item.price;
    isPublishedCheckbox.checked = item.isPublished;
    document.querySelector(".update-on-edit").textContent = "Edit Item";
    document.getElementById("addNewItemBtn").textContent = "Update Item";
  }

  function generateNewId() {
    let storedItems = getItems();
    return storedItems.length > 0
      ? Math.max(...storedItems.map((item) => item.id)) + 1
      : 1;
  }
  document.getElementById("captureImageBtn").addEventListener(
    "click",
    () => {
      location.hash = "#captureImagePage";
    },
    { once: true }
  );
}
