document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  chrome.storage.sync.get("darkModeEnabled", (data) => {
    darkModeToggle.checked = data.darkModeEnabled || false;
  });

  darkModeToggle.addEventListener("change", () => {
    const darkModeEnabled = darkModeToggle.checked;
    chrome.storage.sync.set({ darkModeEnabled });
  });
});
