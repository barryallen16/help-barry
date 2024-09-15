chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'processMcq') {
      const { mcq } = message;
  
      fetch('http://localhost:3000/generateAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mcq: mcq })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Generated answers:", data.answers);
        // Optionally send the results back to the popup or another part of the extension
        chrome.runtime.sendMessage({ action: 'displayAnswers', answers: data.answers });
      })
      .catch(error => {
        console.error("Error fetching answers:", error);
      });
    }
  });
  