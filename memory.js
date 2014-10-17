/*------------------------------------------------------------------*
 * File: 		memory.js
 * Author: 		Agapito Cruz (agapito.cruz@gmail.com)
 * Contents: 	Simple memory game involving hiding and revealing
 * 				colored tiles until all matching pairs are found
 * Comments:	This file was written to demonstrate proficiency
 * 				in the Javascript language and in the use of 
 * 				various techniques and design patterns common
 * 				in web app construction.
 * 				This is one of three files needed to play the
 * 				game. The other three are: memory.html and
 * 				memory.css.
 * Note:		This file constains Javascript and jQuery.
 * 				The game was tested in Firefox 31,  IE 11, 
 * 				Chrome 38.0.2125.101, Safari Version 7.1.
 *
 -------------------------------------------------------------------*/
"use strict";
var memoryGame = (function() {
		 var 	timerHandle =null, firstTile = null,
				secondTile = null,  pairsFound = 0,  seconds = 0;

/*------------------------------------------------------------------*
 * Function: 	init()
 * Purpose:		Set up event handlers for the tiles and for the 
 * 				new game button.		
 -------------------------------------------------------------------*/
		function init() {
			var element;	
			var i;
			
			$("input#newGameButton").on("click",function() {
				var tilesToReset = null;
				var timeSpan = null;

				tilesToReset = $("div.tile");
				for(i=0;i< tilesToReset.length;i++) {
					//Make all tiles visible again
					$(tilesToReset[i]).removeClass();
					$(tilesToReset[i]).addClass("tile");
					//Make "Click Me!" msgs visible again on all tiles
					$(tilesToReset).find("p").removeClass("invisible");
					
				}
				//Clear timer and time elapsed
				clearInterval(timerHandle);
				timerHandle = null;
				seconds = 0;
				$("span#time").text(" ");		
				firstTile = null;
				secondTile = null;
				pairsFound = 0;
				startGame();
			});
			$("div#modalMsgBox").on("click",function() {
					hideModalMsgBox();
					// This has to happen here otherwise the tiles get set
					// back before the user can see the results
					if (firstTile != null && secondTile != null) {
							if (firstTile.tileType != secondTile.tileType) {
									resetTheTiles();
							} else {
								if (firstTile.tileType === secondTile.tileType) {
									hideTheTiles();
								}
							}
					}
			});
			// add tile Event Handlers
			addTileClickHandler();
		}
		//startGame();

/*------------------------------------------------------------------*
 * Function: 	prependZeroIfNeeded(val)
 * Purpose:		Utility function to return a string version of the
 * 				val argument with a zero prepended if the val is less
 * 				than 10 or greater than or equal to 0.
 -------------------------------------------------------------------*/
		function prependZeroIfNeeded(val) {
			var temp = "";
			if(val<10 && val >=0) {
				temp = "0"+val;
				return temp;
			}
			return val.toString();
		}
/*------------------------------------------------------------------*
 * Function: 	startGame()
 * Purpose:		Start of game play. CSS class names are scrambled
 * 				and assigned to each of the tiles.
 -------------------------------------------------------------------*/
		function startGame() {
			var i;
			var j;
			var typeCounter;
			var len;
			var temp;
			var element;


			//Set up tiles and scramble them
			var tileType=["green_card","blue_card","red_card","pink_card","purple_card","orange_card",
							  "green_card","blue_card","red_card","pink_card","purple_card","orange_card",]
					
			for (i=0;i< tileType.length;i++) {
				j = Math.floor( (Math.random() *(tileType.length - 1)));		
				temp = tileType[i];
				tileType[i] = tileType[j];
				tileType[j] = temp;
			}
		 
			//Iterate through the tiles and add tileType class
			element = $("div.tile");
			len=element.length;
			for(i=0; i<len;i++) {
				element[i].tileType = tileType[i];
			}
		}
/*------------------------------------------------------------------*
 * Function: 	addTileClickHandler()
 * Purpose:		Add event handler for each tile. After every pair of
 * 				tiles seleted, the tiletype variable, which holds a
 * 				CSS class name, of each are compared, until all
 * 				matching pairs are found.
 * 				and assigned to each of the tiles.
 -------------------------------------------------------------------*/
		function addTileClickHandler() {
			var temp = "",
				i,
				len,
				tile;
			
			tile = $("div.tile");
			len = tile.length;
			for(i=0; i< len; i++) {
				(function() {
					
					$(tile[i]).on("click",function() {

						
						if (firstTile===null) { 
							firstTile = this; 
							flipTheTile(firstTile);
						} else if (firstTile === (this)){
							// Error msg: Pick different tile
						} else if (firstTile.tileType === this.tileType) {
							secondTile = this;
							flipTheTile(secondTile);
							showModalMsgBox("Match found!");

							pairsFound +=1;

							if (pairsFound ===6) {
								clearInterval(timerHandle);
								temp = $("span#time").text().slice(5);
								showModalMsgBox("CONGRATULATIONS! YOU HAVE SUCCESSFULLY FOUND ALL 6 PAIRS in " + temp + "!\nTO PLAY AGAIN, PLEASE CLICK THE NEW GAME BUTTON");
								hideTheTiles();
							}
						} else {
							secondTile = this;
							flipTheTile(secondTile);
							showModalMsgBox("Not a match. Try again.");
							// Both tiles will be reset to original states
							// in the modalMsgBox onclick Handler
						}
						// start timer
						if (timerHandle === null) {
							timerHandle = setInterval(function () {
							var timeSpan;
							
							$("span#time").text("Time: "+Math.floor(seconds/60)+":"+ prependZeroIfNeeded(seconds%60)); 	
							seconds+=1;
							}, 1000);
						}
					})// close of addEventListener
				}(i))//close of IIFE
			} // close of for loop
		}
/*------------------------------------------------------------------*
 * Function: 	showModalMsgBox(msg)
 * Purpose:		Display box in center of screen,and use an overly
 * 				to prevent other tiles from being clicked.	
 -------------------------------------------------------------------*/
		function showModalMsgBox(msg){
			$("div#modalMsgBoxContainer").removeClass("notShown");
			$("p#msgText").text(msg);

		}
/*------------------------------------------------------------------*
 * Function: 	hideModalMsgBox()
 * Purpose:		Clear the msg box and the overly. Also, reset the
 * 				clicked tiles back to their original state before
 * 				next turn.
 -------------------------------------------------------------------*/
		function hideModalMsgBox(){
			var el;
			$("div#modalMsgBoxContainer").addClass("notShown");
		}
/*------------------------------------------------------------------*
 * Function: 	resetTheTiles()
 * Purpose:		Reset both clicked tiles to their original states.
 -------------------------------------------------------------------*/
		function resetTheTiles() {
			if (firstTile !=secondTile) {
					if (firstTile != null) {
							flipTheTileBack(firstTile);
							firstTile=null
					}
					if (secondTile != null) {
							flipTheTileBack(secondTile);
							secondTile = null;
					}
			}
		}
/*------------------------------------------------------------------*
 * Function: 	flipTheTile(tile)
 * Purpose:		Reveal the tile by adding it's tileType as a class.
 -------------------------------------------------------------------*/
		function flipTheTile(tile) {
				//reveal color of tile by addingtileType class
				if (tile!=null) {
						$(tile).addClass(tile.tileType);
						// tile->span invisible
						$(tile).find("p").addClass("invisible");
				}

		}
/*------------------------------------------------------------------*
 * Function: 	flip TheTileBack()
 * Purpose:		Set the tile back to it's original state.
 -------------------------------------------------------------------*/
		function flipTheTileBack(tile) {
			if (tile != null) {
					// set them both to original state
					$(tile).removeClass(tile.tileType);
					// tile->span made visible
					$(tile).find("p").removeClass("invisible");
			}

		}
/*------------------------------------------------------------------*
 * Function: 	hideTheTile(tile)
 * Purpose:		Hide the tile by addiing invisible class to it.
 -------------------------------------------------------------------*/
		function hideTheTile(tile) {
			//  Make the tile invisible

			if (tile!=null) {
					$(tile).addClass("invisible");	
			}

		}
/*------------------------------------------------------------------*
 * Function: 	hideTheTiles()
 * Purpose:		Hide both tileby addiing invisible class to them.
 -------------------------------------------------------------------*/
		function hideTheTiles() {
			//  Make the tile invisible

			if (firstTile.tileType ===secondTile.tileType) {
					hideTheTile(firstTile);
					firstTile = null;
					hideTheTile(secondTile);
					secondTile = null;
			}
		}
			// Expose init(),and startGame() to window object
			return {
				init: init,
				startGame: startGame,
			};
		})(); // close of game module

window.addEventListener("load",memoryGame.init);
memoryGame.startGame();
