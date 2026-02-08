chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ darkModeEnabled: false });
});

// chrome.storage.onChanged.addListener(function (changes) {
//   if (changes.darkModeEnabled) {
//     const darkModeEnabled = changes.darkModeEnabled.newValue;
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       if (!tabs[0]) return;
//       chrome.tabs.sendMessage(tabs[0].id, { darkModeEnabled }, (response) => {
//         if (chrome.runtime.lastError) {
//           console.warn(
//             "Content script not ready for this tab:",
//             chrome.runtime.lastError.message,
//           );
//         }
//       });
//     });
//   }
// });

const tabStates = {};
const ICON_PATHS = {
  active: {
    16: "icons/day-16px.png",
    32: "icons/day-32px.png",
    64: "icons/day-64px.png",
    128: "icons/day-128px.png",
  },
  inactive: {
    16: "icons/night-16px.png",
    32: "icons/night-32px.png",
    64: "icons/night-64px.png",
    128: "icons/night-128px.png",
  },
};
chrome.action.onClicked.addListener(async (tab) => {
  const tabId = tab.id;
  tabStates[tabId] = !tabStates[tabId];

  chrome.storage.sync.get("darkModeEnabled", async (data) => {
    const newState = !data.darkModeEnabled;
    await chrome.storage.sync.set({ darkModeEnabled: newState });

    const iconPath = newState
      ? { 16: "icons/day-16px.png" }
      : { 16: "icons/night-16px.png" };
    await chrome.action.setIcon({ path: iconPath });
  });
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (!sender.tab || !sender.tab.id) return;
  const tabId = sender.tab.id;
  if (msg.action === "setIconInactive") {
    tabStates[tabId] = false;
    chrome.action.setIcon({ path: ICON_PATHS.inactive, tabId });
  }
  if (msg.action === "setIconActive") {
    tabStates[tabId] = true;
    chrome.action.setIcon({ path: ICON_PATHS.active, tabId });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabStates[tabId];
});
