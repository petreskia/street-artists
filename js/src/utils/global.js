let isAuctionOngoing = false;
let currentBid = 0;

export function getArtist() {
  return JSON.parse(localStorage.getItem("currentArtist"));
}

export function setArtist(artist) {
  localStorage.setItem("currentArtist", JSON.stringify(artist));
}

export function isAuctionOngoingStatus() {
  return JSON.parse(localStorage.getItem("isAuctionOngoing")) || false;
}

export function setAuctionStatus(status) {
  localStorage.setItem("isAuctionOngoing", JSON.stringify(status));
}

export function getCurrentBid() {
  return JSON.parse(localStorage.getItem("currentBid")) || 0;
}

export function updateCurrentBid(bid) {
  localStorage.setItem("currentBid", JSON.stringify(bid));
}

export function saveToLocalStorage(items) {
  localStorage.setItem("itemList", JSON.stringify(items));
  console.log("Items saved to local storage:", items); // Log the saved items
}

export function loadFromLocalStorage() {
  const savedItems = localStorage.getItem("itemList");
  return savedItems ? JSON.parse(savedItems) : [];
}

export function initializeLocalStorage() {
  if (!localStorage.getItem("itemList")) {
    console.log("Initializing Local Storage with empty itemList"); // Log initialization
    saveToLocalStorage([]); // Initialize with an empty array
  } else {
    console.log("itemList already exists in Local Storage"); // Log that it already exists
  }
}
