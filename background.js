// Track M3U8 URLs per tab instead of globally
const tabM3U8Urls = new Map();

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.url.includes(".m3u8")) {
      console.log("[background] Detected .m3u8:", details.url, "in tab:", details.tabId);
      tabM3U8Urls.set(details.tabId, details.url);
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_M3U8") {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const currentTabId = tabs[0].id;
        const m3u8Url = tabM3U8Urls.get(currentTabId);
        console.log("[background] Responding with:", m3u8Url, "for tab:", currentTabId);
        sendResponse({ link: m3u8Url });
      } else {
        sendResponse({ link: null });
      }
    });
    return true; // Keep the message channel open for async response
  }
});

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabM3U8Urls.delete(tabId);
});
