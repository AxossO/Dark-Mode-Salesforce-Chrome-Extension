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

const observer = new MutationObserver(() => {
  if (document.body.classList.contains("darkmode")) {
    applyDarkMode();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from background
chrome.runtime.onMessage.addListener((message) => {
  if (message.darkModeEnabled === true) applyDarkMode();
  else if (message.darkModeEnabled === false) removeDarkMode();
});

chrome.storage.sync.get("darkModeEnabled", (data) => {
  if (data.darkModeEnabled) applyDarkMode();
  else removeDarkMode();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.darkModeEnabled) {
    const enabled = changes.darkModeEnabled.newValue;
    enabled ? applyDarkMode() : removeDarkMode();
  }
});
