var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

//var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;
//var moon;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  //cloudImage = loadImage("cloud.png");

  bg=loadImage("bg2.jpg");

  //moonImage = loadImage("moon.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(displayWidth, displayHeight-114);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(displayWidth-1300, displayHeight-300,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.6;
  stroke(7);
  fill("red");
  ellipse(displayWidth-1300, displayHeight-300,100,100);
  
  ground = createSprite(displayWidth/2, displayHeight-200,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(displayWidth/2, displayHeight-550);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1;
  
  restart = createSprite(displayWidth/2, displayHeight-460);
  restart.addImage(restartImg);
  restart.scale = 0.2;
  
  invisibleGround = createSprite(displayWidth/2, displayHeight-180,2000,10);
  invisibleGround.visible = false;

  /*moon = createSprite(displayWidth-60, displayHeight-700);
  moon.addImage(moonImage);
  moon.scale =0.1*/
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  //cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(bg);
  fill("blue");
  textSize(30);
  text("Press Space bar to jump!!!!",displayWidth-1350,displayHeight-700);
  //displaying score
  textSize(25);
  text("Score: "+ score,displayWidth-150, displayHeight-700);
  textSize(30);
  text("Reach the score 1000 to win this game!!!!!!!!!!!",displayWidth-1350,displayHeight-650);
  
  camera.position.x=displayWidth/2;
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    
  trex.changeAnimation("running",trex_running);
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=displayHeight-220) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    //spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }

    if(score>=1000){
      background(0);

      fill("red");
      textSize(100);
      text("You Win!!",displayWidth-900,displayHeight/2);
       
      trex.visible=false
      ground.visible=false;
     
      ground.velocityX = 0;
      trex.velocityY = 0;
      
      checkPointSound.end();
     
      obstaclesGroup.destroyEach();
      //cloudsGroup.destroyEach(); 
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     if(mousePressedOver(restart)) {
      reset();
    }
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0;
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    //cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     //cloudsGroup.setVelocityXEach(0);  
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  


  drawSprites();
}

function reset(){
 
 gameState=PLAY; 
  
  gameOver.visible=false;
  restart.visible=false;
  
  obstaclesGroup.destroyEach();
  //cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score=0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(displayWidth-100,displayHeight-200,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

/*function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth-100,120,40,10);
    cloud.y = Math.round(random(displayHeight-400,displayHeight-300));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}*/