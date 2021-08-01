// Create plates
// Create cuttng board
// Take time for cutting
// Dishs get dirty, take time washing
// Customers, order, give customers order, get back dirty dishes
// If on conveyor belt, move
// Allow multiple potatoes (potato class?)
// while {} player is at countertop and there is potato add time to finish and move loading bar

class Player {
   PLAYER_MOVE_SPEED = 4.5;
   constructor(name) {
      this.name = name;
      this.startX;
      this.startY;
      this.x;
      this.y;
      this.keyHeld_North = false;
      this.keyHeld_East = false;
      this.keyHeld_South = false;
      this.keyHeld_West = false;
      this.handsFull = false;
      this.hasPotato = false;
   }
   init(img) {
      this.imgSprite = img;
      this.reset();
   }
   setupControls(northKey, eastKey, southKey, westKey) {
      this.controlKeyNorth = northKey;
      this.controlKeyEast = eastKey;
      this.controlKeySouth = southKey;
      this.controlKeyWest = westKey;
   }
   reset() {
      if (this.startX === undefined) {
         for (var i = 0; i < roomGrid.length; i++) {
            if (roomGrid[i] == TILE_CODE_CHEF) {
               var row = Math.floor(i / ROOM_COLS);
               var col = i % ROOM_COLS;
               this.startX = TILE_W * (col + 0.5);
               this.startY = TILE_H * (row + 0.5);
               roomGrid[i] = TILE_CODE_FLOOR;
               this.handsFull = false;
               break;
            }
         }
      }
      this.x = this.startX;
      this.y = this.startY;
   }
   move() {
      var nextX = this.x;
      var nextY = this.y;
      if (this.keyHeld_North) { nextY -= this.PLAYER_MOVE_SPEED; }
      if (this.keyHeld_East) { nextX += this.PLAYER_MOVE_SPEED; }
      if (this.keyHeld_South) { nextY += this.PLAYER_MOVE_SPEED; }
      if (this.keyHeld_West) { nextX -= this.PLAYER_MOVE_SPEED; }
      var nextTileIndex = getTileIndexAtPixelCoordinates(nextX, nextY);
      var nextTileCode = TILE_CODE_COUNTERTOP;
      if (nextTileIndex !== undefined) { nextTileCode = roomGrid[nextTileIndex]; }
      switch (nextTileCode) {
         case TILE_CODE_POTATO:
         document.onkeyup = (e) => {
            e = e || window.event;
            var key = e.which || e.keyCode;
            if (key === 32 && this.handsFull === false){
               this.hasPotato = true;
               this.handsFull = true;
               if (potatoIsOn === TILE_CODE_COUNTERTOP) { roomGrid[nextTileIndex] = TILE_CODE_COUNTERTOP; }
               if (potatoIsOn === TILE_CODE_CONV_LEFT) { roomGrid[nextTileIndex] = TILE_CODE_CONV_LEFT; }
               if (potatoIsOn === TILE_CODE_CONV_RIGHT) { roomGrid[nextTileIndex] = TILE_CODE_CONV_RIGHT; }
               if (potatoIsOn === TILE_CODE_CUTTING_BOARD) { roomGrid[nextTileIndex] = TILE_CODE_CUTTING_BOARD; }
            }
         }
         break;
         case TILE_CODE_FLOOR:
         this.x = nextX;
         this.y = nextY;
         break;
         case TILE_CODE_COUNTERTOP:
         document.onkeyup = (e) => {
            e = e || window.event;
            var key = e.which || e.keyCode;
            if (key === 32 && this.hasPotato === true){
               this.hasPotato = false;
               this.handsFull = false;
               potatoIsOn = TILE_CODE_COUNTERTOP;
               roomGrid[nextTileIndex] = TILE_CODE_POTATO;
            }
         }
         break;
         case TILE_CODE_CONV_LEFT:
         document.onkeyup = (e) => {
            if (nextTileCode === TILE_CODE_CONV_LEFT) {
               e = e || window.event;
               var key = e.which || e.keyCode;
               if (key === 32 && this.hasPotato === true){
                  this.hasPotato = false;
                  this.handsFull = false;
                  potatoIsOn = TILE_CODE_CONV_LEFT;
                  roomGrid[nextTileIndex] = TILE_CODE_POTATO;
               }
            }
         }
         break;
         case TILE_CODE_CONV_RIGHT:
         document.onkeyup = (e) => {
            e = e || window.event;
            var key = e.which || e.keyCode;
            if (key === 32 && this.hasPotato === true){
               this.hasPotato = false;
               this.handsFull = false;
               potatoIsOn = TILE_CODE_CONV_RIGHT;
               roomGrid[nextTileIndex] = TILE_CODE_POTATO;
            }
         }
         break;
         case TILE_CODE_CUTTING_BOARD:
         document.onkeyup = (e) => {
            e = e || window.event;
            var key = e.which || e.keyCode;
            if (key === 32 && this.hasPotato === true){
               this.hasPotato = false;
               this.handsFull = false;
               potatoIsOn = TILE_CODE_CUTTING_BOARD;
               roomGrid[nextTileIndex] = TILE_CODE_POTATO;
            }
         }
         break;
         default:
         break;
      }
   }
   draw() { drawImageCentered(this.imgSprite, this.x, this.y); }
}
class Potato {
   constructor(name) {
      this.name = name;
      this.isCut = false;
      this.isCooked = false;
      this.isOn = TILE_CODE_COUNTERTOP;
   }
}

// Varibles
let canvas;
let canvasContext;
let playerPic = new Image();
let tilePics = [];
let imagesToLoad = 0;
const playerOne = new Player("Chef One");
const playerTwo = new Player("Chef Two");
const FPS = 50;

const TILE_CODE_FLOOR = 0;
const TILE_CODE_COUNTERTOP = 1;
const TILE_CODE_CHEF = 2;
const TILE_CODE_CONV_LEFT = 3;
const TILE_CODE_CONV_RIGHT = 4;
const TILE_CODE_POTATO = 5;
const TILE_CODE_CUTTING_BOARD = 6;

const TILE_W = 50;
const TILE_H = 50;
const ROOM_COLS = 18;
const ROOM_ROWS = 12;

let potatoIsOn = TILE_CODE_COUNTERTOP;
let potatoIsCut = false;
let potatoIsCooked = false;
let potatoCutTime = 5000;
let potatoCookTime = 8000;

let roomGrid =
  [1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 6, 6, 1, 1, 1,
   1, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
   1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
   1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
   1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
   1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
   5, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
   1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
   1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
   1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
   1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 1,
   1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1];

//Set up canvas
window.onload = function() {
   canvas = document.getElementById('gameCanvas');
   canvasContext = canvas.getContext('2d');
   this.initInput();
   this.loadImages();
   canvas.addEventListener('mousedown', handleMouseClick);
}

// Move Player
function initInput() {
   document.addEventListener('keydown', () => { setKeyHoldState(event.keyCode, true); event.preventDefault(); });
   document.addEventListener('keyup', () => { setKeyHoldState(event.keyCode, false); });
   playerOne.setupControls(38, 39, 40, 37);
   playerTwo.setupControls(87, 68, 83, 65);
}
function setKeyHoldState(keyCode, isPressed) {
   if (keyCode === playerOne.controlKeyNorth) { playerOne.keyHeld_North = isPressed; }
   else if (keyCode === playerOne.controlKeyEast) { playerOne.keyHeld_East = isPressed; }
   else if (keyCode === playerOne.controlKeySouth) { playerOne.keyHeld_South = isPressed; }
   else if (keyCode === playerOne.controlKeyWest) { playerOne.keyHeld_West = isPressed; }
   if (keyCode === playerTwo.controlKeyNorth) { playerTwo.keyHeld_North = isPressed; }
   else if (keyCode === playerTwo.controlKeyEast) { playerTwo.keyHeld_East = isPressed; }
   else if (keyCode === playerTwo.controlKeySouth) { playerTwo.keyHeld_South = isPressed; }
   else if (keyCode === playerTwo.controlKeyWest) { playerTwo.keyHeld_West = isPressed; }

}

// Other
function handleMouseClick(e) { playerOne.reset(); playerTwo.reset(); }
function animate() { playerOne.move(); playerTwo.move(); }

function launchIfReady() {
   if (imagesToLoad === 0) {
      setInterval(function() {
         animate();
         draw();
      }, 1000 / FPS);
      playerOne.init(playerPic);
      playerTwo.init(playerPic);
   }
}

function loadImages() {
   var imageList = [
      { imgNode: playerPic, fileName: "chef-hat.svg"},
      { tileCode: TILE_CODE_COUNTERTOP, fileName: "wooden-countertop.svg"},
      { tileCode: TILE_CODE_FLOOR, fileName: "floor.svg"},
      { tileCode: TILE_CODE_CONV_LEFT, fileName: "conv-belt-left.svg"},
      { tileCode: TILE_CODE_CONV_RIGHT, fileName: "conv-belt-right.svg"},
      { tileCode: TILE_CODE_POTATO, fileName: "potato.svg"},
      { tileCode: TILE_CODE_CUTTING_BOARD, fileName: "cutting-board.svg"}
   ];
   imagesToLoad = imageList.length;
   for (img of imageList) {
     if (img.tileCode !== undefined) {
        tilePics[img.tileCode] = new Image();
        beginLoadingImage(tilePics[img.tileCode], img.fileName);
     }
     else { beginLoadingImage(img.imgNode, img.fileName); }
   }
 }
function beginLoadingImage(imgNode, fileName) {
   imgNode.src = "Images/" + fileName;
   imgNode.onload = () => { imagesToLoad--; this.launchIfReady(); }
}

function drawRectangle(leftX, topY, width, height, drawColor) {
   canvasContext.fillStyle = drawColor;
   canvasContext.fillRect(leftX,topY,width,height);
}
function drawCircle(centerX, centerY, radius, color) {
   canvasContext.fillStyle = color;
   canvasContext.beginPath();
   canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true)
   canvasContext.fill();
}
function drawImageCentered (graphic, x, y) {
   canvasContext.save();
   canvasContext.translate(x,y);
   canvasContext.drawImage(graphic,-graphic.width/2,-graphic.height/2);
   canvasContext.restore();
}
function drawImageCenteredAtLocationWithScaling (graphic, x, y, width, height) {
   canvasContext.save();
   canvasContext.translate(x,y);
   canvasContext.drawImage(graphic, -width / 2, -height / 2, width, height);
   canvasContext.restore();
}

function getTileIndexAtPixelCoordinates(x, y) {
   var col = Math.floor(x / TILE_W);
   var row = Math.floor(y / TILE_H);
   if (col < 0 || col >= ROOM_COLS || row < 0 || row >= ROOM_ROWS) { return undefined; }
   var tileIndex = col + ROOM_COLS * row;
   return tileIndex;
}

// Create or Update Room
function draw() {
   drawRoom();
   playerOne.draw();
   playerTwo.draw();
}
function drawRoom() {
   var tileIndex = 0;
   var tileX;
   var tileY = 0.5 * TILE_H;
   var tileType;

   for (var i = 0; i < ROOM_ROWS; i++) {
      tileX = 0.5 * TILE_W;
      for (var j = 0; j < ROOM_COLS; j++) {
         tileType = roomGrid[tileIndex];
         if (tileType === TILE_CODE_POTATO) {
            if (potatoIsOn === TILE_CODE_COUNTERTOP) {
               drawImageCenteredAtLocationWithScaling(tilePics[TILE_CODE_COUNTERTOP], tileX, tileY, TILE_W, TILE_H);
            }
            if (potatoIsOn === TILE_CODE_CONV_LEFT) {
               drawImageCenteredAtLocationWithScaling(tilePics[TILE_CODE_CONV_LEFT], tileX, tileY, TILE_W, TILE_H);
               if (roomGrid[tileIndex - 1] === TILE_CODE_CONV_LEFT) {
                  roomGrid[tileIndex - 1] = TILE_CODE_POTATO;
                  roomGrid[tileIndex] = TILE_CODE_CONV_LEFT;

               }
            }
            if (potatoIsOn === TILE_CODE_CONV_RIGHT) {
               drawImageCenteredAtLocationWithScaling(tilePics[TILE_CODE_CONV_RIGHT], tileX, tileY, TILE_W, TILE_H);
               if (roomGrid[tileIndex + 1] === TILE_CODE_CONV_RIGHT) {
                  roomGrid[tileIndex + 1] = TILE_CODE_POTATO;
                  roomGrid[tileIndex] = TILE_CODE_CONV_RIGHT;
               }
            }
         }
         drawImageCenteredAtLocationWithScaling(tilePics[tileType], tileX, tileY, TILE_W, TILE_H);
         tileIndex++;
         tileX += TILE_W;
      }
      tileY += TILE_H;
   }
   var context = canvasContext;
   var al = 0;
   var start = 4.72;
   var cw = context.canvas.width / 2;
   var ch = context.canvas.height / 2;
   var diff;
   function progressBar() {
      diff = (al / 100) * Math.PI * 2;
      context.beginPath();
      context.arc(cw, ch, 50, 0, 2 * Math.PI, false);
      context.fillStyle = "transparent";
      context.fill();
      context.strokeStyle = "#99ff99";
      context.stroke();
      context.fillStyle = "#000";
      context.strokeStyle = "#004d00";
      context.textAlign = "center";
      context.lineWidth = 15;
      context.beginPath();
      context.arc(cw, ch, 50, start, diff + start, false);
      context.stroke();
      context.fillText(al + "%", cw + 2, ch + 6);
      if (al >= 97) { clearInterval(bar); }
      al++;
   }
   // var bar = setInterval(progressBar, 50);
}







/*
11    11
11    11   1111111    11111111 11  11       11  1111111  11 111111
11111111  11     11  11      1111   11     11  11     11 1111    111
11    11  11111111      11111111     11   11   11111111  111     111
11    11  11         11      111      11 11    11        11      111
11    11   1111111     1111111 11      111      1111111  11      111
Scent
*/
