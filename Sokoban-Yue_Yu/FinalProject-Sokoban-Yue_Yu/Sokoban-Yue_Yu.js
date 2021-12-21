"use strict"

function drawMap(l) { //analyse the map
    let curMap = gameMap[l];
    for (let q = 0; q < 4; q++) {
        map[keys[q]].ids = []; //initial the arrays
    }
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
            let item = curMap[i][j];
            let id = i * 12 + j;
            if (item > 0) {
                let key = keys[item - 1];
                map[key].ids.push(id);
            }
        }
    } //give each block on the canvas an id and add them into the ids arrays of the properties.
    updateMap() //draw the map according to the map analysis
}
function updateMap() {
    ctx.clearRect(0, 0, 600, 600); //clear all the items on the canvas
    for (let a = 0; a < 4; a++) {
        for (let b = 0; b < map[keys[a]].ids.length; b++) {
            if (a == 1 || a == 2) {
                drawImage(keys[a], map[keys[a]].ids[b]);
            }
            else if (a == 3) {
                drawCircle(keys[a], map[keys[a]].ids[b]);
            }
            else {
                drawRectangle(keys[a], map[keys[a]].ids[b]);
            } //draw different kinds of items in different graphs(images) with different colours on the canvas according to the ids arrays
        }
    }
}

function drawRectangle(key, id) {
    let w = 600/12, s = 2;
    let x = id%12 * w,
        y = ~~(id / 12) * w;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x+s,y+s, 46, 46);
    ctx.closePath();
    ctx.fillStyle = '#D8BFD8';
    ctx.fill();
    ctx.restore();
} //draw rectangles on canvas

function drawCircle(key, id) {
    let r = 23,
        k = 2;
    let x1 = id%12 * (600/12)+25,
        y1 = ~~(id / 12) * (600/12)+25;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x1, y1, 23, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#7B68EE';
    ctx.fill();
    ctx.restore();
} //draw circles on the canvas

function drawImage (key, id) {
    let h = 600/12, q = 2;
    let x2 = id%12 * h,
        y2 = ~~(id / 12) * h;
    var img = new Image;
    img.onload = function() {
        ctx.save();
        ctx. drawImage(img, x2+q, y2+q, 46, 46 );
        ctx.restore();
    }
    if (key == "player" && z == 0) { //redraw player's image only after the player's moveItem() function is called
        img.src = "images/player.png";
    }
    if (key == "box") {
        img.src = "images/box.png";
    }
} //draw images on the canvas, use different images for player and boxs

function moveItem(key, id, d) {
    let move = id + d; //get the id of next move
    let index = map[key].ids.indexOf(id); //get the index of the current block's id that is in the ids array
    map[key].ids[index] = move; //replace the id with the id of the next move
    if (key == 'box') { //if the key is box, update the map without redraw the player's image
        z = 1;
    }
    if (key == 'player') { //if the key is player, update the map and add 1 to the variable steps as soon as the player move to count the move.
        z = 0;
        steps++
        document.getElementById("movesteps").innerHTML = (steps);
    }
    updateMap(); //update the map after items move
}

function checkResult() {
    let m = 0;
    for (let n = 0; n < map.box.ids.length; n++) {
        if (map.goals.ids.indexOf(map.box.ids[n]) >= 0) {
            m++;
        } // campare box's ids array and goals' ids array
        else {
            return;
        }
        if (m == map.box.ids.length) {
            setTimeout("alertHint('You win!')", 500);
        } //when every element in box's ids array is in goals' ids array, that means the player has pushed all the box to the goal successfully
    } //alert 'you win!'
}

function nextLevel() {
    if (level < 3) {
        level++;
        restartLevel();
    }
    if (level == 3) {
        restartLevel();
    }
} // I set up four levels in this game
//if the level variable is less than 3 that means this level have next level, if the player click next level btn, it will switch to next level with the function restartLevel().
//if the level equals to 3 then it will just restart the same level.

function lastLevel() {
    if (level > 0) {
        level--;
        restartLevel();
    }
    if (level == 0) {
        restartLevel();
    }
} // similarly, if the level variable is larger than 1, if the player click last level btn, it will switch to last level.
//if the level is equals to 0, it will just restart the first level.

function restartLevel() {
    drawMap(level); //to restart the level, draw the map again
    steps = 0; //clear the move in the move counter
    document.getElementById("movesteps").innerHTML = (steps);
    document.getElementById('levelnum').innerHTML = (level+1); //update the level number
} // (this is actually set up for the function next and lastLevel since they've called the function restartLevel())

function alertHint(msg) { //write a hint popup window
    var bgHtml ="<div class='background'></div>";
    var msgAlertHtml = "<div class='msgalertWrap'>" +
        "<div class='msgalert'>" +
        "<div class='header'><button onclick='nextLevel()' class='dismiss'><span>x</span></button></div>" +
        "<div class='body'>" +
        "<div class='content'></div>" +
        "</div>" +
        "<div class='footer'>" +
        "<button type='button' onclick='nextLevel()' class='okbtn'>ok</button>" +
        "</div>" +
        "</div>"+
        "</div>"; //put the divs and buttons into variables
    if ($(".background").length == 0) {
        $("body").append(bgHtml + msgAlertHtml);
    }
    else {
        $("body").append(msgAlertHtml);
    } //append the background and the alertwrap

    $(".msgalertWrap:last-child .content").html(msg); //display the message

    $(".okbtn,.dismiss").on("click", function () {
        $(this).parents(".msgalertWrap").remove();
        if ($(".msgalertWrap").length == 0) {
            $(".background").remove();
        }
    }) //when click 'ok' and 'x' button, clear the alertwrap
}

var gameMap=[]; //set up game map arrays
gameMap[0]=[
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,4,1,0,0,0,0,0],
    [0,0,0,0,1,0,1,1,1,1,0,0],
    [0,0,1,1,1,3,0,3,4,1,0,0],
    [0,0,1,4,0,3,2,1,1,1,0,0],
    [0,0,1,1,1,1,3,1,0,0,0,0],
    [0,0,0,0,0,1,4,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]];

gameMap[1]=[
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,1,2,0,0,1,0,0,0,0,0],
    [0,0,1,0,3,3,1,0,1,1,1,0],
    [0,0,1,0,3,0,1,0,1,4,1,0],
    [0,0,1,1,1,0,1,1,1,4,1,0],
    [0,0,0,1,1,0,0,0,0,4,1,0],
    [0,0,0,1,0,0,0,1,0,0,1,0],
    [0,0,0,1,0,0,0,1,1,1,1,0],
    [0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]];

gameMap[2]=[
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,0,0,0,0,0,1,1,1,0],
    [0,1,1,3,1,1,1,0,0,0,1,0],
    [0,1,0,2,0,3,0,0,3,0,1,0],
    [0,1,0,4,4,1,0,3,0,1,1,0],
    [0,1,1,4,4,1,0,0,0,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]];

gameMap[3]=[
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,2,0,1,1,1,0,0,0],
    [0,0,0,1,0,3,0,0,1,0,0,0],
    [0,0,1,1,1,0,1,0,1,1,0,0],
    [0,0,1,4,1,0,1,0,0,1,0,0],
    [0,0,1,4,3,0,0,1,0,1,0,0],
    [0,0,1,4,0,0,0,3,0,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]];

var c = document.getElementById('mycanvas'); //get the canvas element
var ctx = c.getContext('2d'); //select a context
var level = 0;
var steps = 0;
var z = 0;
document.getElementById('levelnum').innerHTML = (level+1); //show current level
var map = {
    wall:{ids:[],},
    player:{ids:[],},
    box:{ids:[],},
    goals:{ids:[] },
} //set up object map
var keys = ["wall", "player", "box", "goals"]; //set up an array for the properties
drawMap(level); //analyse and draw the map

document.addEventListener('keydown', function() {  //set up the keyboard event
    let keyCode=event.keyCode
    if([27,37,38,39,40].indexOf(event.keyCode) >= 0){ //make sure that only direction keys work in the game
        let d = [-1, -12, 1, 12][keyCode - 37]; //set up the direction array and connect the key with the value
        let player = map.player.ids[0]; //give the player variable the id's value of the player block
        let nextMove = player + d; //calculate the id of the next move
        if (map.wall.ids.indexOf(nextMove) >= 0) {
            return;

        } //if next move is the wall, return.
        if (map.box.ids.indexOf(nextMove) >= 0) {
            let box = nextMove;
            let boxNext = box + d;
            if (map.wall.ids.indexOf(boxNext) >= 0 || map.box.ids.indexOf(boxNext) >= 0) {
                return;

            } //if the next move is a box, see the box's next move, if it's a box or wall, return.
            else {
                moveItem('box', box, d);
            } //if the next move of the box is the road, then move the box
            checkResult(); //once the box move, check the result
        }
        moveItem('player', player, d); //move the player


    }
});