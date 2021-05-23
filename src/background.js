let isActive = false;
chrome.action.onClicked.addListener((tab) => {
  isActive = !isActive;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["web.js"],
  });
  chrome.browserAction.setIcon({
    path: isActive ? "/icons/icon128.png" : "/icons/icon128negative.png",
    tabId: sender.tab.id,
  });
});
