// Get elements
const toggleExtensionButton = document.getElementById('toggleExtension');
const refreshPageButton = document.getElementById('refreshPage');
const statusText = document.getElementById('statusText');

// Load extension state from storage
chrome.storage.local.get(['extensionEnabled'], (result) => {
  const isEnabled = result.extensionEnabled !== false; // Default to true
  updateUI(isEnabled);
});

// Toggle extension state
toggleExtensionButton.addEventListener('click', () => {
  chrome.storage.local.get(['extensionEnabled'], (result) => {
    const newState = !(result.extensionEnabled !== false);
    chrome.storage.local.set({ extensionEnabled: newState }, () => {
      updateUI(newState);
    });
  });
});

// Refresh page
refreshPageButton.addEventListener('click', () => {
  chrome.tabs.reload();
});

// Update UI based on extension state
function updateUI(isEnabled) {
  statusText.textContent = isEnabled ? 'Enabled' : 'Disabled';
  statusText.style.color = isEnabled ? 'green' : 'red';
  toggleExtensionButton.textContent = isEnabled ? 'Disable Extension' : 'Enable Extension';
}