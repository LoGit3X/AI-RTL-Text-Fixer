// Helper function to check if Chrome APIs are available
function isChromeAPIAvailable() {
  return chrome.storage && chrome.storage.local && chrome.tabs;
}

document.addEventListener('DOMContentLoaded', () => {
  const platformList = document.getElementById('platform-list');
  const searchInput = document.getElementById('search-platforms');
  const themeToggle = document.getElementById('theme-toggle');
  const powerToggle = document.getElementById('toggle-extension');
  const refreshButton = document.getElementById('refresh-page');
  const fontToggles = document.querySelectorAll('.font-toggle');
  const platformToggles = document.querySelectorAll('.platforms__list input[type="checkbox"]');

  // Load theme and font settings from storage
  chrome.storage.sync.get(['theme', 'extensionEnabled', 'fontSettings'], result => {
    if (result.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (result.extensionEnabled === false) {
      powerToggle.classList.remove('enabled');
      powerToggle.classList.add('disabled');
    } else {
      powerToggle.classList.add('enabled');
      powerToggle.classList.remove('disabled');
    }

    // Initialize font toggle states
    const fontSettings = result.fontSettings || {};
    fontToggles.forEach(toggle => {
      const domain = toggle.dataset.domain;
      if (fontSettings[domain]) {
        toggle.classList.add('font-toggle--active');
        toggle.classList.remove('font-toggle--inactive');
      } else {
        toggle.classList.add('font-toggle--inactive');
        toggle.classList.remove('font-toggle--active');
      }
    });
  });

  // Get the main toggle switch
  const mainToggle = document.getElementById('toggle-extension');

  // Load extension state and update power toggle button
  if (isChromeAPIAvailable()) {
    chrome.storage.local.get(['extensionEnabled'], function (result) {
      const isEnabled = result.extensionEnabled !== false;
      mainToggle.classList.toggle('enabled', isEnabled);
      mainToggle.classList.toggle('disabled', !isEnabled);
    });

    // Handle power toggle button click
    mainToggle.addEventListener('click', function () {
      const isEnabled = !mainToggle.classList.contains('enabled');
      mainToggle.classList.toggle('enabled', isEnabled);
      mainToggle.classList.toggle('disabled', !isEnabled);

      chrome.storage.sync.set({ extensionEnabled: isEnabled }, function () {
        // Update tab
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'toggleExtension',
              enabled: isEnabled,
            });
            chrome.tabs.reload(tabs[0].id);
          }
        });
      });
    });
  }

  // Load theme from storage
  if (isChromeAPIAvailable()) {
    chrome.storage.sync.get(['theme'], function (result) {
      const theme = result.theme || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  // Handle theme toggle
  themeToggle.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);

    // Save theme to storage
    if (isChromeAPIAvailable()) {
      chrome.storage.sync.set({ theme: newTheme });
    }
  });

  // Add refresh button functionality
  refreshButton.addEventListener('click', function () {
    if (isChromeAPIAvailable()) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }
  });

  // Load current states from storage
  if (isChromeAPIAvailable()) {
    chrome.storage.local.get(['extensionEnabled', 'platformStates'], function (result) {
      // Set main toggle state (default to enabled)
      const isEnabled = result.extensionEnabled !== false;
      mainToggle.checked = isEnabled;

      // Set individual platform states
      const platformStates = result.platformStates || {};
      platformToggles.forEach(toggle => {
        const domain = toggle.dataset.domain;
        // Default to disabled if not set
        toggle.checked = platformStates[domain] === true;
      });
    });

    // Handle main toggle changes
    mainToggle.addEventListener('change', function () {
      const isEnabled = mainToggle.checked;

      chrome.storage.sync.set({ extensionEnabled: isEnabled }, function () {
        // Update tab
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'toggleExtension',
              enabled: isEnabled,
            });
            chrome.tabs.reload(tabs[0].id);
          }
        });
      });
    });

    // Handle font toggle clicks
    fontToggles.forEach(toggle => {
      toggle.addEventListener('click', function (event) {
        // Stop event propagation to parent elements
        event.stopPropagation();

        const domain = this.dataset.domain;
        const isActive = this.classList.contains('font-toggle--active');

        // Toggle active state
        if (isActive) {
          this.classList.remove('font-toggle--active');
          this.classList.add('font-toggle--inactive');
        } else {
          this.classList.remove('font-toggle--inactive');
          this.classList.add('font-toggle--active');
        }

        // Save font settings
        chrome.storage.sync.set({ ['fontEnabled_' + domain]: !isActive }, function () {
          // Update tab
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
              chrome.tabs.reload(tabs[0].id);
            }
          });
        });
      });
    });

    // Handle individual platform toggles
    platformToggles.forEach(toggle => {
      toggle.addEventListener('change', function () {
        const domain = this.dataset.domain;
        const isEnabled = this.checked;

        if (isChromeAPIAvailable()) {
          chrome.storage.local.get(['platformStates'], function (result) {
            const platformStates = result.platformStates || {};
            platformStates[domain] = isEnabled;

            chrome.storage.local.set({ platformStates }, function () {
              chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs[0]) {
                  chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'togglePlatform',
                    domain,
                    enabled: isEnabled,
                  });
                  chrome.tabs.reload(tabs[0].id);
                }
              });
            });
          });
        }
      });
    });

    // Handle platform item clicks
    document.querySelectorAll('.platforms__item').forEach(item => {
      item.addEventListener('click', function (event) {
        // Ignore clicks on the info button
        if (event.target.closest('.platforms__info')) {
          const domain = this.querySelector('.toggle__input').dataset.domain;
          if (isChromeAPIAvailable()) {
            chrome.tabs.create({ url: `https://${domain}` });
          }
          return;
        }

        // Toggle the checkbox
        const checkbox = this.querySelector('.toggle__input');
        if (!checkbox.disabled) {
          checkbox.checked = !checkbox.checked;

          // Trigger the change event
          const changeEvent = new Event('change');
          checkbox.dispatchEvent(changeEvent);
        }
      });
    });

    // Handle platform search
    searchInput.addEventListener('input', function () {
      const searchTerm = this.value.toLowerCase();
      const platformItems = document.querySelectorAll('.platforms__item');

      platformItems.forEach(item => {
        const platformName = item.querySelector('.platforms__name').textContent.toLowerCase();
        const platformDomain = item.querySelector('.platforms__domain').textContent.toLowerCase();

        if (platformName.includes(searchTerm) || platformDomain.includes(searchTerm)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
});
