console.log("[popup] Script loaded");

document.addEventListener("DOMContentLoaded", () => {
  const linksDiv = document.getElementById("links");

  if (!linksDiv) {
    console.error("No #links div found.");
    return;
  }

  chrome.runtime.sendMessage({ type: "GET_M3U8" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Runtime error:", chrome.runtime.lastError.message);
      linksDiv.innerText = "Error retrieving link.";
      return;
    }

    if (!response || !response.link) {
      linksDiv.innerText = "No .m3u8 link found yet.";
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const name = currentTab ? currentTab.title : null;
      const nameParam = name ? `&name=${encodeURIComponent(name)}` : "";
      
      const a = document.createElement("a");
      a.href = `https://m3u8.namitoyokota.com/player#${encodeURIComponent(response.link)}${nameParam}`;
      a.textContent = "Video found! Click to open in a new tab.";
      a.target = "_blank";

      linksDiv.innerHTML = "";
      linksDiv.appendChild(a);
    });
  });
});
