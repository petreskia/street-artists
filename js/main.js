import { initLandingPage } from "./src/pages/LandingPage.js";
import { initArtistHomePage } from "./src/pages/ArtistHomePage.js";
import { initArtistItemsPage } from "./src/pages/ArtistItemsPage.js";
import { initVisitorHomePage } from "./src/pages/VisitorHomePage.js";
import { initVisitorListingPage } from "./src/pages/VisitorListingPage.js";
import { initArtistAddNewItemPage } from "./src/pages/ArtistAddNewItemPage.js";
import { initCaptureImage } from "./src/pages/CaptureImagePage.js";
import { initAuctionPage } from "./src/pages/Auction.js";
import { getItems } from "./data/db.js";

function handleRouting() {
  // Extract the hash part (ignore query parameters)
  const hash = location.hash.split("?")[0] || "#landingPage";

  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page) => (page.style.display = "none"));

  const targetPage = document.querySelector(hash);

  // Ensure the page exists before trying to display it
  if (targetPage) {
    targetPage.style.display = "flex";
  }

  switch (hash) {
    case "#landingPage":
      initLandingPage();
      break;

    case "#artistHomePage":
      initArtistHomePage();
      break;

    case "#artistItemsPage":
      initArtistItemsPage();
      break;

    case "#artistAddNewItemPage":
      initArtistAddNewItemPage();
      break;

    case "#captureImagePage":
      initCaptureImage();
      break;

    case "#visitorHomePage":
      initVisitorHomePage();
      break;

    case "#visitorListingPage":
      initVisitorListingPage();
      break;

    case "#auctionPage":
      const items = getItems();
      const auctionItem = items.find((item) => item.isAuctioning);
      if (auctionItem) {
        initAuctionPage();
      } else {
        alert("No item is up for auctioning");
        location.hash = "landingPage";
      }
      break;

    default:
      console.error("Page not found:", hash);
      break;
  }
}

window.addEventListener("load", handleRouting);
window.addEventListener("hashchange", handleRouting);
