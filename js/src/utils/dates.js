import { getCurrentBid, setAuctionStatus, updateCurrentBid } from "./global.js";

export function timestampNow() {
  return new Date().valueOf();
}

export function generateDateLabels(daysAgo = 7) {
  const labels = [];
  for (let i = 0; i < daysAgo; i++) {
    const now = new Date();

    const date = now.getDate();
    const offsetDate = now.setDate(date - i);

    const formattedLabel = formatDate(offsetDate);

    labels.push(formattedLabel);
  }
  return labels;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB");
}

export let timer;
export const auctionTime = 120;
const timerDisplay = document.getElementById("timerValue");
export function startTimer(duration) {
  let remainingTime = duration;
  if (remainingTime <= 0) {
    alert("Auction has ended.");
    endAuction();
    return;
  }
  timerDisplay.innerText = remainingTime;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    remainingTime--;
    timerDisplay.innerText = remainingTime;

    // Save to localStorage
    localStorage.setItem("auctionTimer", remainingTime);

    if (remainingTime <= 0) {
      clearInterval(timer);
      endAuction();
    }
  }, 1000);
}

export function endAuction() {
  timerDisplay.innerText = 0;
  const items = JSON.parse(localStorage.getItem("items"));
  const auctioningItem = items.find((i) => i.isAuctioning);
  const newItems = items.map((i) => {
    if (i.id === auctioningItem.id) {
      i.priceSold = getCurrentBid();
      i.dateSold = new Date();
    }
    return { ...i, isAuctioning: false };
  });

  localStorage.setItem("items", JSON.stringify(newItems));
  updateCurrentBid(0);
  setAuctionStatus(false);
  clearInterval(timer);
  alert("Auction has ended!");
}
