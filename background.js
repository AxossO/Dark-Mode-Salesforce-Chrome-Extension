chrome.runtime.onInstalled.addListener(function () {
  // Set default value for dark mode enabled
  chrome.storage.sync.set({ darkModeEnabled: false });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.darkModeEnabled) {
    const darkModeEnabled = changes.darkModeEnabled.newValue;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { darkModeEnabled });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");

  darkModeToggle.addEventListener("change", function () {
    chrome.storage.sync.set({ darkModeEnabled: darkModeToggle.checked });
  });
});
