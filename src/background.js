let isActive = false;
chrome.action.onClicked.addListener((tab) => {
  isActive = !isActive;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["web.js"],
  });
});