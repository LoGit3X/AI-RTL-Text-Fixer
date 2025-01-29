function isPersian(text) {
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return persianRegex.test(text);
}

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
      
      // Set direction with important flag
      parent.style.setProperty('direction', isPersianText ? 'rtl' : 'ltr', 'important');
      
      // Improved bidi isolation
      parent.style.setProperty('unicode-bidi', 'isolate', 'important');
      
      // Reset text-align to initial
      parent.style.setProperty('text-align', 'initial', 'important');
    }
  }
}

// Apply to existing content
document.querySelectorAll('*').forEach(applyTextDirection);

// Mutation Observer for dynamic content
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

// Inject global styles
const style = document.createElement('style');
style.textContent = `
  [style*="direction: rtl"] {
    text-align: right !important;
  }
  [style*="direction: ltr"] {
    text-align: left !important;
  }
`;
document.head.appendChild(style);