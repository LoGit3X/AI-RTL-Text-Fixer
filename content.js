// Check if extension is enabled for current domain
function checkIfEnabled(callback) {
  const currentDomain = window.location.hostname;
  chrome.storage.local.get(['extensionEnabled', 'platformStates'], (result) => {
    const isExtensionEnabled = result.extensionEnabled !== false;
    const platformStates = result.platformStates || {};
    const isPlatformEnabled = platformStates[currentDomain] !== false;
    
    callback(isExtensionEnabled && isPlatformEnabled);
  });
}

// Initialize extension
checkIfEnabled((isEnabled) => {
  if (isEnabled) {
    applyTextDirection(document.body);
    setupChatboxRTL();
    observeDynamicContent();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleExtension') {
    if (message.enabled) {
      checkIfEnabled((isEnabled) => {
        if (isEnabled) {
          applyTextDirection(document.body);
          setupChatboxRTL();
          observeDynamicContent();
        }
      });
    } else {
      // Reload the page to remove RTL styles when extension is disabled
      window.location.reload();
    }
  } else if (message.action === 'togglePlatform') {
    const currentDomain = window.location.hostname;
    if (currentDomain.includes(message.domain)) {
      if (message.enabled) {
        checkIfEnabled((isEnabled) => {
          if (isEnabled) {
            applyTextDirection(document.body);
            setupChatboxRTL();
            observeDynamicContent();
          }
        });
      } else {
        // Reload the page to remove RTL styles when platform is disabled
        window.location.reload();
      }
    }
  }
});

// Function to apply RTL/LTR direction
function applyTextDirection(element) {
  // First handle code blocks - always keep them LTR regardless of content
  const codeElements = element.querySelectorAll('pre, code, .code-block, [class*="code"], [class*="hljs"], [class*="language-"], div[class*="Code"], [data-language], .CodeMirror, [role="code"], [class*="syntaxHighlighter"], .token, .codejar');
  codeElements.forEach(codeElem => {
    if (codeElem) {
      codeElem.style.setProperty('direction', 'ltr', 'important');
      codeElem.style.setProperty('text-align', 'left', 'important');
      codeElem.style.setProperty('unicode-bidi', 'isolate', 'important');
      
      // Also force all children of code blocks to be LTR
      const children = codeElem.querySelectorAll('*');
      children.forEach(child => {
        child.style.setProperty('direction', 'ltr', 'important');
        child.style.setProperty('text-align', 'left', 'important');
        child.style.setProperty('unicode-bidi', 'isolate', 'important');
      });
    }
  });

  // Handle code block titles and numbered headings specially
  const codeBlockTitles = element.querySelectorAll('[class*="title"]:has(+ pre), [class*="title"]:has(+ .code-block), [class*="header"]:has(+ pre), h1:has(+ pre), h2:has(+ pre), h3:has(+ pre), h4:has(+ pre), h5:has(+ pre), h6:has(+ pre), div:has(+ pre), div:has(+ code), div:has(+ [class*="code"]), div:has(+ [class*="hljs"])');
  codeBlockTitles.forEach(title => {
    if (title.textContent.trim()) {
      const isPersianText = isPersian(title.textContent);
      if (isPersianText) {
        // Keep numbers LTR while making text RTL
        const hasNumber = /^[\d۰-۹]+[\.:]\s*/.test(title.textContent);
        if (hasNumber) {
          // Create a wrapper for the number if it doesn't exist
          let numberWrapper = title.querySelector('.number-wrapper');
          if (!numberWrapper) {
            const text = title.textContent;
            const numberMatch = text.match(/^([\d۰-۹]+[\.:]\s*)(.*)/);
            if (numberMatch) {
              const [_, number, content] = numberMatch;
              title.innerHTML = `<span class="number-wrapper" style="unicode-bidi:isolate;direction:ltr;display:inline-block;margin-left:0.5em;font-family:inherit">${number}</span>${content}`;
              
              // Force the number wrapper to stay LTR
              const wrapper = title.querySelector('.number-wrapper');
              if (wrapper) {
                wrapper.style.setProperty('direction', 'ltr', 'important');
                wrapper.style.setProperty('text-align', 'left', 'important');
                wrapper.style.setProperty('unicode-bidi', 'isolate', 'important');
                wrapper.style.setProperty('font-family', 'inherit', 'important');
              }
            }
          }
          
          // Set the main title container to RTL
          title.style.setProperty('direction', 'rtl', 'important');
          title.style.setProperty('text-align', 'right', 'important');
          title.style.setProperty('unicode-bidi', 'plaintext', 'important');
          title.style.setProperty('display', 'flex', 'important');
          title.style.setProperty('flex-direction', 'row-reverse', 'important');
          title.style.setProperty('align-items', 'center', 'important');
          title.style.setProperty('gap', '0.5em', 'important');
        } else {
          title.style.setProperty('direction', 'rtl', 'important');
          title.style.setProperty('text-align', 'right', 'important');
          title.style.setProperty('unicode-bidi', 'plaintext', 'important');
        }
      }
    }
  });

  // Then handle lists, numbers and special elements
  const listAndSpecialElements = element.querySelectorAll('li, ol, ul, .numbered-step, [class*="number"], [class*="list"], div:has(> ol), div:has(> ul)');
  listAndSpecialElements.forEach(elem => {
    // Skip if element is within a code block
    if (isInCodeBlock(elem)) return;
    
    if (elem.textContent.trim()) {
      const isPersianText = isPersian(elem.textContent);
      if (isPersianText) {
        elem.style.setProperty('direction', 'rtl', 'important');
        elem.style.setProperty('text-align', 'right', 'important');
        elem.style.setProperty('unicode-bidi', 'isolate', 'important');
        // Fix list markers position
        if (elem.tagName.toLowerCase() === 'li' || elem.tagName.toLowerCase() === 'ol' || elem.tagName.toLowerCase() === 'ul') {
          elem.style.setProperty('margin-right', '1.5em', 'important');
          elem.style.setProperty('margin-left', '0', 'important');
        }
      }
    }
  });

  // Handle headers and specific platform elements
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6, .text-lg, .text-xl, .text-2xl, [role="heading"], .title, .header, [class*="title"], [class*="header"]');
  headings.forEach(heading => {
    // Skip if element is within a code block
    if (isInCodeBlock(heading)) return;
    
    if (heading.textContent.trim()) {
      const isPersianText = isPersian(heading.textContent);
      if (isPersianText) {
        heading.style.setProperty('direction', 'rtl', 'important');
        heading.style.setProperty('text-align', 'right', 'important');
        heading.style.setProperty('unicode-bidi', 'isolate', 'important');
        // Fix any potential bullet points or numbers in headers
        const bulletOrNumber = heading.querySelector('span, strong, b');
        if (bulletOrNumber) {
          bulletOrNumber.style.setProperty('float', 'right', 'important');
          bulletOrNumber.style.setProperty('margin-left', '0.5em', 'important');
        }
      }
    }
  });

  // Handle paragraphs and text containers
  const textContainers = element.querySelectorAll('p, div, span, [class*="text"], [class*="content"]');
  textContainers.forEach(container => {
    // Skip if element is within a code block
    if (isInCodeBlock(container)) return;
    
    if (container.textContent.trim() && !container.matches('li, ol, ul, h1, h2, h3, h4, h5, h6, pre, code')) {
      const isPersianText = isPersian(container.textContent);
      if (isPersianText) {
        container.style.setProperty('direction', 'rtl', 'important');
        container.style.setProperty('text-align', 'right', 'important');
        container.style.setProperty('unicode-bidi', 'isolate', 'important');
      }
    }
  });

  // Then handle all remaining text nodes
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
      // Skip if parent is already processed or is a code element
      if (parent.matches('li, ol, ul, h1, h2, h3, h4, h5, h6, p, .text-lg, .text-xl, .text-2xl, [role="heading"], pre, code, [class*="code"]') || isInCodeBlock(parent)) {
        continue;
      }
      
      const isPersianText = isPersian(node.textContent);
      if (isPersianText) {
        parent.style.setProperty('direction', 'rtl', 'important');
        parent.style.setProperty('unicode-bidi', 'isolate', 'important');
        parent.style.setProperty('text-align', 'right', 'important');
      }
    }
  }
}

// Helper function to check if an element is inside a code block
function isInCodeBlock(element) {
  let current = element;
  while (current) {
    if (current.matches && (
        current.matches('pre, code, .code-block, [class*="code"], [class*="hljs"], [class*="language-"], div[class*="Code"], [data-language], .CodeMirror, [role="code"], [class*="syntaxHighlighter"], .token, .codejar')
    )) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

// Function to detect Persian text (improved)
function isPersian(text) {
  // Add support for Persian numbers and special characters
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]|[\u06F0-\u06F9]/;
  // If text contains Persian characters or is mixed with numbers in a Persian context
  return persianRegex.test(text) || (text.trim().match(/^[\d\s\u0600-\u06FF]+$/));
}

// Function to set up RTL for chatbox
function setupChatboxRTL() {
  // Selectors for all AI chat platforms
  const selectors = [
    // ChatGPT
    'textarea#prompt-textarea', 
    'div[contenteditable="true"]',
    
    // DeepSeek
    'textarea', 
    'input[type="text"]',
    '.cm-content',
    '.cm-line',
    
    // Perplexity.ai
    '.ProseMirror',
    '.perplexity-input',
    '.input-wrapper textarea',
    'div[role="textbox"]',
    
    // X.com/Grok
    '.public-DraftEditor-content',
    '.DraftEditor-editorContainer',
    'div[data-testid="tweetTextarea_0"]',
    
    // grok.com/chat
    '.grok-chat-input',
    '.grok-input-field',
    
    // Google AI Studio
    '.gemini-chat-input',
    '.gemini-text-entry',
    '.rta__textarea',
    
    // Claude.ai
    '.claude-input',
    '.claude-textarea',
    '.cl-textarea',
    
    // Qwen
    '.qwen-input',
    '.qwen-textarea',
    '.qwen-chat-input',
    
    // Generic web selectors that might match various chat inputs
    'textarea.chat-input',
    'div[role="textbox"]',
    'div[contenteditable="true"]',
    'textarea[placeholder*="message"]',
    'textarea[placeholder*="chat"]',
    'textarea[placeholder*="ask"]',
    'textarea[placeholder*="type"]',
    'textarea[placeholder*="write"]',
    'textarea[placeholder*="ارسال"]',
    'textarea[placeholder*="بنویسید"]',
    'textarea[aria-label*="message"]',
    'div[aria-label*="message"]',
    'div[contenteditable="true"][aria-label*="message"]',
    'div[contenteditable="true"][aria-label*="chat"]',
    '.message-input'
  ];

  const chatboxes = document.querySelectorAll(selectors.join(','));
  chatboxes.forEach(chatbox => {
    if (chatbox) {
      chatbox.style.direction = 'rtl';
      chatbox.style.textAlign = 'right';
      chatbox.setAttribute('dir', 'auto');

      const handleInput = (e) => {
        const target = e.target;
        // Skip direction change if in a code block (using ```code``` format)
        const text = target.value || target.textContent;
        const isCodeBlock = text && (text.includes('```') || text.includes('`'));
        
        if (isCodeBlock) {
          // If it's a code block, we don't want to change the direction
          return;
        }
        
        if (isPersian(text)) {
          target.style.direction = 'rtl';
          target.style.textAlign = 'right';
        } else {
          target.style.direction = 'ltr';
          target.style.textAlign = 'left';
        }
      };

      // Handle both input and contenteditable
      chatbox.addEventListener('input', handleInput);
      
      // For contenteditable elements
      if (chatbox.getAttribute('contenteditable') === 'true') {
        chatbox.addEventListener('keyup', handleInput);
      }
    }
  });
}

// Function to observe dynamic content
function observeDynamicContent() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          applyTextDirection(node);
          
          // Check for new chat inputs that might be dynamically added
          const chatboxSelectors = [
            // ChatGPT
            'textarea#prompt-textarea',
            'div[contenteditable="true"]',
            
            // DeepSeek
            'textarea',
            'input[type="text"]',
            '.cm-content',
            '.cm-line',
            
            // Perplexity.ai
            '.ProseMirror',
            '.perplexity-input',
            '.input-wrapper textarea',
            'div[role="textbox"]',
            
            // X.com/Grok
            '.public-DraftEditor-content',
            '.DraftEditor-editorContainer',
            'div[data-testid="tweetTextarea_0"]',
            
            // grok.com/chat
            '.grok-chat-input',
            '.grok-input-field',
            
            // Google AI Studio
            '.gemini-chat-input',
            '.gemini-text-entry',
            '.rta__textarea',
            
            // Claude.ai
            '.claude-input',
            '.claude-textarea',
            '.cl-textarea',
            
            // Qwen
            '.qwen-input',
            '.qwen-textarea',
            '.qwen-chat-input',
            
            // Generic web selectors
            'textarea.chat-input',
            'div[role="textbox"]',
            'div[contenteditable="true"]',
            'textarea[placeholder*="message"]',
            'textarea[placeholder*="chat"]',
            'textarea[placeholder*="ask"]',
            'textarea[placeholder*="type"]',
            'textarea[placeholder*="write"]',
            'textarea[placeholder*="ارسال"]',
            'textarea[placeholder*="بنویسید"]',
            'textarea[aria-label*="message"]',
            'div[aria-label*="message"]',
            'div[contenteditable="true"][aria-label*="message"]',
            'div[contenteditable="true"][aria-label*="chat"]',
            '.message-input'
          ];
          
          const chatboxes = node.querySelectorAll(chatboxSelectors.join(','));
          chatboxes.forEach(chatbox => {
            if (chatbox) {
              setupChatboxRTL();
            }
          });
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