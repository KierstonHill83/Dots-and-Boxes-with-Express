$(document).on('ready', function() {

  //create a new instance of the game
 var newGame;


//Prompt the user to choose either 1 or 2 players. If 1 it will create a new instance of the game with 1 player. Or it will create a new instance of the game with 2 players.
bootbox.prompt("Are there 1 or 2 players?", function(result) {
  if (result === "1") {
    newGame = new Game(1);
  } else if (result === "2") {
    newGame = new Game(2);
  } else {
    bootbox.alert("Please choose 1 or 2.");
  }
});



  //When you click on each border  the id will be console logged. newGame is an instance of the Game class. grid is a property of the Game Class. updateClickedBoxArray is a method of the grid.
  $(".hor-border, .h1-border2").one("click", function() {
    var id = $(this).attr("id");
    newGame.grid.updateClickedBoxArray(id);
  });


  //All borders. When the mouseenters it will change the color to yellow. When the mouse leaves it changes the color to nothing. When clicked it permanently changes the color to gray.
 $(".hor-border, .h1-border2")
    .bind("mouseenter", function() {
      $(this).css("background", "#FFCC00");
    })
    .bind("mouseleave", function() {
      $(this).css("background", "");
    })
    .bind("click", function() {
      $(this).unbind("mouseenter");
      $(this).unbind("mouseleave");
      $(this).css("background", "#505050");
    });


//Show the rules when the button is clicked. Hide the rules when the button is clicked again.
$('#rules').popover();


//When clicked it will bind the mouseenter and mouseleave functions. Call the resetGrid function. Do something when the borders are clicked one time. Call the updateClickedBoxArray on the newGame. When the borders are combined into one function they all don't hightlight on the mouseenter.
$("#reset").on("click", function() {
  $(".hor-border")
    .bind("mouseenter", function() {
      $(this).css("background", "#FFCC00");
    })
    .bind("mouseleave", function() {
      $(this).css("background", "");
    });
  $(".h1-border2")
    .bind("mouseenter", function() {
      $(this).css("background", "#FFCC00");
    })
    .bind("mouseleave", function() {
      $(this).css("background", "");
    });
  newGame.grid.resetGrid();
  $(".hor-border, .h1-border2").one("click", function() {
    var id = $(this).attr("id");
    newGame.grid.updateClickedBoxArray(id);
  });
});


});
