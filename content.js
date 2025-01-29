// Check if extension is enabled
chrome.storage.local.get(['extensionEnabled'], (result) => {
  const isEnabled = result.extensionEnabled !== false; // Default to true
  if (isEnabled) {
    applyTextDirection(document.body);
    setupChatboxRTL();
    observeDynamicContent();
  }
});

// Function to apply RTL/LTR direction
function applyTextDirection(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const parent = node.parentElement;
      const isPersianText = isPersian(node.textContent);
      
      parent.style.setProperty('direction', isPersianText ? 'rtl' : 'ltr', 'important');
      parent.style.setProperty('unicode-bidi', 'isolate', 'important');
      parent.style.setProperty('text-align', isPersianText ? 'right' : 'left', 'important');
    }
  }
}

// Function to detect Persian text
function isPersian(text) {
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return persianRegex.test(text);
}

// Function to set up RTL for chatbox
function setupChatboxRTL() {
  const chatbox = document.querySelector('textarea, input[type="text"]'); // Adjust selector for DeepSeek's chatbox
  if (chatbox) {
    chatbox.style.direction = 'rtl';
    chatbox.style.textAlign = 'right';
    chatbox.setAttribute('dir', 'auto');

    chatbox.addEventListener('input', (e) => {
      if (isPersian(e.target.value)) {
        e.target.style.direction = 'rtl';
        e.target.style.textAlign = 'right';
      } else {
        e.target.style.direction = 'ltr';
        e.target.style.textAlign = 'left';
      }
    });
  }
}

// Function to observe dynamic content
function observeDynamicContent() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          applyTextDirection(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}