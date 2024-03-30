const messageDiv = document.querySelector("#message");
let currentRow = 0;
let currentChar = 0;
let currentWord = "";
let correctWord = "";
let charCount = {};
let gameFinished = false;
fetch("https://words.dev-apis.com/word-of-the-day")
  .then((response) => {
    return response.json();
  })
  .then((resObject) => {
    correctWord = resObject.word;
    charCount = giveCharCount(correctWord);
  });

document.addEventListener("keydown", async (e) => {
  // eger apiden kelime gelmediyse hicbir sey yapma
  if (correctWord.length !== 5) return;
  const allChars = document
    .querySelector(`.row-${currentRow}`)
    .querySelectorAll("div");
  if (isLetter(e.key) && !gameFinished) {
    if (currentWord.length === 5) return;
    allChars[currentChar].textContent = e.key.toUpperCase();
    currentWord += e.key;
    currentChar++;
  }
  if (e.key === "Backspace") {
    if (allChars[currentChar - 1]) {
      allChars[currentChar - 1].textContent = "";
      currentWord = currentWord.slice(0, -1);
      currentChar--;
    }
  }
  if (e.key === "Enter" && currentWord.length === 5) {
    console.log(e.key);
    // girilen kelime gecerli mi kontrol et!
    const response = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({
        word: currentWord,
      }),
    });
    const resObject = await response.json();
    let valid = resObject.validWord;
    if (!valid) {
      messageDiv.textContent = "GECERSIZ KELIME GIRDINIZ!";
      messageDiv.style.color = "red";

      setTimeout(() => {
        messageDiv.textContent = "";
      }, 700);

      return;
    }
    // kontroller baslasin
    const strArray = Array.from(currentWord);
    strArray.forEach((userChar, i) => {
      const correctChar = correctWord[i];
      // eger kullanicinin karakteri hem dogru cevabin icindeyse hem de dogru pozisyondays
      if (userChar === correctChar) {
        allChars[i].style.backgroundColor = "green";
        allChars[i].style.color = "white";
        return;
      }

      // eger kullanicinin karakteri dogru cevabin icinde varsa ama pozisyonu yanlissa
      if (correctWord.includes(userChar)) {
        if (charCount[userChar] !== 0) {
          allChars[i].style.backgroundColor = "yellow";
          allChars[i].style.color = "black";
          charCount[userChar]--;
        } else {
          allChars[i].style.backgroundColor = "gray";
          allChars[i].style.color = "white";
        }
        return;
      }

      allChars[i].style.backgroundColor = "gray";
      allChars[i].style.color = "white";
    });
    if (currentRow + 1 === 6) {
      gameFinished = true;
    }
    if (currentWord === correctWord) {
      console.log("KAZANDINIZ CALISIYOR");
      console.log(e.key);
      gameFinished = true;
      messageDiv.style.color = "green";
      messageDiv.textContent = "TEBRIKLER KAZANDIN 🚀";
    }
    currentRow++;
    currentChar = 0;
    currentWord = "";
  }
});

function isLetter(str) {
  if (str.length !== 1) return false;
  let regex = /^[a-zA-Z]+$/;
  return regex.test(str);
}

function giveCharCount(string) {
  const chars = Array.from(string);
  const result = {};
  chars.forEach((char) => {
    if (result[char]) {
      result[char]++;
    } else {
      result[char] = 1;
    }
  });
  return result;
}
