(() => {
  let formOptions = []; // Changed from 'options' to 'formOptions'
  let tempArray = [];
  let myString = "";
  let question = [];

  let optionElements = document.querySelectorAll('label span');
  let elements = document.querySelectorAll('[role="heading"] span');

  elements.forEach((element) => {
    if (element.textContent.trim() !== "*") {
      question.push(element.textContent.trim());
    }
  });

  for (let i = 0; i < question.length; i++) {
    myString += "\n" + question[i] + "\n";

    optionElements.forEach((optionElement) => {
      formOptions.push(`${optionElement.textContent.trim()}`);
    });

    tempArray = formOptions.splice(0, 4);

    tempArray.forEach(item => {
      myString += item + "\n";
    });
  }

  // Send the collected data to the background script for processing
  chrome.runtime.sendMessage({ action: "processMcq", mcq: myString });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getMcq") {
      sendResponse({ mcq: myString });
      return true;
    }
  });
})();
