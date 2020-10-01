var startButton = document.getElementById('startButton');
var mineRemainder = document.getElementById('mineRemainder');
var mineField = document.getElementById('mineField');
var alertBox = document.getElementById('alertBox');
var alertImage = document.getElementById('alertImage');
var close = document.getElementById('close');
var mineNumber;
var minesLeft = document.getElementById('minesLeft');
var mineLeft;
var block; // each block contains one mine or not 
var mineMap = [];
var switchStartGame = true; // set lock to avoid more than one set of mine field added after pressing start button 

bindEvent();
// part one --- UI and Bind Event 
function bindEvent () {
    startButton.onclick = function () {
        if (switchStartGame) {
            mineRemainder.style.display = 'block';
            mineField.style.display = 'block';
            init();
            switchStartGame = false;
        }
    }
    // rightclick only applied to set red flag
    mineField.oncontextmenu = function () {
        return false;
    } 
    mineField.onmousedown = function (e) {
        var event = e.target;
        if (e.which == 1) {
            leftClick(event); // check if mine exist by left click 
        } else if (e.which == 3) {
            rightClick(event); // set or unset red flag by right click
        }
    }
    close.onclick = function () {
        mineRemainder.style.display = 'none';
        mineField.style.display = 'none';
        alertBox.style.display = 'none';
        // Remember to clean all inner HTML elements in the mine field
        mineField.innerHTML = '';
        switchStartGame = true; // set switch back to true 
    }
}

// part two, refresh or init game 
function init() { // set mines
    mineNumber = 10; // total mine number 
    mineLeft = 10; // number of mine hasn't been check
    minesLeft.innerHTML = mineLeft;

    // setup mines and mine field, which is 10x10 here
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var box = document.createElement('div'); // box's type is div
            box.classList.add('block'); // box is a div element and added into block Class list
            box.setAttribute('id', i + '-' + j); // set id for each box out of 100 
            mineField.appendChild(box); // add box (div) into mineFeild
            mineMap.push({mine:0});
        }
    }

    block = document.getElementsByClassName('block'); // get block of mine, block has same type as box 

    while(mineNumber) {
        var mineIndex = Math.floor(Math.random()*100); // generate random number for index
        if (mineMap[mineIndex].mine === 0) {
            mineMap[mineIndex].mine = 1;
            block[mineIndex].classList.add('isMine'); // add this block to the isMine Class
            mineNumber--;
        }
    }
}

function leftClick (dom) {
    if (dom.classList.contains('flag')) { // at very beginning, if flag is set, no number is allowed
        return;
    }
    var mineList = document.getElementsByClassName('isMine'); // get a mineList array
    if (dom && dom.classList.contains('isMine')) { // lose the game
        console.log('Game Over');
        for (var i = 0; i < mineList.length; i++) {
            mineList[i].classList.add('showAllMines'); // add a new class name "showAllMines" to mineList to show "CSS style". 
        }
        setTimeout(function() {
            alertBox.style.display='block';
            alertImage.style.backgroundImage = 'url("Image/game-over-white-red-b.png")';
        },750);
    } else { 
        // else if no mine is clicked, then the box will be expanded 
        // first, locate box's position by id, split -, get x and y
        // based on current x and y, check 8 other mines around
        var n = 0;

        var positionArray = dom && dom.getAttribute('id').split('-');
        var posX = positionArray && +positionArray[0];
        var posY = positionArray && +positionArray[1];
        dom && dom.classList.add('num'); // add classname num, create num on css and shows number of surround numbers

        for (var i = posX - 1; i <= posX+1; i++) {
            for (var j = posY - 1; j <= posY + 1; j++) {
                var boxAround = document.getElementById(i + '-' + j);
                if (boxAround && boxAround.classList.contains('isMine')) {
                    n++;
                }         
            }
        }
        dom && (dom.innerHTML = n);   
        // a special case: if n = 0, generate this box, where n = 0
        if (n == 0) {
            for (var i = posX - 1; i <= posX+1; i++) {
                for (var j = posY - 1; j <= posY + 1; j++) {
                    var boxAroundZero = document.getElementById(i + '-' + j); 
                    if (boxAroundZero && boxAroundZero.length != 0) {
                        if (!boxAroundZero.classList.contains('checked')) {
                            boxAroundZero.classList.add("checked"); // box is checked to see if contains mine 
                            leftClick(boxAroundZero);
                        }
                    } 
                }
            }
        }
    }
}

function rightClick (dom) {
    // case 1, if number is checked, no flag needed or can be set
    if (dom.classList.contains('num')) {
        return;
    }
    dom.classList.toggle('flag'); // toggle used to switch flag on and off
    // if flag is set correct, mine left should be decreased by 1
    if (dom.classList.contains('isMine') && dom.classList.contains('flag')){
        mineLeft--;
    }
    if (dom.classList.contains('isMine') && !dom.classList.contains('flag')){
        mineLeft++;
    }
    minesLeft.innerHTML = mineLeft;
    if (mineLeft == 0) {
        alertBox.style.display = 'block';
        alertImage.style.backgroundImage = 'url("Image/congratulations.gif")';
    }
}
