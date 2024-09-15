(() => {
  let formOptions = [];
  let tempArray = [];
  let myString = "";
  let question = [];
  let answers = [];

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

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getMcq") {
      sendResponse({ mcq: myString });
      return true;
    }
    if (request.action === "applyStyles") {
      answers = request.answers;
      applyStylesToAnswers(answers);
    }
  });

  function applyStylesToAnswers(answers) {
    // Find and style the elements containing the answers
    let allSpans = document.querySelectorAll('label span');
    allSpans.forEach(span => {
      if (answers.includes(span.textContent.trim())) {
        span.style.fontWeight = '500';
      }
    });
  }
})();
