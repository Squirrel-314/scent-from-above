class Player {
   PLAYER_MOVE_SPEED = 4.5;
   constructor(name) {
      this.name = name;
      this.startX;
      this.startY;
      this.x;
      this.y;
      this.keys;
      this.keyHeld_North = false;
      this.keyHeld_East = false;
      this.keyHeld_South = false;
      this.keyHeld_West = false;
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
         if (roomGrid[i] == TILE_CODE_PLAYER) {
           var row = Math.floor(i / ROOM_COLS);
           var col = i % ROOM_COLS;
           this.startX = TILE_W * (col + 0.5);
           this.startY = TILE_H * (row + 0.5);
           roomGrid[i] = TILE_CODE_GROUND;
           break;
         }
       }
     }
     this.x = this.startX;
     this.y = this.startY;
     this.keys = 0;
   }

   move() {
     var nextX = this.x;
     var nextY = this.y;

     if (this.keyHeld_North) { nextY -= this.PLAYER_MOVE_SPEED; }
     if (this.keyHeld_East) { nextX += this.PLAYER_MOVE_SPEED; }
     if (this.keyHeld_South) { nextY += this.PLAYER_MOVE_SPEED; }
     if (this.keyHeld_West) { nextX -= this.PLAYER_MOVE_SPEED; }

     var nextTileIndex = getTileIndexAtPixelCoordinates(nextX, nextY);
     var nextTileCode = TILE_CODE_WALL;

     if (nextTileIndex !== undefined) {
       nextTileCode = roomGrid[nextTileIndex];
     }

     switch (nextTileCode) {
       case TILE_CODE_GROUND:
         this.x = nextX;
         this.y = nextY;
         break;
       case TILE_CODE_CHEST:
         this.reset();
         break;
       case TILE_CODE_KEY:
         this.keys++;
         roomGrid[nextTileIndex] = TILE_CODE_GROUND;
         break;
       case TILE_CODE_DOOR:
         if (this.keys > 0) {
           this.keys--;
           roomGrid[nextTileIndex] = TILE_CODE_GROUND;
         }
         break;
       case TILE_CODE_WALL:
       default:
         break;
     }
   }

   draw() {
     drawImageCentered(this.imgSprite, this.x, this.y);
   }
 }

let canvas;
let canvasContext;
let player = new Player("Player");

const FPS = 50;

window.onload = function() {
   canvas = document.getElementById('gameCanvas');
   canvasContext = canvas.getContext('2d');
   this.initInput();
   this.loadImages();
   canvas.addEventListener('mousedown', handleMouseClick);
}

function handleMouseClick(e) { player.reset(); }
function animate() { player.move(); }

function launchIfReady() {
   if (imagesToLoad === 0) {
      setInterval(function() {
         animate();
         draw();
      }, 1000/FPS);
      player.init(playerPic);
   }
}


function draw() {
   drawRectangle(0,0,canvas.width,canvas.height,'black');
   drawRoom();
   player.draw();
   document.getElementById("playerKeysLabel").innerHTML = player.keys;
}

function initInput() {
   document.addEventListener('keydown', () => { setKeyHoldState(event.keyCode, true); event.preventDefault(); });
   document.addEventListener('keyup', () => { setKeyHoldState(event.keyCode, false); });
   player.setupControls(38, 39, 40, 37);
}

function setKeyHoldState(keyCode, isPressed) {
   if (keyCode === player.controlKeyNorth) { player.keyHeld_North = isPressed; }
   else if (keyCode === player.controlKeyEast) { player.keyHeld_East = isPressed; }
   else if (keyCode === player.controlKeySouth) { player.keyHeld_South = isPressed; }
   else if (keyCode === player.controlKeyWest) { player.keyHeld_West = isPressed; }
}

var playerPic = new Image();
var tilePics = [];

var imagesToLoad = 0;

function loadImageForTileCode(tileCode, fileName) {
   tilePics[tileCode] = new Image();
   beginLoadingImage(tilePics[tileCode], fileName);
}

function loadImages() {
   var imageList = [
      { imgNode: playerPic, fileName: "chef-hat.svg"},
      { tileCode: TILE_CODE_WALL, fileName: "wooden-countertop.svg"},
      { tileCode: TILE_CODE_GROUND, fileName: "floor.svg"},
      { tileCode: TILE_CODE_CHEST, fileName: "table.svg"},
      { tileCode: TILE_CODE_DOOR, fileName: "sink.svg"},
      { tileCode: TILE_CODE_KEY, fileName: "sponge.svg"}
   ];
   imagesToLoad = imageList.length;
   for (img of imageList) {
     if (img.tileCode !== undefined) { loadImageForTileCode(img.tileCode, img.fileName); }
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
   canvasContext.drawImage(graphic,-width/2,-height/2, width, height);
   canvasContext.restore();
 }

const TILE_W = 50;
const TILE_H = 50;

const TILE_CODE_GROUND = 0;
const TILE_CODE_WALL = 1;
const TILE_CODE_PLAYER = 2;
const TILE_CODE_CHEST = 3;
const TILE_CODE_DOOR = 4;
const TILE_CODE_KEY = 5;

const ROOM_COLS = 18;
const ROOM_ROWS = 12;

let roomGrid =
   [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
   1, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1,
   1, 1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1,
   1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1,
   1, 0, 3, 0, 1, 1, 0, 1, 5, 0, 1, 4, 1, 0, 0, 1, 5, 1,
   1, 0, 0, 0, 1, 5, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1,
   1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
   1, 0, 0, 0, 1, 5, 0, 0, 0, 0, 0, 0, 0, 1, 0, 5, 0, 1,
   1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 5, 1,
   1, 1, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
   1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

   function tileGridCoordinatesToIndex(row, col) {
     return col + ROOM_COLS * row;
   }

   function getTileIndexAtPixelCoordinates(x, y) {
     var col = Math.floor(x/TILE_W);
     var row = Math.floor(y/TILE_H);

     if (col < 0 || col >= ROOM_COLS || row < 0 || row >= ROOM_ROWS) { return undefined; }

     var tileIndex = tileGridCoordinatesToIndex(row, col);
     return tileIndex;
   }

   function tileTypeHasTransparency(tileType) {
     return (tileType === TILE_CODE_KEY || tileType === TILE_CODE_CHEST || tileType === TILE_CODE_DOOR);
   }

   function drawRoom()   {
     var tileIndex = 0;
     var tileX;
     var tileY = 0.5*TILE_H;
     var tileType;

     for (var i=0;   i<ROOM_ROWS;   i++) {
       tileX = 0.5*TILE_W;
       for (var j=0;   j<ROOM_COLS;   j++) {
         tileType = roomGrid[tileIndex];
         if (tileTypeHasTransparency(tileType)) {
           drawImageCenteredAtLocationWithScaling(tilePics[TILE_CODE_GROUND], tileX,   tileY, TILE_W, TILE_H);
         }
         drawImageCenteredAtLocationWithScaling(tilePics[tileType], tileX,   tileY, TILE_W, TILE_H);

         tileIndex++;
         tileX += TILE_W;
       }
       tileY += TILE_H;
     }
   }
