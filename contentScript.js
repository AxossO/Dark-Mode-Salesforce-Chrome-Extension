function applyDarkMode() {
  document.body.classList.add("darkmode");

  const iframes = document.querySelectorAll("iframe#emailuiFrame");
  iframes.forEach((iframe) => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      if (!iframeDoc) return;
      if (!iframeDoc.body || iframeDoc.querySelector("table")) return;
      iframeDoc.body.classList.add("whiteyy");
      const cssLink = iframeDoc.createElement("link");
      cssLink.href = chrome.runtime.getURL("darkmode.css");
      cssLink.rel = "stylesheet";
      cssLink.type = "text/css";
      iframeDoc.head.appendChild(cssLink);
    } catch (err) {
      console.warn("Could not apply dark mode to iframe:", err);
    }
  });
}

function removeDarkMode() {
  document.body.classList.remove("darkmode");
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message) => {
  if (message.darkModeEnabled !== undefined) {
    if (message.darkModeEnabled) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  }
});

// Observe DOM changes (for dynamically loaded Salesforce UI parts)
const observer = new MutationObserver(() => {
  if (document.body.classList.contains("darkmode")) {
    applyDarkMode();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

// Ensure initial state is applied when page loads
chrome.storage.sync.get("darkModeEnabled", (data) => {
  if (data.darkModeEnabled) {
    applyDarkMode();
  }
});
