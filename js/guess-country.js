const mapContainer = document.querySelector("#mapContainer");
let countryPath;
let countryArray = [];
let svgZoom;
const viewBox = "0 0 1009.6727 665.96301";

const excludedCountries = [
  "KI", // Кирибати
  "CV", // Кабо-Верде
  "MH", // Маршалловы острова
  "NR", // Науру
  "WS", // Самоа
  "SB", // Соломоновы Острова
  "TO", // Тонга
  "TV", // Тувалу
  "KM", // Коморы
  "GD", // Гренада
  "TT", // Тринидад и Тобаго
  "VU", // Вануату
  "AG", // Антигуа и Барбуда
  "LC", // Сент-Люсия
  "KN", // Сент-Китс и Невис
  "VC", // Сент-Винсент и Гренадины
  "ST", // Сан-Томе и Принсипи
  "MU", // Маврикий
  "PW", // Палау
  "FM", // Федеративные Штаты Микронезии
  "SC", // Сейшелы
  "DM",  // Доминика 
  "VA", // Ватикан
  "LU", // Люксембург
  "MC", // Монако
  "AD", // Андорра
  "SM", // Сан-Марино
  "LI", // Лихтенштейн
  "BB", // Барбадос
  "MV", // Мальдивы
  "BS"  // Багамы
];

let life = 3;
let points = 0;
let pointsValue = document.querySelector("#pointsValue");
let livesValue = document.querySelector("#livesValue");
let randomIndex;

let gameOverBlock = document.querySelector(".country-game__board");
let countryAnswer = document.querySelector("#countryAnswer");

fetch("./assets/world-map.svg")
  .then((response) => response.text())
  .then((svgData) => {
    mapContainer.innerHTML = svgData;
    countryPath = mapContainer.querySelectorAll("path");
    svgZoom = document.querySelector("svg");

    countryArray = Array.from(countryPath).map((path) => {
      return {
        id: path.id,
        name: countryNamesRu[path.id] || path.getAttribute("title"),
        element: path
      };
    });

    newCountryArray();

    if(countryArray.length > 0) {
      startButton();
    }
  })
  
  .catch((error) => {
    console.error("Ошибка загрузки SVG-карты:", error);
  });

function newCountryArray() {
  countryArray = countryArray.filter((country) => {
    return !excludedCountries.includes(country.id);
  });
}

// Рандом индекс для подкрашивание границ страны
function guessColorCountry() {
  const randomIndexCountry = Math.floor(Math.random() * countryArray.length);
  return randomIndexCountry;
}

// Увеличение карты
function sizeCountry(randomCountrySize) {
  let countryBox = countryArray[randomCountrySize].element.getBBox();
  let areaCountry = countryBox.width * countryBox.height;

  function sizeZoom(boxX, boxY, boxWidth, boxHeight) {
    let newX;
    let newY;
    let newWidth;
    let newHeight;
    let stringCountryBox;

    newX = countryBox.x - boxX;
    newY = countryBox.y - boxY;
    newWidth = countryBox.width + boxWidth;
    newHeight = countryBox.height + boxHeight;
    stringCountryBox = newX + " " + newY + " " + newWidth + " " + newHeight;

    return stringCountryBox;
  }

  if(areaCountry < 10000 && areaCountry >= 1500) {
    svgZoom.setAttribute("viewBox", sizeZoom(60, 60, 120, 120));

    console.log("Страна большая = " + areaCountry);
  } else if(areaCountry < 1500 && areaCountry >= 800) {
    svgZoom.setAttribute("viewBox", sizeZoom(100, 100, 200, 200));

    console.log("Страна средняя = " + areaCountry);
  } else if (areaCountry < 800 && areaCountry >= 600) {
    svgZoom.setAttribute("viewBox", sizeZoom(140, 140, 280, 280));

    console.log("Страна маленькая = " + areaCountry);
  } else if(areaCountry < 600 && areaCountry >= 300) {
    svgZoom.setAttribute("viewBox", sizeZoom(180, 180, 360, 360));

    console.log("Страна очень маленькая = " + areaCountry);
  } else if(areaCountry < 300) {
    svgZoom.setAttribute("viewBox", sizeZoom(50, 50, 100, 100));

    console.log("Страна супер маленькая = " + areaCountry);
  } else {
    svgZoom.setAttribute("viewBox", viewBox);
    console.log("Страна большая = " + areaCountry);
  }
}

// Старт игры
function startButton() {
  let startButton = document.querySelector(".country-game__start-button");

  startButton.addEventListener("click", function(event) {
    let countryGameBoard = document.querySelector(".country-game__board");
    randomIndex = guessColorCountry();

    if(!document.fullscreenElement) {
      countryGameBoard.requestFullscreen().then(() => {
        countryAnswer.focus();
      });
    }

    if(life === 0) {
      life = 3;
      livesValue.textContent = life;
      points = 0;
      pointsValue.textContent = points;
    }

    for(let i = 0; i < countryArray.length; i++) {
      countryArray[i].element.style.fill = "white";
    }

    countryArray[randomIndex].element.style.fill = "#ffea00"; // тут первая подсветка страны
    
    console.log(countryArray[randomIndex].name); // тут просто распечатываем для себя
    sizeCountry(randomIndex);
    console.log("------");

    gameOverBlock.classList.remove("is-game-over");
  });
}

// Обратоботчик ввода названия страны (enter)
countryAnswer.addEventListener("keydown", function(event) {
  if(event.key === "Enter") {
    let countryAnswerFormatted = countryAnswer.value.trim().toLowerCase();
    userAnswer(countryAnswerFormatted);
    countryAnswer.value = "";
  }
});

// Обработчик ответа пользователя
function userAnswer(countryAnswer) {
  let checkFlag = false;

  if(countryAnswer === countryArray[randomIndex].name.toLowerCase()) {
      checkFlag = true;
      countryArray[randomIndex].element.style.fill = "#22c55e";
      randomIndex = guessColorCountry(); // тут вызываем новый запрос на генерацию рандом числа
      countryArray[randomIndex].element.style.fill = "#ffea00"; // тут обновляем новый запрос на подсвечивание новой страны
      
      console.log(countryArray[randomIndex].name); // тут просто распечатываем для себя
      sizeCountry(randomIndex);
      console.log("------");
    }

  if(checkFlag && life > 0) {
    points += 100;
    pointsValue.textContent = points;
  } else if(!checkFlag && life > 0) {
    life -= 1;
    livesValue.textContent = life;
    countryArray[randomIndex].element.style.fill = "#ff304f";
    if(life > 0) {
      randomIndex = guessColorCountry();
      countryArray[randomIndex].element.style.fill = "#ffea00";

      console.log(countryArray[randomIndex].name);
      sizeCountry(randomIndex);
      console.log("------");
    }
  }

  if(life === 0) {
    gameOverBlock.classList.add("is-game-over");
    svgZoom.setAttribute("viewBox", viewBox);
  }
}