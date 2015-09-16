
//Holds all the winning combinations
var winningCombos = [
  [1,5,7,14],
  [2,7,9,15],
  [3,9,11,16],
  [4,11,13,17],
  [14,18,20,27],
  [15,20,22,28],
  [16,22,24,29],
  [17,24,26,30],
  [27,31,33,40],
  [28,33,35,41],
  [29,35,37,42],
  [30,37,39,43],
  [40,44,46,53],
  [41,46,48,54],
  [42,48,50,55],
  [43,50,52,56]
];

//Makes a copy of the winning combinations. This will be used in other methods.
var copyWinCombo = winningCombos.slice(0);

var openSides = [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];

var copyOpenSides = openSides.slice(0);


//- - - - - - - - //
// Game Class  //
//- - - - - - - -//

//Game class that has a property of player, grid class and the current player is set to player 1.
function Game(numberPlayers) {
  this.player1 = new Player("#339999");
  this.player2 = new Player("#B93E3E");
  this.currentPlayer = 0; // either 1 or 2
  this.numberPlayers = numberPlayers;
  this.grid = new Grid(this.player1, this.player2, this.currentPlayer, this.numberPlayers);
}


//- - - - - - - - //
// Player Class  //
//- - - - - - - -//

//Update each player score and give each player a color and set the boxesWon array to an empty array.
function Player(playerColor) {
  this.playerScore = 0;
  this.playerColor = playerColor;
  this.boxesWon = [];
}


//- - - - - - - - //
//   Grid Class   //
//- - - - - - - -//

//Put each border ID that was clicked into the empty array. Define what each border ID is. Current Player and the players are used in grid methods, so they are defined here.
function Grid(player1, player2, currentPlayer, numberPlayers) {
  this.player = [player1, player2];
  this.clickedBorder = [];
  this.$borderID = $(".hor-border, .h1-border2");
  this.currentPlayer = currentPlayer;
  this.numberPlayers = numberPlayers;
}

//If the current player is player 1, the current player will reassign to 2 and become player 2. If not, the current player will be player 1. Using an exclusive or. When the currentPlayer switches it will change the text on the screen.
Grid.prototype.switchTurns = function() {
  this.currentPlayer ^= 1;
  $("#next-turn").html("Player " + (this.currentPlayer + 1));
};


//When a border is clicked the id is pushed into the clickedBorder array and made into a number. If the id that was pushed gets the player a point, they get to go again. Otherwise, the function will be false and they will switchTurns.
//If you have one players and while checkForWinner is true, do the computer logic and then switch turns. Otherwise, play normal with 2 players.
Grid.prototype.updateClickedBoxArray = function(borderID) {
  for (var i = 0; i < this.clickedBorder.length; i++) {
    if (parseInt(borderID) === this.clickedBorder[i]) {
      return null;
    }
  }
  this.clickedBorder.push(parseInt(borderID));
  this.adjustOpenSides(parseInt(borderID));
    if (this.checkForWinner() === false) {
      this.switchTurns();
      if (this.numberPlayers === 1) {
        do {
          this.computerLogic();
        } while (this.checkForWinner() === true);
        this.switchTurns();
      }
    }
    console.log(this.clickedBorder);
};


  //first loop grabs the first array. The second loop grabs the values in the second array. Then the clickedBorder array checks each index of the array one at a time. If it is not a winning array move on. If the player has a winning combo in their array the box will change to their color and their score will updated. They will also get another turn. Their turn lasts until they get a false(they don't complete a box).
Grid.prototype.checkForWinner = function() {
  var completedBox = false;
    for (var i = 0; i < copyWinCombo.length; i++) {
      var found = false;
      for (var j = 0; j < copyWinCombo[i].length; j++) {
        if (this.clickedBorder.includes(copyWinCombo[i][j])) {
          found = true;

        } else {
          found = false;
          break;
        }
      }


      if (found) {
       $("#box"+i).css("background", this.player[this.currentPlayer].playerColor);
       var output = copyWinCombo.slice(i, i+1);
       copyWinCombo[i] = [];
       this.player[this.currentPlayer].boxesWon.push(output);
       var lastIndex = this.clickedBorder[this.clickedBorder.length -1];
        $("#"+lastIndex).unbind("mouseenter");
        $("#"+lastIndex).unbind("mouseleave");
        $("#"+lastIndex).css("background", "#505050");
        $("#score" + this.currentPlayer).html(this.player[this.currentPlayer].boxesWon.length);
        this.getWinner();
        completedBox = true;
     }
  }
  return completedBox;
};



//If player 1's score is greater than player 2's score, they are the winner. Otherwise player 2 is the winner.
Grid.prototype.getWinner = function() {
  if (this.player[0].boxesWon.length + this.player[1].boxesWon.length === copyWinCombo.length) {
    if (this.player[0].boxesWon.length > this.player[1].boxesWon.length) {
      bootbox.alert("Congratulations! Player 1 is the Winner!", function() {
        $(".container").show("Player 1 is the Winner!");
      });
    } else if (this.player[1].boxesWon.length > this.player[0].boxesWon.length) {
       bootbox.alert("Congratulations! Player 2 is the Winner!", function() {
        $(".container").show("Player 2 is the Winner!");
       });
    } else {
      bootbox.alert("You tied!", function() {
        $(".container").show("You tied!");
      });
    }
  }
};


//Clears the clickedBorder array.
Grid.prototype.emptyArray = function() {
  this.clickedBorder.splice(0, this.clickedBorder.length);
};


//Clears the grid, resets the score to 0, sets the turn back to player 1, calls the function to empty the player array.
Grid.prototype.resetGrid = function() {
  this.$borderID.css("background", "");
  $("[id^=box]").css("background", "");
  this.player[0].boxesWon = [];
  this.player[1].boxesWon = [];
  this.emptyArray();
  this.currentPlayer = 0;
  $("#next-turn").html("Player " + (this.currentPlayer + 1));
  $("#score0").html("0");
  $("#score1").html("0");
  copyWinCombo = winningCombos.slice(0);
  copyOpenSides = openSides.slice(0);
};


//Loop through the winning combos. If the id is found in the winning combo then decrement the copy of open sides for that box.
Grid.prototype.adjustOpenSides = function(id) {
  for (var i = 0; i < copyWinCombo.length; i++) {
    if (copyWinCombo[i].includes(id)) {
      copyOpenSides[i]--;
    }
  }
  console.log(copyOpenSides);
};


//Loop through the copy of openSides. If numSides is found, break. If we don't find the number of sides, return null. If it is true, loop though the winning combos and if the clicked border is found in the winning combo, return that id.
Grid.prototype.getOpenSide = function(numSides) {
  for (var i = 0; i < copyOpenSides.length; i++) {
    if (copyOpenSides[i] === numSides) {
      for (var j = 0; j < copyWinCombo[i].length; j++) {
        if (this.clickedBorder.includes(copyWinCombo[i][j]) === false) {
          if (this.repeatedNumber(copyWinCombo[i][j], numSides) === true) {
            return copyWinCombo[i][j];
          }
        }
      }
    }
  }
  return null;
};


//Set id to equal the border id we want to choose. If the id equals getOpenSide with the parameter of 1 and that does not equal null, then do the following. If not, move on to the next if. Call adjustOpenSides with the id as the parameter. Push that id into the clickedBorder array. Change the css of that border so it will be solid.
Grid.prototype.computerLogic = function() {
  var id;
  if ((id = this.getOpenSide(1)) !== null) {
    this.adjustOpenSides(id);
    this.clickedBorder.push(id);
    $("#" + id).unbind("mouseenter");
    $("#" + id).unbind("mouseleave");
    $("#" + id).css("background", "#505050");
    return;
  } else if ((id = this.getOpenSide(4)) !== null) {
    // var test = copyOpenSides.filter(function(num){
    //   return num === 4;
    // });
    // var test2 = Math.floor(Math.random()* (test.length - 0));
    // console.log(test2);
    this.adjustOpenSides(id);
    this.clickedBorder.push(id);
    $("#" + id).unbind("mouseenter");
    $("#" + id).unbind("mouseleave");
    $("#" + id).css("background", "#505050");
    return;
  } else if ((id = this.getOpenSide(3)) !== null) {
    this.adjustOpenSides(id);
    this.clickedBorder.push(id);
    $("#" + id).unbind("mouseenter");
    $("#" + id).unbind("mouseleave");
    $("#" + id).css("background", "#505050");
    return;
  } else if ((id = this.getOpenSide(2)) !== null) {
    this.adjustOpenSides(id);
    this.clickedBorder.push(id);
    $("#" + id).unbind("mouseenter");
    $("#" + id).unbind("mouseleave");
    $("#" + id).css("background", "#505050");
    return;
  }
};


//Loop through the winning combos. Push the outer array index where the number was found into output. Check the index numbers that are in output against the same index of copyOpenSides. If each index of copyOpenSides does not match the condition in computerLogic(number of sides)...go on to the next condition.
Grid.prototype.repeatedNumber = function(num, numSides) {
  var output = [];
  for (var i = 0; i < copyWinCombo.length; i++) {
    for (var j = 0; j < copyWinCombo[i].length; j++) {
      if (num === copyWinCombo[i][j]) {
        output.push(i);
      }
    }
  }
  var found = false;
  for (var i = 0; i < output.length; i++) {
    if (copyOpenSides[output[i]] >= numSides) {
      found = true;
    } else {
      found = false;
      break;
    }
  }
  return found;
};


//Experimental. The technology's specification has not been stabilized. .includes() only works if this is in here. Determines whether an array includes a certain element, returning true or false.

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}
