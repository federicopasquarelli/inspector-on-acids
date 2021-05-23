let isActive = false;
const replaceIcon = () => {
  chrome.action.setIcon({
    path: isActive ? "/icons/icon128negative.png" : "/icons/icon128.png",
  });
};
chrome.action.onClicked.addListener((tab) => {
  isActive = !isActive;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["web.js"],
  });
  replaceIcon();
});
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg === "disable") {
    isActive = false;
    replaceIcon();
  }
});
