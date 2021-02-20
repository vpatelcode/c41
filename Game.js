class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    //reader
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    //root
    database.ref('/').update({
      gameState: state
    });
  }
//if a function needs to wait
  async start(){
    if(gameState === 0){
      player = new Player();
      //reads once, only if there is value
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage("car1",carImg1);
    car2 = createSprite(300,200);
    car2.addImage("car2",carImg2);
    car3 = createSprite(500,200);
    car3.addImage("car3",carImg3);
    car4 = createSprite(700,200);
    car4.addImage("car4",carImg4);
    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();

    if(allPlayers !== undefined){
    image(trackImg,0,-displayHeight*4,displayWidth,displayHeight*5);
    
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 175 ;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;
//because the array is 0 index
        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);

          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

   
    if(player.distance > 3860 ){
      player.rank+=1;
      Player.updateCarsAtEnd(player.rank);
      gameState=2;
    }

    drawSprites();
  }
 
  end(){
    console.log("game ended!");
    console.log(player.rank);
  }
}
