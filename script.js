let questionsArr = [];
let choicesArr = [];
let counter = 0;
let questionNum = document.querySelector(".question h2");
let theQuestion = document.querySelector(".question h3");
let choices = document.querySelector(".choices");
let time = document.querySelector(".time");
let submit = document.querySelector(".submit-div .submit");
let score = document.querySelector(".footer .score");
let correctScore = 0;
let timer = document.querySelector(".footer .time");
let timing = 120;
let timerDuration;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (myRequest.readyState === 4 && myRequest.status === 200) {
      let questions = JSON.parse(myRequest.responseText);
      getRandomQuestions(questions, questionsArr);
      buildSpans(questionsArr);
      buildQuestion(questionsArr);
    }
  };

  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}

getQuestions();

/**
 *    Create Array Of Random 5 Questions Without Repeating
 */

function getRandomQuestions(questions, questionsArr) {
  for (i = 0; i < 5; i++) {
    let random = Math.floor(Math.random() * questions.length);
    if (questionsArr.includes(questions[random])) {
      i--;
    } else {
      questionsArr.push(questions[random]);
    }
  }
  // console.log(questionsArr);

  return questionsArr;
}

/**
 *    Creating Bullets
 */

function buildSpans(arr) {
  let spansDiv = document.querySelector(".footer .spans");
  spansDiv.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    let span = document.createElement("span");
    if (i === counter) {
      span.className = "on";
    }
    spansDiv.append(span);
  }
}

/**
 *    Building Question And Random Choices
 */

function buildQuestion(questionsArr) {
  if (counter < questionsArr.length) {
    questionNum.innerHTML = "";
    theQuestion.innerHTML = "";
    choices.innerHTML = "";
    choicesArr = [];
    questionNum.innerHTML = `Question ${counter + 1}`;
    theQuestion.innerHTML = questionsArr[counter][`question`];
    for (j = 0; j < questionsArr[counter][`choices`].length; j++) {
      let randomChoise = Math.floor(
        Math.random() * questionsArr[counter][`choices`].length
      );

      if (choicesArr.includes(questionsArr[counter][`choices`][randomChoise])) {
        j--;
      } else {
        choicesArr.push(questionsArr[counter][`choices`][randomChoise]);
      }
    }
    // console.log(choicesArr);
    // console.log(questionsArr[counter]["correctAnswer"]);
    for (i = 0; i < choicesArr.length; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.className = "choice";
      let input = document.createElement("input");
      input.type = "radio";
      input.name = "choice";
      input.id = `choice-${i + 1}`;

      if (i === 0) {
        input.checked = true;
      }
      let label = document.createElement("label");

      label.htmlFor = `choice-${i + 1}`;
      label.innerHTML = choicesArr[i];
      answerDiv.append(input);
      answerDiv.append(label);
      choices.append(answerDiv);
    }
    score.innerHTML = `${correctScore}/${questionsArr.length}`;
  }
  timerDuration = timing;
}

/**
 *    Add Click Event To Submit Button
 */

submit.addEventListener("click", () => {
  let choice = document.querySelectorAll(".choices input");
  choice.forEach((e) => {
    if (e.checked === true) {
      let chosen = document.querySelector(`#${e.id} + label`).innerHTML;
      checkAnswer(chosen);
    }
  });
});

function checkAnswer(x) {
  // console.log(x);
  if (x === questionsArr[counter]["correctAnswer"]) {
    correctScore++;
    counter++;
    if (counter < questionsArr.length) {
      buildSpans(questionsArr);
      buildQuestion(questionsArr);
    } else {
      endMessage();
    }
  } else {
    counter++;
    if (counter >= questionsArr.length) {
      endMessage();
    } else {
      buildSpans(questionsArr);
      buildQuestion(questionsArr);
    }
  }

  // setInterval(timeDetails, 100);
}

function endMessage() {
  clearInterval(startTimer);
  document.querySelector(".question").remove();
  document.querySelector(".choices").remove();
  document.querySelector(".header").remove();
  document.querySelector(".footer").remove();
  document.querySelector(".submit-div").remove();
  let newScreen = document.createElement("div");
  newScreen.className = "question";
  let newScreenh1 = document.createElement("h1");
  if (correctScore === 5) {
    newScreenh1.innerHTML = `Perfect<br>All Your Answers Were Correct`;
    newScreenh1.className = "perfect";
  } else if (correctScore === 4) {
    newScreenh1.innerHTML = `Good<br>You answered ${correctScore} Correct Out Of 5`;
    newScreenh1.className = "good";
  } else if (correctScore < 4) {
    newScreenh1.innerHTML = `Not Good<br>You answered Only ${correctScore} Correct Out Of 5`;
    newScreenh1.className = "bad";
  }
  newScreen.append(newScreenh1);
  document.querySelector(".container").append(newScreen);
  document.querySelector(".container").style.cssText =
    "display:flex;justify-content:center;align-items:center;";
  document.querySelector(".question").style.cssText =
    "width:75%;height:50%;display:flex;justify-content:center;align-items:center;";
}

/**
 *    Setting Timer
 */

let startTimer = setInterval(() => {
  let m = parseInt(timerDuration / 60);
  let s = timerDuration % 60;

  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;
  time.innerHTML = `${m}:${s}`;

  // if (m < 10) {
  //   time.innerHTML = `0${m}:${s}`;
  // }
  // if (m === 0) {
  //   time.innerHTML = `00:${s}`;
  // }
  // if (s < 10) {
  //   time.innerHTML = `${m}:0${s}`;
  // }

  timerDuration--;
  if (timerDuration === 0) {
    submit.click();
  }
}, 1000);
