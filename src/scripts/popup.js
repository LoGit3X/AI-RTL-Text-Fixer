document.addEventListener('DOMContentLoaded', function () {
  // Get the main toggle switch and platform toggles
  const mainToggle = document.getElementById('toggle-extension');
  const platformToggles = document.querySelectorAll('.platforms__list input[type="checkbox"]');
  const searchInput = document.getElementById('search-platforms');
  const refreshButton = document.getElementById('refresh-page');
  const themeToggle = document.getElementById('theme-toggle');

  // Load theme from storage
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['theme'], function (result) {
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
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ theme: newTheme });
    }
  });

  // Add refresh button functionality
  refreshButton.addEventListener('click', function () {
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }
  });

  // Load current states from storage
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['extensionEnabled', 'platformStates'], function (result) {
      // Set main toggle state (default to enabled)
      const isEnabled = result.extensionEnabled !== false;
      mainToggle.checked = isEnabled;

      // Set individual platform states
      const platformStates = result.platformStates || {};
      platformToggles.forEach(toggle => {
        const domain = toggle.dataset.domain;
        // Default to enabled if not set
        toggle.checked = platformStates[domain] !== false;
        // Disable toggle if main extension is disabled
        toggle.disabled = !isEnabled;
      });
    });

    // Handle main toggle changes
    mainToggle.addEventListener('change', function () {
      const isEnabled = mainToggle.checked;

      // Save main state
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ extensionEnabled: isEnabled }, function () {
          console.log('Extension is now ' + (isEnabled ? 'enabled' : 'disabled'));

          // Enable/disable platform toggles
          platformToggles.forEach(toggle => {
            toggle.disabled = !isEnabled;
          });

          // Notify content scripts of the change and reload the page
          if (chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  action: 'toggleExtension',
                  enabled: isEnabled,
                });
                // Reload the current tab
                chrome.tabs.reload(tabs[0].id);
              }
            });
          }
        });
      }
    });

    // Handle individual platform toggles
    platformToggles.forEach(toggle => {
      toggle.addEventListener('change', function () {
        const domain = this.dataset.domain;
        const isEnabled = this.checked;

        // Load current platform states
        if (chrome.storage && chrome.storage.local) {
          chrome.storage.local.get(['platformStates'], function (result) {
            const platformStates = result.platformStates || {};
            platformStates[domain] = isEnabled;

            // Save updated platform states
            chrome.storage.local.set({ platformStates: platformStates }, function () {
              console.log(`${domain} is now ${isEnabled ? 'enabled' : 'disabled'}`);

              // Notify content scripts of the change
              if (chrome.tabs) {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                  if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                      action: 'togglePlatform',
                      domain: domain,
                      enabled: isEnabled,
                    });
                  }
                });
              }
            });
          });
        }
      });
    });

    // Handle platform info clicks
    document.querySelectorAll('.platforms__info').forEach(info => {
      info.addEventListener('click', function () {
        const domain = this.closest('.platforms__item').querySelector('.toggle__input').dataset.domain;
        const url = `https://${domain}`;
        if (chrome.tabs) {
          chrome.tabs.create({ url: url });
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
