document.getElementById('generate').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js']
        },
        () => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "getMcq" }, (response) => {
            if (response && response.mcq) {
              chrome.runtime.sendMessage({ action: 'processMcq', mcq: response.mcq });
            } else {
              console.error("No MCQ data received.");
            }
          });
        }
      );
    });
  });
  
  // Listen for answers from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'displayAnswers') {
      document.getElementById('mcq-input').value = message.answers;
    }
  });
  