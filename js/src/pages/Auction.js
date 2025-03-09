import { getArtist, getCurrentBid, updateCurrentBid } from "../utils/global.js";

import { getItems } from "../../data/db.js";
import { auctionTime, startTimer, endAuction } from "../utils/dates.js";
import { initHeader } from "../layout/renderHeader.js";
let isPlaceBidListenerAdded = false;

export function initAuctionPage() {
  initHeader("visitor");
  const items = getItems();
  const item = items.find((item) => item.isAuctioning);
  if (!item || typeof item.price !== "number") {
    console.error("Invalid item provided to initAuctionPage:", item);
    alert("Invalid item data. Unable to start auction.");
    return;
  }

  const currentArtist = getArtist();
  const bidButton = document.getElementById("bidButton");
  const bidInput = document.getElementById("bidAmount");
  const itemImage = document.getElementById("itemImage");
  const itemTitle = document.getElementById("itemTitle");
  const itemArtist = document.getElementById("itemArtist");
  const itemDescription = document.getElementById("itemDescription");

  if (currentArtist) {
    bidButton.disabled = true;
    bidInput.disabled = true;
  } else {
    bidButton.disabled = false;
    bidInput.disabled = false;
  }
  const time = localStorage.getItem("auctionTimer") || auctionTime;
  startTimer(time);

  function renderItemData(item) {
    itemImage.src = item.image;
    itemTitle.innerText = item.title;
    itemArtist.innerText = item.artist;
    itemDescription.innerText = item.description;
  }

  let currentBidAmount = getCurrentBid() || item.price / 2; // initial bid

  renderItemData(item);

  function updateBidDisplay() {
    const currentBidDisplay = document.getElementById("current-bid");
    currentBidDisplay.innerText = currentBidAmount;
  }

  if (!isPlaceBidListenerAdded) {
    isPlaceBidListenerAdded = true;
    bidButton.addEventListener("click", async () => {
      const bidValue = parseFloat(bidInput.value);

      // Check if the user is an artist
      if (currentArtist && currentArtist.role === "artist") {
        alert("Artists cannot bid in auctions.");
        return; // Disable bidding for artists
      }

      if (bidValue > currentBidAmount) {
        const response = await fetch(
          "https://projects.brainster.tech/bidding/api",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `amount=${bidValue}`,
          }
        );

        const result = await response.json();

        if (result.isBidding) {
          currentBidAmount = result.bidAmount;
          updateCurrentBid(currentBidAmount); // Update the global current bid
          updateBidDisplay();
          startTimer(auctionTime); // reset timer
        } else {
          alert("No other bids were placed. Please wait until the timer ends.");
          endAuction();
        }

        bidButton.disabled = true; // Disable the button after bidding
      } else {
        alert("Your bid must be higher than the current bid.");
      }
    });
  }
  // Initially set the display
  updateBidDisplay();
}
