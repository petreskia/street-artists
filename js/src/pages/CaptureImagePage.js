import { initHeader } from "../layout/renderHeader.js";

const constraints = {
  video: { facingMode: { ideal: "environment" } },
};

export function initCaptureImage() {
  initHeader("artist");
  const liveStreamVideo = document.querySelector("video");
  const snapshotCanvas = document.querySelector("canvas");
  const captureSnapshotBtn = document.querySelector("#captureSnapshot");

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    liveStreamVideo.srcObject = stream;
  });

  captureSnapshotBtn.addEventListener("click", function () {
    snapshotCanvas.width = liveStreamVideo.videoWidth;
    snapshotCanvas.height = liveStreamVideo.videoHeight;

    const ctx = snapshotCanvas.getContext("2d");
    ctx.drawImage(liveStreamVideo, 0, 0);

    const imgData = snapshotCanvas.toDataURL("image/png");

    // Store image data temporarily
    localStorage.setItem("capturedImage", imgData);
    location.hash = "#artistAddNewItemPage";
  });
}
