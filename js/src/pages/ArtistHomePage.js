import { getItems } from "../../data/db.js";
import {
  getArtist,
  isAuctionOngoingStatus,
  getCurrentBid,
} from "../../src/utils/global.js";
import { initHeader } from "../layout/renderHeader.js";
import { formatDate, generateDateLabels } from "../utils/dates.js";

let chartInstance;

export function initArtistHomePage() {
  initHeader("artist");
  const selectedArtist = getArtist();
  document.querySelector("#artistName").textContent = selectedArtist;

  // Update total items sold and total income
  updateTotalItemsSoldAndIncome(selectedArtist);

  // Update auction widget
  updateAuctionWidget();

  // Reset filter buttons and set default to 7 days
  resetFilterButtons();

  // Initialize chart with default 7 days view
  drawChart(7);

  // Add event listeners for quick picker buttons
  const filterButtons = [
    { id: "#last7days", days: 7 },
    { id: "#last14days", days: 14 },
    { id: "#last30days", days: 30 },
  ];

  filterButtons.forEach(({ id, days }) => {
    const button = document.querySelector(id);
    button.addEventListener("click", () => {
      drawChart(days);
      setActiveButton(
        button,
        filterButtons.map((btn) => btn.id)
      );
    });
  });
}
// Reset active state of filter buttons and set default to 7 days
function resetFilterButtons() {
  document.querySelectorAll(".filter-btns button").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector("#last7days").classList.add("active");
}

function setActiveButton(activeButton, buttonIds) {
  buttonIds.forEach((id) => {
    const btn = document.querySelector(id);
    btn.classList.toggle("active", btn === activeButton);
  });
}

function updateTotalItemsSoldAndIncome(selectedArtist) {
  const items = getItems();
  const artistItems = items.filter((item) => item.artist === selectedArtist);
  const totalItems = artistItems.length;
  const soldItems = artistItems.filter((item) => item.dateSold).length;
  const totalIncome = artistItems.reduce((sum, item) => {
    return item.dateSold ? sum + item.priceSold : sum;
  }, 0);

  document.querySelector(
    "#totalItemsSold"
  ).textContent = `${soldItems}/${totalItems}`;
  document.querySelector("#totalIncome").textContent = `$${totalIncome}`;
}

function updateAuctionWidget() {
  const auctionItemCard = document.querySelector("#auctionItemCard");
  const currentBid = document.querySelector("#currentBid");

  if (isAuctionOngoingStatus()) {
    const auctioningItem = getItems().find((i) => i.isAuctioning);
    currentBid.textContent = auctioningItem.name;
    // test
    // auctionItemCard.style.display = "block";
    document.querySelector("#currentBid").textContent = `$${
      getCurrentBid() || auctioningItem.price / 2
    }`;
    auctionItemCard.addEventListener("click", () => {
      location.hash = "#auctionPage";
    });
  } else {
    // test
    // auctionItemCard.style.display = "none";
    currentBid.textContent = "No auctioning item";
    currentBid.classList.add("no-bid");
  }
}

function drawChart(daysAgo) {
  const labels = generateDateLabels(daysAgo);
  const selectedArtist = getArtist();
  const items = getItems();
  const artistItems = items.filter(
    (item) => item.artist === selectedArtist && item.priceSold
  );

  const data = getChartData(artistItems, labels);

  if (chartInstance) {
    // Update chart data
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.update();
  } else {
    // Create a new chart
    chartInstance = initChart({ labels, data });
  }
}

function getChartData(items = [], labels = []) {
  return labels.map((label) => {
    return items.reduce((sum, item) => {
      return formatDate(item.dateSold) === label ? sum + item.priceSold : sum;
    }, 0);
  });
}

function initChart(config) {
  const ctx = document.getElementById("myChart").getContext("2d");

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: config.labels,
      datasets: [
        {
          label: "Amount",
          data: config.data,
          backgroundColor: "rgba(161, 106, 95, 0.7)",
          borderColor: "rgba(161, 106, 95, 0.7)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: { beginAtZero: true },
      },
      maintainAspectRatio: false,
    },
  });
}
