// Set default extension state
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ extensionEnabled: true });
  });