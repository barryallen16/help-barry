chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'processMcq') {
    const { mcq } = message;

    // Send a POST request to your server with the MCQ data
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
      console.log('Received answers:', data.answers);

      // Send the answers back to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'displayAnswers', answers: data.answers });
      });
    })
    .catch(error => {
      console.error("Error fetching answers:", error);
    });
  }
});
