let currentEnabled = false;
let observerTimer = null;

function enableDark() {
  if (currentEnabled) return;
  currentEnabled = true;
  document.documentElement.classList.add("darkmode");
}

function disableDark() {
  if (!currentEnabled) return;
  currentEnabled = false;
  document.documentElement.classList.remove("darkmode");
}

function applyToIframes() {
  const iframes = document.querySelectorAll("iframe#emailuiFrame");
  iframes.forEach((iframe) => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc) return;
      if (
        doc.documentElement &&
        !doc.documentElement.classList.contains("darkmode")
      ) {
        doc.documentElement.classList.add("darkmode");
        if (!doc.getElementById("dm-iframe-style")) {
          const s = doc.createElement("style");
          s.id = "dm-iframe-style";
          s.textContent =
            "img,video,canvas{filter:none!important;background:transparent!important;}";
          doc.head && doc.head.appendChild(s);
        }
      }
    } catch (err) {}
  });
}

const observer = new MutationObserver(() => {
  if (!currentEnabled) return;
  if (observerTimer) clearTimeout(observerTimer);
  observerTimer = setTimeout(() => {
    applyToIframes();
  }, 250);
});

// Always observe — the content script is injected only into matching pages per manifest
observer.observe(document.documentElement || document, { childList: true, subtree: true });

// Initialize from storage, but cache to avoid repeated DOM work
chrome.storage.sync.get({ darkModeEnabled: false }, (data) => {
  if (data.darkModeEnabled) {
    enableDark();
    applyToIframes();
  } else {
    disableDark();
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.darkModeEnabled) {
    const enabled = Boolean(changes.darkModeEnabled.newValue);
    enabled ? (enableDark(), applyToIframes()) : disableDark();
  }
});

// Listen for explicit runtime messages (from background)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== "set-dark") return;
  const enabled = Boolean(message.enabled);
  enabled ? (enableDark(), applyToIframes()) : disableDark();
  sendResponse({ ok: true });
});
