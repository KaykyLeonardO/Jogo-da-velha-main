const e = element => document.querySelector(element);
const allE = allElement =>  document.querySelectorAll(allElement);

// AMBIENTS VARIABLE
let square = {
    a1: "", a2: "", a3: "",
    b1: "", b2: "", b3: "",
    c1: "", c2: "", c3: ""
};

let playerTurn = ""
let player1 = "";
let player2 = "";
let warning = "";
let player1Score = 0;
let player2Score = 0;
let playerWinner = "";
let playing = false;

//FUNCTIONS
function startGame() {
    player1 = e(".player.active").innerHTML;
    player2 = (player1.toLowerCase() === "o") ? "X" : "O";
    e(".player.first b").innerHTML = player1;
    e(".player.second b").innerHTML = player2;

    resetGame();
    player1Score = 0;
    player2Score = 0;
    e(".score--left").innerHTML = player1Score;
    e(".score--right").innerHTML = player2Score;


    e(".choosePlayer").style.opacity = 0;
    setTimeout(() => {
        e(".choosePlayer").style.display = "none";
        e(".area--game").style.display = "flex";
    }, 500);
    playing = true;
};

function resetGame(){
    const infoTurn = e(".info--turn");
    warning = "";
    playerTurn = (Math.floor(Math.random() * 2) === 0) ? player1 : player2;

    for (let i in square){
        square[i] = "";
    }
    
    playing = true;
    
    if (player1 === playerTurn) {
        warning = "☚ Sua vez"; 
        infoTurn.classList.add("blink");
    } else{
        warning = "Player 2 ☛"
        infoTurn.classList.remove("blink");
        playerB();
    }

    renderSquare();
    renderInfo();
};

function renderSquare(){
    for (let i in square){
        const item = e(`div[data-item=${i}]`)
        item.innerHTML = square[i];
    }

    checkGame();
};

function renderInfo(){
    e(".info--turn").innerHTML = warning;
};

function changePlayer(){
    e(".area--game").style.display = "none";
    e(".choosePlayer").style.display = "flex";
    e(".choosePlayer").style.opacity = 1;
    resetGame();
};

function changeTurn(){
    playerTurn = (playerTurn.toLowerCase() === "x") ? "O" : "X";
    const infoTurn = e(".info--turn");

    if ((player1 === playerTurn) && (playing)) {
        warning = "☚ Sua vez"; 
        infoTurn.classList.add("blink");
    } else if((player2 === playerTurn) && (playing)){
        warning = "Player 2 ☛"
        infoTurn.classList.remove("blink");
        setTimeout(() => {
            playerB();
        }, 1000);
    }
    renderInfo();
};

function checkGame(){
    if (checkWinnerFor(playerTurn)){
        warning = `${playerWinner}`;
        renderInfo()
        playing = false;
        setTimeout(() => {
            resetGame();
        }, 1000);
    }else if(isFull()){
        warning = "Empate";
        renderInfo()
        playing = false;
        setTimeout(() => {
            resetGame();
        }, 1000);
    }
};

function checkWinnerFor(player){
    const toWinning = [
        "a1,a2,a3",
        "b1,b2,b3",
        "c1,c2,c3",
    
        "a1,b1,c1",
        "a2,b2,c2",
        "a3,b3,c3",
    
        "a1,b2,c3",
        "c1,b2,a3"
    ];

    for (let w in toWinning){
        let wArray = toWinning[w].split(",");
        let hasWon = wArray.every(item => square[item] === player);
        if (hasWon){
            if (player === player1) {
                playerWinner = "Você venceu";
                e(".score--left").innerHTML = player1Score += 1;
            } else{
                playerWinner = "Você perdeu";
                e(".score--right").innerHTML = player2Score += 1;
            }
            return true;
        }
    }

    return false;
};

function isFull() {
    for (let i in square){
        if (square[i] === ""){
            return false;
        }
    }

    return true;
};

function playerB() {
    let keyValid = "";

    while (true){
        let keys = Object.keys(square);
        let randomIndex = Math.floor(Math.random() * keys.length);
        let randomKey = keys[randomIndex];
        let randomValue = square[randomKey];

        if (randomValue === ""){
            keyValid = randomKey;
            break
        }
    }
    square[keyValid] = player2;
    renderSquare();
    changeTurn();
    renderInfo();
};

//EVENTS
allE(".player").forEach((item) => {
    item.addEventListener("click", () => {
        if(!item.classList.contains("active")){
            e(".active").classList.remove("active");
            item.classList.add("active");
        }
    });
});

e(".startGame").addEventListener("click", startGame);

e(".changePlayer").addEventListener("click", changePlayer);

allE(".item").forEach((item) => {
    item.addEventListener("click", (event) => {
        itemElement = event.target.getAttribute("data-item");
        if((playing) && (square[itemElement] === "") && (playerTurn == player1)){
            square[itemElement] = playerTurn;
            renderSquare();
            changeTurn();
        }
    });
}); 
