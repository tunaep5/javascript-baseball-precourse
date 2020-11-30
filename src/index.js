export default class BaseballGame {
  constructor() {
    this.answerNumbers = this.makeAnswerNumbers();

    this.bindSubmitEvent();
  }

  makeAnswerNumbers = () => {
    const numberSet = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result = [];

    for (let i = 0; i < 3; i++) {
      const randomNumberIndex = Math.floor(Math.random() * numberSet.length);

      result.push(numberSet[randomNumberIndex]);
      numberSet.splice(randomNumberIndex, 1);
    }

    return result;
  };

  parseNumberToArray = (inputNumber) => {
    return inputNumber.split("").map((numStr) => parseInt(numStr));
  };

  isNumber = (item) => {
    if (isNaN(item)) {
      return false;
    }

    return true;
  };

  isIncludeZero = (userInputNumbers) => {
    return userInputNumbers.includes(0);
  };

  isDuplicate = (userInputNumbers) => {
    const setNumbers = new Set(userInputNumbers);

    if (userInputNumbers.length !== setNumbers.size) {
      return true;
    }

    return false;
  };

  renderResult = (resultMessage) => {
    const $result = document.querySelector("#result");
    $result.textContent = resultMessage;

    if (resultMessage === "🎉 정답을 맞추셨습니다! 🎉") {
      $result.insertAdjacentHTML("beforeend", " <button id='restart'>게임 재시작</button>");
      this.bindRestartEvent();
    }
  };

  bindRestartEvent = () => {
    document.querySelector("#restart").addEventListener("click", () => {
      this.answerNumbers = this.makeAnswerNumbers();
      document.querySelector("#result").innerHTML = "";
      this.resetInput();
    });
  };

  resetInput = () => {
    document.querySelector("#user-input").value = "";
  };

  checkUserInput = (userInput) => {
    const alertMessage = "1~9까지의 수를 중복없이 3개 작성해주세요";

    if (!(userInput.length === 3 && this.isNumber(userInput))) {
      alert(alertMessage);
      this.resetInput();
      return;
    }

    const userInputNumbers = this.parseNumberToArray(userInput);

    if (this.isIncludeZero(userInputNumbers) || this.isDuplicate(userInputNumbers)) {
      alert(alertMessage);
      this.resetInput();
      return;
    }

    this.renderResult(this.play(this.answerNumbers, userInputNumbers));
  };

  bindSubmitEvent = () => {
    document
      .querySelector("#submit")
      .addEventListener("click", (e) => this.checkUserInput(document.querySelector("#user-input").value));
  };

  isCorrectAnswer = ({ computerInputNumbers, userInputNumbers }) => {
    return computerInputNumbers.every((num, index) => num === userInputNumbers[index]);
  };

  getNumOfStrike = ({ computerInputNumbers, userInputNumbers }) => {
    let numOfStrike = 0;

    computerInputNumbers.forEach((num, index) => {
      if (num === userInputNumbers[index]) {
        numOfStrike++;
      }
    });

    return numOfStrike;
  };

  getNumOfBall = ({ computerInputNumbers, userInputNumbers }) => {
    let numOfBall = 0;

    userInputNumbers.forEach((userNum, index) => {
      const numIndexInComputerInputNumbers = computerInputNumbers.findIndex((computerNum) => computerNum === userNum);

      if (numIndexInComputerInputNumbers !== -1 && index !== numIndexInComputerInputNumbers) {
        numOfBall++;
      }
    });

    return numOfBall;
  };

  play(computerInputNumbers, userInputNumbers) {
    if (this.isCorrectAnswer({ computerInputNumbers, userInputNumbers })) {
      return "🎉 정답을 맞추셨습니다! 🎉";
    }

    const numOfBall = this.getNumOfBall({ computerInputNumbers, userInputNumbers });
    const numOfStrike = this.getNumOfStrike({ computerInputNumbers, userInputNumbers });

    if (numOfBall === 0 && numOfStrike === 0) {
      return "낫싱";
    }

    return `${numOfBall > 0 ? `${numOfBall}볼 ` : ""}${numOfStrike > 0 ? `${numOfStrike}스트라이크` : ""}`;
  }
}

new BaseballGame();
