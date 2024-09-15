(() => {
  let formOptions = []; // Changed from 'options' to 'formOptions'
  let myString = "";
  let question = [];

  let optionElements = document.querySelectorAll('label span');
  let elements = document.querySelectorAll('[role="heading"] span');

  // Collect the questions
  elements.forEach((element) => {
    if (element.textContent.trim() !== "*") {
      question.push(element.textContent.trim());
    }
  });

  // Process each question and its options
  for (let i = 0; i < question.length; i++) {
    myString += "\n" + question[i] + "\n";

    optionElements.forEach((optionElement) => {
      formOptions.push(optionElement.textContent.trim());
    });

    // Collect options for the current question
    let tempArray = formOptions.slice(i * 4, (i + 1) * 4); // Slice instead of splice

    tempArray.forEach(item => {
      myString += item + "\n";
    });
  }

  // Send the collected data to the background script for processing
  chrome.runtime.sendMessage({ action: "processMcq", mcq: myString });

  // Listen for the answers from the background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'displayAnswers') {
      let allSpan = Array.from(document.querySelectorAll('label span'));
      let teArray = message.answers.trim().split('\n');

      for (let i = 0; i < teArray.length; i++) {
        let answer = teArray[i];
        // Correctly slice the options for the current question (assuming 4 options per question)
        let tempArray = allSpan.slice(i * 4, (i + 1) * 4);

        // Iterate through the options to find the matching answer
        for (let j = 0; j < tempArray.length; j++) {
          if (tempArray[j].innerText.trim() === answer.trim()) {
            // Correctly highlight the option when hovering
            tempArray[j].addEventListener('mouseover', () => {
              tempArray[j].style.fontSize = "15px";
            });
            tempArray[j].addEventListener('mouseout', () => {
              tempArray[j].style.fontSize = "";
            });
            break;
          }
        }
      }
      console.log('done');
    }
  });

  // Listen for getMcq request
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getMcq") {
      sendResponse({ mcq: myString });
      return true;
    }
  });
})();
