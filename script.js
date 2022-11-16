"use strict";

import {
  checkLose,
  checkWin,
  createBoard,
  listMinesLeft,
  markTile,
  revealTile,
  TILE_STATUSES,
} from "./minesweeper.js";

const btnElem = document.querySelector(".btn");
const bgElem = document.querySelector(".body");

let BOARD_SIZE;
let NUMBER_OF_MINES;

document.querySelector(".check").addEventListener("click", () => {
  BOARD_SIZE = parseInt(document.querySelector(".rows").value);
  console.log(BOARD_SIZE);
  if (BOARD_SIZE >= 4 && BOARD_SIZE <= 10) {
    NUMBER_OF_MINES = Math.floor(BOARD_SIZE ** 2 * 0.2);
    game(BOARD_SIZE, NUMBER_OF_MINES);
  } else {
    alert("Must be greater than 4 and less than 20");
  }
});

function game(BOARD_SIZE, NUMBER_OF_MINES) {
  bgElem.style.backgroundImage =
    "url(Images/bg/bg_" + Math.floor(Math.random() * 6) + ".png)";
  btnElem.classList.add("hide");
  const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
  const minesLeftText = document.querySelector("[data-mine-count");
  const messageText = document.querySelector(".subtext");
  const boardElement = document.querySelector(".board");

  const minutesLabel = document.getElementById("minutes");
  const secondsLabel = document.getElementById("seconds");
  let totalSeconds = 0;
  let min = 0;
  let sec = 0;
  setInterval(setTime, 1000);

  function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = sec = pad(totalSeconds % 60);
    minutesLabel.innerHTML = min = pad(parseInt(totalSeconds / 60));
  }

  function pad(val) {
    const valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

  messageText.classList.remove("hide");
  boardElement.classList.remove("hide");

  minesLeftText.textContent = NUMBER_OF_MINES;

  boardElement.style.setProperty("--size", BOARD_SIZE);
  board.forEach((row) => {
    row.forEach((tile) => {
      boardElement.append(tile.element);
      tile.element.addEventListener("click", () => {
        revealTile(board, tile);
        checkGameEnd();
      });
      tile.element.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        markTile(tile);
        minesLeftText.textContent = listMinesLeft(board, NUMBER_OF_MINES);
      });
    });
  });

  function checkGameEnd() {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
      boardElement.addEventListener("click", stopProp, { capture: true });
      boardElement.addEventListener("contextmenu", stopProp, { capture: true });
    }

    if (win) {
      messageText.textContent = `You Win!!  Time Spent: ${min + ":" + sec}`;
    }
    if (lose) {
      messageText.textContent = "You Lose";
      board.forEach((row) => {
        row.forEach((tile) => {
          if (tile.status === TILE_STATUSES.MARKED && tile.mine) markTile(tile);
          if (tile.mine) revealTile(board, tile);
        });
      });
    }
  }

  function stopProp(e) {
    window.location.reload();
    e.stopImmediatePropagation();
  }
}
