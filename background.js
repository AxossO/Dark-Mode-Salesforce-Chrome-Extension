chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ darkModeEnabled: false });
});

chrome.storage.onChanged.addListener(function (changes) {
  if (changes.darkModeEnabled) {
    const darkModeEnabled = changes.darkModeEnabled.newValue;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { darkModeEnabled }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn(
            "Content script not ready for this tab:",
            chrome.runtime.lastError.message
          );
        }
      });
    });
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.storage.sync.get("darkModeEnabled", async (data) => {
    const newState = !data.darkModeEnabled;
    await chrome.storage.sync.set({ darkModeEnabled: newState });

    const iconPath = newState
      ? { 16: "icons/day-16px.png" }
      : { 16: "icons/night-16px.png" };
    await chrome.action.setIcon({ path: iconPath });
  });
});
