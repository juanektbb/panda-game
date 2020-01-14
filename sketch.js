/* The Game Project */

var character = {
    x: 200,
    y: 0
};  

var house = {
    x: 40,
    y: 175
}; 

var canyon;

var bamboo;

var floorPos_y;
var scrollPos;
var realPos;

var isLeft;
var isRight;
var isJumping;
var isFalling;

var houseX;

var cloud;
var mountainB;
var mountainM;
var mountainF;
var tree;

var score;
var isWon = false;
var isLost = false;
var lives;

var enemies;
var platforms;
var isOnPlatform;
var limitJump;

function setup(){
    
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    
    //Starting Game
	startGame();

}


function draw(){
    
	background(77, 124, 251); //Sky blue

	noStroke();
	fill(36, 128, 26);
	rect(0, floorPos_y, width, height/4); //Green ground
    
    fill(82, 43, 16);
    rect(0, floorPos_y + 120, width, height/4);//Brown ground
    
    
	// Draw CLOUDS
    push();
    translate(scrollPos * 0.05, 0);
        drawClouds();
    pop();
    
    
	// Draw MOUNTAIN BACK
    push();
    translate(scrollPos * 0.15, 0);
        drawMountainsB();
    pop();
    
	// Draw MOUNTAIN MIDDLE
    push();
    translate(scrollPos * 0.2, 0);
        drawMountainsM();
    pop();
    
	// Draw MOUNTAIN FRONT
    push();
    translate(scrollPos * 0.25, 0);
        drawMountainsF();
    pop();

    
	// Draw TREE
    push();
    translate(scrollPos, 0);
        drawTrees();
    pop();
    
    
	// Draw HOUSES  
    push();
    translate(scrollPos, 0);
        drawHouses();
    pop();
    
    
	// Draw CANYON 
    push();
    translate(scrollPos, 0);
        drawCanyon(canyon);
    pop();
    
    
    // Function for character falling into the canyon
    checkCanyon(canyon);
    
    
	// Draw BAMBOO
    push();
    translate(scrollPos, 0); 
            drawBamboo(bamboo);
    pop();
    
    
    // Function for checking BAMBOO
    checkBamboo(bamboo);
    
    
    // Function for checking IF player won
    checkPlayerWon(bamboo);
    
    
	// Draw game character.
	drawGameChar();

    
    // Function for checking if the player die
	checkPlayerDie();
    
    
    //Draw enemies
    push();
    translate(scrollPos, 0);
        for(var i = 0; i < enemies.length; i++){
        
            enemies[i].display();
            enemies[i].move();
            enemies[i].checkCharCollision();
        
        }
    pop();
    
    
    //Draw platforms
    isOnPlatform = false;
    
    push();
    translate(scrollPos, 0);
        for(var i = 0; i < platforms.length; i++){
        
            platforms[i].display();
            platforms[i].checkCharOn();

        }
    pop();
    
    
    //SCREEN Message for GAME OVER
    if(isLost == true){
        
        //Drawing LOST
        fill(176, 0, 0);
        noStroke();
        rect(200,200,624,176);
        
        textSize(50);
        fill(255);
        strokeWeight(3);
        
        text("GAME OVER - You lost \n (Press space to continue)", 1024/2,576/2);
        textAlign(CENTER,CENTER);
        strokeWeight(1);
        return;
        
    }
    
    
    //SCREEN Message for PLAYER WON
    if(isWon == true){
        
        //Drawing WON
        fill(119, 242, 147);
        noStroke();
        rect(200,200,624,176);
        
        textSize(50);
        fill(0);
        strokeWeight(3);
        stroke(0);
        
        text("YOU WON \n (Press space to continue)", 1024/2,576/2);
        textAlign(CENTER,CENTER);
        strokeWeight(1);
        return;
        
    }

    
	//Logic to make the game character move or the background scroll
	if(isLeft){
        if(character.x > width * 0.2){
                character.x = character.x - 5;
        }else{
                scrollPos += 5;
        }
	}

	if(isRight){
        if(character.x < width * 0.8){
                character.x = character.x + 5;
        }else{
                scrollPos -= 5; //Negative for moving against the background
        }
	}
    

    //This makes the character to fall (Gravity)
   	if(character.y < floorPos_y - 40 && isOnPlatform == false && isJumping == false){
        character.y += 3;
	
    }else{
        isFalling = false;
        
	}

    //This makes the character to jump (Power up)
	if(isJumping == true && isFalling == false && character.y > limitJump){
        character.y -= 3;
        isFalling = false;
     
	}
    
    //Reach the limit to start falling
    if(character.y < limitJump){
        isFalling = true;
        isJumping = false;
        
    }


	//Update real position of gameChar for collision detection.
	realPos = character.x - scrollPos;
    
    
    //Drawing score in the screen
    textSize(20);
    fill(0);
    stroke(1);
    text("Bamboo: "+score+" / "+bamboo.length, 12.5,25);
    
    //Drawing lives in the screen
    textSize(20);
    fill(0);
    text("Lives: ", 12.5,50);
    
    //Drawing hearts in the screen
    for(var l = 0; l < lives; l++){
        
        noStroke();     
        fill(255,0,0);
        ellipse(75 + 18*l,40,8,8);
        ellipse(83 + 18*l,40,8,8);
        triangle(71 + 18*l,40,
            87 + 18*l,40,
            79 + 18*l,51);  
   
    }
    
    
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    
    if(isLost || isWon){
    if(key == ' '){ 
        nextLevel();
        
    }
        return;
    }
    

	if(key == 'A' || keyCode == 37){
			isLeft = true;
	}

	if(key == 'D' || keyCode == 39){
			isRight = true;
	}

    if((keyCode === 32 && character.y == floorPos_y - 40) ||
        (keyCode === 32 && isOnPlatform == true)){
        
        //IsJumping is true
        if(isFalling == false){
            isJumping = true;
            limitJump = character.y - 110; //Limit of jump
        }
    }
}

function keyReleased(){

	if(key == 'A' || keyCode == 37){
		isLeft = false;
	}

	if(key == 'D' || keyCode == 39){
		isRight = false;
	}

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar(){
	
    
        //CHARACTER LEFT
        if(isLeft == true && isJumping == false && isRight == false){
            
            stroke(0);
            
            //Legs
            fill(25,25,25);
            noStroke();
            ellipse(character.x + 16,character.y + 68,9,11);

            quad(character.x + 18,character.y + 58,
                character.x + 25,character.y + 65,
                character.x + 19,character.y + 72,
                character.x + 12.2,character.y + 65);    

            fill(0,0,0);
            ellipse(character.x + 34,character.y + 70,10,12);
            quad(character.x + 29.6,character.y + 73,
                character.x + 24,character.y + 62,
                character.x + 33,character.y + 57,
                character.x + 39,character.y + 69);

            //Body
            stroke(0);
            fill(0);
            ellipse(character.x + 25,character.y + 50,21,32);

            fill(255);
            ellipse(character.x + 20,character.y + 50,8,24);

            fill(0);
            ellipse(character.x + 17.2,character.y + 56,0.1,0.1);

            //Arms
            noStroke();
            fill(0,0,0);
            quad(character.x + 19,character.y + 38,
                 character.x + 7,character.y + 52,
                 character.x + 13,character.y + 56,
                 character.x + 26,character.y + 40); 
            ellipse(character.x + 10,character.y + 54,7,7);

            //Head
            stroke(0);
            fill(255);
            ellipse(character.x + 25,character.y + 25,25,28);

            //Eyes
            fill(0);
            ellipse(character.x + 19,character.y + 22,9,8);

            fill(255);
            ellipse(character.x + 18,character.y + 23,6,6); 

            fill(0,0,0);
            noStroke();
            ellipse(character.x + 18,character.y + 23,4,4);

            fill(255);
            ellipse(character.x + 17,character.y + 22,1,1);

            //Ears
            fill(0);
            ellipse(character.x + 24,character.y + 12,10,12);
            fill(150);
            ellipse(character.x + 21,character.y + 12,2,6);

            //Nose
            fill(0);
            stroke(0);
            arc(character.x + 14, character.y + 30, 4, 5, PI, TWO_PI, CHORD);    

            fill(0);
            line(character.x + 14,character.y + 28,
                 character.x + 14,character.y + 32);

            noFill();
            arc(character.x + 16, character.y + 32, 3, 2, 0, PI);

            //Tail
            fill(0);
            ellipse(character.x + 35, character.y + 58, 5, 5);
            
            
            
        //CHARACTER RIGHT    
        }else if(isRight == true && isJumping == false && isLeft == false){
            
            stroke(0);

            //Legs
            fill(25,25,25);
            noStroke();
            ellipse(character.x + 34,character.y + 68,9,11);

            quad(character.x + 32,character.y + 58,
                character.x + 25,character.y + 65,
                character.x + 31,character.y + 72,
                character.x + 37.8,character.y + 65);    

            fill(0,0,0);
            ellipse(character.x + 16,character.y + 70,10,12);
            quad(character.x + 20.4,character.y + 73,
                character.x + 26,character.y + 62,
                character.x + 17,character.y + 57,
                character.x + 11,character.y + 69);

            //Body
            stroke(0);
            fill(0);
            ellipse(character.x + 25,character.y + 50,21,32);

            fill(255);
            ellipse(character.x + 30,character.y + 50,8,24);

            fill(0);
            ellipse(character.x + 32.8,character.y + 56,0.1,0.1);

            //Arms
            noStroke();
            fill(0,0,0);
            quad(character.x + 31,character.y + 38,
                 character.x + 43,character.y + 52,
                 character.x + 37,character.y + 56,
                 character.x + 24,character.y + 40); 
            ellipse(character.x + 40,character.y + 54,7,7);

            //Head
            stroke(0);
            fill(255);
            ellipse(character.x + 25,character.y + 25,25,28);

            //Eyes
            fill(0);
            ellipse(character.x + 31,character.y + 22,9,8);

            fill(255);
            ellipse(character.x + 32,character.y + 23,6,6); 

            fill(0,0,0);
            noStroke();
            ellipse(character.x + 32,character.y + 23,4,4);

            fill(255);
            ellipse(character.x + 33,character.y + 22,1,1);

            //Ears
            fill(0);
            ellipse(character.x + 26,character.y + 12,10,12);

            fill(150);
            ellipse(character.x + 29,character.y + 12,2,6);

            //Nose
            fill(0);
            stroke(0);
            arc(character.x + 36, character.y + 30, 4, 5, PI, TWO_PI, CHORD);    

            fill(0);
            line(character.x + 35.5,character.y + 28,
                 character.x + 35.5,character.y + 31);

            noFill();
            arc(character.x + 34.5, character.y + 32, 3, 2, 0, PI);

            //Tail
            fill(0);
            ellipse(character.x + 15, character.y + 58, 5, 5);
        
            
            
        //CHARACTER JUMPING  
        }else if(isJumping == true && isRight == false && isLeft == false || isFalling == true && isOnPlatform == false){
            
            stroke(0);

            //Ears
            fill(0);
            ellipse(character.x + 38,character.y + 12,12,12);
            ellipse(character.x + 12,character.y + 12,12,12);

            fill(150);
            ellipse(character.x + 13,character.y + 13,8,8);
            ellipse(character.x + 37,character.y + 13,8,8);

            //Arms
            noStroke();
            fill(0,0,0);
            quad(character.x + 15,character.y + 38,
                 character.x + 3,character.y + 52,
                 character.x + 9,character.y + 56,
                 character.x + 20,character.y + 40); 
            ellipse(character.x + 6,character.y + 54,7,7);

            quad(character.x + 35,character.y + 34,
                 character.x + 43,character.y + 21,
                 character.x + 49,character.y + 25,
                 character.x + 32,character.y + 53); 
            ellipse(character.x + 46,character.y + 23,7,7);

            //Body
            stroke(0);
            fill(0);
            ellipse(character.x + 25,character.y + 50,28,32);

            fill(255);
            ellipse(character.x + 25,character.y + 50,23,25);

            fill(0);
            ellipse(character.x + 25,character.y + 56,0.5,0.5);

            //Head
            fill(255);
            ellipse(character.x + 25,character.y + 25,32,28);

            //Eyes
            fill(0);
            ellipse(character.x + 19,character.y + 22,9,8);
            ellipse(character.x + 31,character.y + 22,9,8);

            fill(255);
            ellipse(character.x + 20,character.y + 23,6,6);
            ellipse(character.x + 30,character.y + 23,6,6);

            fill(0,0,0);
            noStroke();
            ellipse(character.x + 20,character.y + 23,4,4);
            ellipse(character.x + 30,character.y + 23,4,4);

            fill(255);
            ellipse(character.x + 21,character.y + 22,1,1);
            ellipse(character.x + 31,character.y + 22,1,1);

            //Nose
            fill(0);
            ellipse(character.x + 25,character.y + 30,8,7);

            fill(255);
            rect(character.x + 20.5,character.y + 30,9,7);

            stroke(0);
            fill(0);
            line(character.x + 24.5,character.y + 28,
                 character.x + 24.5,character.y + 32);

            noFill();
            arc(character.x + 23, character.y + 33, 4, 2, 0, PI);
            arc(character.x + 27, character.y + 33, 4, 2, 0, PI);

            //Legs
            fill(0,0,0);
            noStroke();
            triangle(character.x + 38,character.y + 55,
                     character.x + 26,character.y + 66,
                     character.x + 38,character.y + 66);
            ellipse(character.x + 33,character.y + 62,12,14);

            fill(150);
            ellipse(character.x + 33,character.y + 62,10,12);

            fill(0);
            triangle(character.x + 12,character.y + 55,
                     character.x + 24,character.y + 66,
                     character.x + 12,character.y + 66);
            ellipse(character.x + 17,character.y + 62,12,14);

            fill(150);
            ellipse(character.x + 17,character.y + 62,10,12);

            fill(255,182,193);
            ellipse(character.x + 17,character.y + 63.5,4,5);
            ellipse(character.x + 17,character.y + 59,1.5,1.5);
            ellipse(character.x + 19.5,character.y + 60,1.5,1.5);
            ellipse(character.x + 14.5,character.y + 60,1.5,1.5);

            ellipse(character.x + 33,character.y + 63.5,4,5);
            ellipse(character.x + 33,character.y + 59,1.5,1.5);
            ellipse(character.x + 35.5,character.y + 60,1.5,1.5);
            ellipse(character.x + 30.5,character.y + 60,1.5,1.5);
            
            
            
        //CHARACTER JUMPING LEFT    
        }else if(isLeft == true && isJumping == true){
            
            stroke(0);
    
            //Body
            stroke(0);
            fill(0);
            ellipse(character.x + 25,character.y + 50,21,32);

            fill(255);
            ellipse(character.x + 20,character.y + 50,8,24);

            fill(0);
            ellipse(character.x + 17.2,character.y + 56,0.1,0.1);

            //Head
            stroke(0);
            fill(255);
            ellipse(character.x + 25,character.y + 25,25,28);

            //Eyes
            fill(0);
            ellipse(character.x + 19,character.y + 22,9,8);

            fill(255);
            ellipse(character.x + 18,character.y + 23,6,6); 

            fill(0,0,0);
            noStroke();
            ellipse(character.x + 18,character.y + 23,4,4);

            fill(255);
            ellipse(character.x + 17,character.y + 22,1,1);

            //Ears
            fill(0);
            ellipse(character.x + 24,character.y + 12,10,12);

            fill(150);
            ellipse(character.x + 21,character.y + 12,2,6);

            //Nose
            fill(0);
            stroke(0);
            arc(character.x + 14, character.y + 30, 4, 5, PI, TWO_PI, CHORD);    

            fill(0);
            line(character.x + 14,character.y + 28,
                 character.x + 14,character.y + 32);

            noFill();
            arc(character.x + 16, character.y + 32, 3, 2, 0, PI);

            //Arms
            noStroke();
            fill(0,0,0);

            quad(character.x + 24,character.y + 39,
                 character.x + 9,character.y + 25,
                 character.x + 3,character.y + 29,
                 character.x + 25,character.y + 50); 
            ellipse(character.x + 6,character.y + 27,7,7);

            //Tail
            fill(0);
            ellipse(character.x + 35, character.y + 58, 5, 5);

            //Legs
            noStroke();
            fill(0,0,0);
            ellipse(character.x + 12,character.y + 63,10,10);
            rect(character.x + 12,character.y + 58,16,10);
            ellipse(character.x + 28,character.y + 63,10,10);
                  
            
            
        }else if(isRight == true && isJumping == true){
                 
            stroke(0);
        
            //Body
            stroke(0);
            fill(0);
            ellipse(character.x + 25,character.y + 50,21,32);

            fill(255);
            ellipse(character.x + 30,character.y + 50,8,24);

            fill(0);
            ellipse(character.x + 32.8,character.y + 56,0.1,0.1);

            //Head
            stroke(0);
            fill(255);
            ellipse(character.x + 25,character.y + 25,25,28);

            //Eyes
            fill(0);
            ellipse(character.x + 31,character.y + 22,9,8);

            fill(255);
            ellipse(character.x + 32,character.y + 23,6,6);

            fill(0,0,0);
            noStroke();
            ellipse(character.x + 32,character.y + 23,4,4);

            fill(255);
            ellipse(character.x + 33,character.y + 22,1,1);

            //Ears
            fill(0);
            ellipse(character.x + 26,character.y + 12,10,12);

            fill(150);
            ellipse(character.x + 29,character.y + 12,2,6);

            //Nose
            fill(0);
            stroke(0);
            arc(character.x + 36, character.y + 30, 4, 5, PI, TWO_PI, CHORD);    

            fill(0);
            line(character.x + 35.5,character.y + 28,
                 character.x + 35.5,character.y + 31);

            noFill();
            arc(character.x + 34.5, character.y + 32, 3, 2, 0, PI);

            //Arms
            noStroke();
            fill(0,0,0);

            quad(character.x + 26,character.y + 39,
                 character.x + 41,character.y + 25,
                 character.x + 47,character.y + 29,
                 character.x + 25,character.y + 50); 
            ellipse(character.x + 44,character.y + 27,7,7);

            //Tail
            fill(0);
            ellipse(character.x + 15, character.y + 58, 5, 5);

            //Legs
            noStroke();
            fill(0,0,0);
            ellipse(character.x + 38,character.y + 63,10,10);
            rect(character.x + 21,character.y + 58,16,10);
            ellipse(character.x + 21,character.y + 63,10,10);
      
            
            
        //CHARACTER FRONT    
        }else{
             
        stroke(0); 
        
            //Ears
            fill(0);
            ellipse(character.x + 38,character.y + 12,12,12);
            ellipse(character.x + 12,character.y + 12,12,12);

            fill(150);
            ellipse(character.x + 13,character.y + 13,8,8);
            ellipse(character.x + 37,character.y + 13,8,8);

            //Arms
            noStroke();
            fill(0,0,0);
            quad(character.x + 15,character.y + 38,
                 character.x + 3,character.y + 52,
                 character.x + 9,character.y + 56,
                 character.x + 20,character.y + 40);
            ellipse(character.x + 6,character.y + 54,7,7);

            quad(character.x + 35,character.y + 38,
                 character.x + 47,character.y + 52,
                 character.x + 41,character.y + 56,
                 character.x + 30,character.y + 40);
            ellipse(character.x + 44,character.y + 54,7,7);

            //Body
            stroke(0);
            fill(0);
            ellipse(character.x + 25,character.y + 50,28,32);

            fill(255);
            ellipse(character.x + 25,character.y + 50,23,25);

            fill(0);
            ellipse(character.x + 25,character.y + 56,0.5,0.5);

            //Head
            fill(255);
            ellipse(character.x + 25,character.y + 25,32,28);

            //Eyes
            fill(0);
            ellipse(character.x + 19,character.y + 22,9,8);
            ellipse(character.x + 31,character.y + 22,9,8);

            fill(255);
            ellipse(character.x + 20,character.y + 23,6,6);
            ellipse(character.x + 30,character.y + 23,6,6);

            fill(0,0,0);
            noStroke();
            ellipse(character.x + 20,character.y + 23,4,4);
            ellipse(character.x + 30,character.y + 23,4,4);

            fill(255);
            ellipse(character.x + 21,character.y + 22,1,1);
            ellipse(character.x + 31,character.y + 22,1,1);

            //Nose
            fill(0);
            ellipse(character.x + 25,character.y + 30,8,7);

            fill(255);
            rect(character.x + 20.5,character.y + 30,9,7);

            stroke(0);
            fill(0);
            line(character.x + 24.5,character.y + 28,
                 character.x + 24.5,character.y + 32);

            noFill();
            arc(character.x + 23, character.y + 33, 4, 2, 0, PI);
            arc(character.x + 27, character.y + 33, 4, 2, 0, PI);

            //Legs
            fill(0,0,0);
            noStroke();
            triangle(character.x + 38,character.y + 55,
                     character.x + 26,character.y + 66,
                     character.x + 38,character.y + 66);
            ellipse(character.x + 33,character.y + 67,10,12);

            triangle(character.x + 12,character.y + 55,
                     character.x + 24,character.y + 66,
                     character.x + 12,character.y + 66);
            ellipse(character.x + 17,character.y + 67,10,12);
        }
    
    
    
    
}



// ---------------------------
// Background render functions
// ---------------------------

// Function to draw CLOUDS objects.
function drawClouds(){

    for(var i = 0; i < cloud.length; i++){ 
        
    noStroke();
    fill(cloud[i].fill);
    
        ellipse(cloud[i].x_pos,cloud[i].y_pos,cloud[i].size,cloud[i].size);
        ellipse(cloud[i].x_pos + 25,cloud[i].y_pos,cloud[i].size,cloud[i].size);
        ellipse(cloud[i].x_pos + 50,cloud[i].y_pos,cloud[i].size,cloud[i].size);
        ellipse(cloud[i].x_pos + 75,cloud[i].y_pos,cloud[i].size,cloud[i].size);

        ellipse(cloud[i].x_pos,cloud[i].y_pos + 25,cloud[i].size,cloud[i].size);
        ellipse(cloud[i].x_pos + 25,cloud[i].y_pos + 25,cloud[i].size,cloud[i].size);
        ellipse(cloud[i].x_pos + 50,cloud[i].y_pos + 25,cloud[i].size,cloud[i].size);
        ellipse(cloud[i].x_pos + 75, cloud[i].y_pos+ 25,cloud[i].size,cloud[i].size);

        ellipse(cloud[i].x_pos - 12,cloud[i].y_pos + 12,cloud[i].size,cloud[i].size);
        ellipse(cloud[i].x_pos + 88,cloud[i].y_pos + 12,cloud[i].size,cloud[i].size);
    
    }
     
}


// Function to draw MOUNTAINS BACK objects.
function drawMountainsB(){
    
    for(var i = 0; i < mountainB.length; i++){
        
        noStroke();
        fill(180);
        triangle(mountainB[i].x_pos + 400,432,
                 mountainB[i].x_pos + 660,mountainB[i].height + 32,
                 mountainB[i].x_pos + 840,432);
        
        fill(188);
        triangle(mountainB[i].x_pos + 400 + 150,432,
                 mountainB[i].x_pos + 660,mountainB[i].height + 32,
                 mountainB[i].x_pos + 840,432);
        
    }

}

// Function to draw MOUNTAINS MIDDLE objects.
function drawMountainsM(){
    
    for(var i = 0; i < mountainM.length; i++){
        
        noStroke();
        fill(128);
        triangle(mountainM[i].x_pos,432,
                 mountainM[i].x_pos + 300,mountainM[i].height + 42,
                 mountainM[i].x_pos + 500,432);
        
        fill(136);
        triangle(mountainM[i].x_pos + 200,432,
                 mountainM[i].x_pos + 300,mountainM[i].height + 42,
                 mountainM[i].x_pos + 500,432);
        
    }
    
}

// Function to draw MOUNTAINS FRONT objects.
function drawMountainsF(){
    
    for(var i = 0; i < mountainF.length; i++){
        
        noStroke();
        fill(100);
        triangle(mountainF[i].x_pos + 300,432,
                 mountainF[i].x_pos + 520,mountainF[i].height + 60,
                 mountainF[i].x_pos + 800,432);
        
        fill(108);
        triangle(mountainF[i].x_pos + 300 + 200,432,
                 mountainF[i].x_pos + 520,mountainF[i].height + 60,
                 mountainF[i].x_pos + 800,432);
        
    }

}


// Function to draw TREES objects.
function drawTrees(){
    
    for (var i = 0; i < tree.length; i++){

        noStroke();
        fill(115, 58, 32);
        rect(tree[i].x_pos + 75,322 - tree[i].height,50,110 + tree[i].height);
        
        fill(133, 68, 37);
        rect(tree[i].x_pos + 115,322 - tree[i].height,10,110 + tree[i].height);
        
        fill(50, 151, 6); 
        ellipse(tree[i].x_pos + 50,312 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 75,312 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 100,312 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 125,312 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 150,312 - tree[i].height,50,50);

        ellipse(tree[i].x_pos + 25,287 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 50,287 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 75,287 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 100,287 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 125,287 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 150,287 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 175,287 - tree[i].height,50,50);

        ellipse(tree[i].x_pos + 50,262 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 75,262 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 100,262 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 125,262 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 150,262 - tree[i].height,50,50);

        ellipse(tree[i].x_pos + 75,237 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 100,237 - tree[i].height,50,50);
        ellipse(tree[i].x_pos + 125,237 - tree[i].height,50,50);

        ellipse(tree[i].x_pos + 100,212 - tree[i].height,50,50);

        //Apples
        fill(255,0,0);
        stroke(0);
        strokeWeight(1);
        line(tree[i].x_pos + 90, 225 - tree[i].height,tree[i].x_pos + 90, 222 - tree[i].height);
        ellipse(tree[i].x_pos + 90,232 - tree[i].height,15,15);
        
        line(tree[i].x_pos + 65, 265 - tree[i].height,tree[i].x_pos + 65, 262 - tree[i].height);
        ellipse(tree[i].x_pos + 65,272 - tree[i].height,15,15);
        
        line(tree[i].x_pos + 135, 245 - tree[i].height,tree[i].x_pos + 135, 242 - tree[i].height);
        ellipse(tree[i].x_pos + 135,252 - tree[i].height,15,15);
        
        line(tree[i].x_pos + 150, 305 - tree[i].height,tree[i].x_pos + 150, 302 - tree[i].height);
        ellipse(tree[i].x_pos + 150,312 - tree[i].height,15,15);
        
        line(tree[i].x_pos + 100, 295 - tree[i].height,tree[i].x_pos + 100, 292 - tree[i].height);
        ellipse(tree[i].x_pos + 100,302 - tree[i].height,15,15);
    }
    
}


// Function to draw HOUSES objects.
function drawHouses(){

    for(i = 0; i < houseX.length; i++){
    
        house.x = houseX[i];
        
        stroke(0);
        //Base
        fill(houseCol[i].r,houseCol[i].g,houseCol[i].b); 
        rect(house.x + 10,house.y + 230,400,30);  

        //Windows
        fill(48,166,235);
        rect(house.x + 80,house.y + 150,50,80);
        rect(house.x + 130,house.y + 150,50,80);
        rect(house.x + 180,house.y + 150,60,80);
        rect(house.x + 240,house.y + 150,50,80);
        rect(house.x + 290,house.y + 150,50,80);

        //Horizontal grey bars
        fill(100);
        rect(house.x + 80,house.y + 150,260,30);
        rect(house.x + 80,house.y + 215,260,15);

        //Pillars
        fill(houseCol[i].r + 30,houseCol[i].g + 30,houseCol[i].b + 30);
        rect(house.x + 60,house.y + 150,20,80);
        rect(house.x + 340,house.y + 150,20,80);
        rect(house.x + 165,house.y + 150,10,80);
        rect(house.x + 245,house.y + 150,10,80);

        //Stairs
        fill(houseCol[i].r,houseCol[i].g,houseCol[i].b);  
        rect(house.x + 170,house.y + 210,80,30);
        rect(house.x + 160,house.y + 230,100,30);
        rect(house.x + 150,house.y + 250,120,30);

        //Roof
        fill(houseCol[i].roof,117,51);
        quad(house.x + 90,house.y + 125,
             house.x + 330,house.y + 125,
             house.x + 380,house.y + 165,
             house.x + 40,house.y + 165);
        rect(house.x + 90,house.y + 95,240,30);
        rect(house.x + 90,house.y + 95,240,15);
        quad(house.x + 90,house.y + 30,
             house.x + 330,house.y + 30,
             house.x + 370,house.y + 100,
             house.x + 50,house.y + 100);

        //Roof lines
        for(var k = 0; k <= 10; k++){
            line(house.x + 110 + 20 * k,house.y + 125,house.x + 85 + 25 * k,house.y + 165);
        }

        for(var j = 0; j <= 10; j++){
            line(house.x + 110 + 20 * j,house.y + 30,house.x + 85 + 25 * j,house.y + 100);
        }
        rect(house.x + 90,house.y + 15,240,15);
        
    }
     
}




// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon){
    
    for(var cy = 0; cy < canyon.length; cy++){
        fill(82, 43, 16);
        rect(t_canyon[cy].x, floorPos_y + 3, t_canyon[cy].width, height - floorPos_y);
    }
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon){
    
    for(var cy = 0; cy < canyon.length; cy++){
        if(realPos + 25 > t_canyon[cy].x && realPos + 25 < t_canyon[cy].x + t_canyon[cy].width && character.y + 70>= floorPos_y - 40 + 69){
            character.y += 6;
        }
    
        //NO GOING INTO THE GROUND WHEN FALLING IN THE CANYON
        if(realPos > t_canyon[cy].x - 10 && realPos + 48 < t_canyon[cy].x + t_canyon[cy].width + 10 && character.y + 70 > floorPos_y - 40 + 69){
            isLeft = false; 
            isRight = false;
        }
 
    }
}



// ----------------------------------
// Pick-up render and check functions
// ----------------------------------

// Function to draw BAMBOO
function drawBamboo(t_bamboo){
    
    for(var b = 0; b < bamboo.length; b++){
    
        if(t_bamboo[b].isFound == false){  
            stroke(0);
            fill(0);
            arc(t_bamboo[b].x + 51.4,t_bamboo[b].y + 54.2,12,13.5,10*PI/6,PI/2);

            fill(85,174,40);
            quad(t_bamboo[b].x + 5,t_bamboo[b].y + 5,
                 t_bamboo[b].x + 16,t_bamboo[b].y + 3,
                 t_bamboo[b].x + 57,t_bamboo[b].y + 51,
                 t_bamboo[b].x + 56.5,t_bamboo[b].y + 56);

            fill(117,215,68);
            quad(t_bamboo[b].x + 5,t_bamboo[b].y + 5,
                 t_bamboo[b].x + 11,t_bamboo[b].y + 2,
                 t_bamboo[b].x + 56.5,t_bamboo[b].y + 55.5,
                 t_bamboo[b].x + 51,t_bamboo[b].y + 61);

            line(t_bamboo[b].x + 21,t_bamboo[b].y + 24,
                 t_bamboo[b].x + 26,t_bamboo[b].y + 21);
            line(t_bamboo[b].x + 38,t_bamboo[b].y + 45,
                 t_bamboo[b].x + 44,t_bamboo[b].y + 41);

            fill(57,129,20);
            ellipse(t_bamboo[b].x + 10,t_bamboo[b].y + 3.5,12,5);

            //Leaves
            fill(85,174,40);
            arc(t_bamboo[b].x + 10,t_bamboo[b].y + 20,10,5,5/6*PI,11/6*PI, CHORD);
            arc(t_bamboo[b].x + 28,t_bamboo[b].y + 40.5,5,8,2*PI,PI, CHORD);

            arc(t_bamboo[b].x + 40,t_bamboo[b].y + 22,10,3,PI,2/3*PI, CHORD);
            arc(t_bamboo[b].x + 56,t_bamboo[b].y + 40,10,5,PI/4,5/4*PI, CHORD);

            line(t_bamboo[b].x + 12,t_bamboo[b].y + 17.5,
                 t_bamboo[b].x + 15,t_bamboo[b].y + 18);
            line(t_bamboo[b].x + 30,t_bamboo[b].y + 40,
                 t_bamboo[b].x + 34,t_bamboo[b].y + 41);

            line(t_bamboo[b].x + 34.5,t_bamboo[b].y + 22,
                 t_bamboo[b].x + 34,t_bamboo[b].y + 24);
            line(t_bamboo[b].x + 57,t_bamboo[b].y + 42,
                 t_bamboo[b].x + 54,t_bamboo[b].y + 47);
        }
    }
}

// Function to check character has picked up BAMBOO
function checkBamboo(t_bamboo){

    for(var b = 0; b < bamboo.length; b++){

        if(t_bamboo[b].isFound == false){ //Avoids taking the bambo million times  

            if(realPos + 25 > t_bamboo[b].x && realPos + 25 < t_bamboo[b].x + 56 &&
                character.y + 40 > t_bamboo[b].y && character.y + 40 < t_bamboo[b].y + 61){

                t_bamboo[b].isFound = true;
                score += 1;
                console.log("Bamboo was caught " + score);

            }

        }
        
    }
    
}



// ---------------------------------
// Check player collected all bambo
// ---------------------------------
function checkPlayerWon(t_bamboo){
    
    if(score == t_bamboo.length){
        isWon = true;
    }
    
}



// ---------------------------------
// THE SETUP FUNCTION IS IN startGame function
// ---------------------------------
function startGame(){
    
    score = 0;
    character.x = width/2 - 30;
	character.y = floorPos_y - 40; 
    
	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	realPos = character.x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isJumping = false;
	isFalling = false;

    //Houses X values in array
    houseX = [410, 2030, 3050, 4450];
    houseCol =[];
    for(var hc = 0; hc < houseX.length; hc++){
        houseCol.push({
            r: random(40, 100), 
            g: random(40, 100), 
            b: random(40, 100),
            roof: random(150, 200)
        });
    }
    
    
    //Cloud objects in array & for loop
    cloud = [];
    for(var c = 0; c < 15; c++){
        cloud.push({
            x_pos: random(10, 2000), 
            y_pos: random(20, 120), 
            size: 35,
            fill: random(200,255)
        });
    }
    
        
    //Mountains objects in array & for loop
    mountainB = [];
    for(var mb = 0; mb < 6; mb++){
        mountainB.push({
            x_pos: mb * random(180,230) - 500, 
            height: random(150,175)
        });
    }
    
    mountainM = [];
    for(var mm = 0; mm < 8; mm++){
        mountainM.push({
            x_pos: mm * random(180,230) - 100, 
            height: random(180,200)
        });
    }
    
    mountainF = [];
    for(var mf = 0; mf < 8; mf++){
        mountainF.push({
            x_pos: mf * random(180,230) - 200, 
            height: random(200,230)
        });
    }
    
    
    //Trees objects in array & for loop
    tree = [];
    for(var t = 0; t < 15; t++){
        tree.push({
            x_pos: 5 + t * 350, 
            height: random(-20,80)
        });
    }
    
    
    //Bamboo objects in array
    bamboo = [{x: 135, y: 390, size: 50, isFound: false},
              {x: 875, y: 120, size: 50, isFound: false},
              {x: 2210, y: 390, size: 50, isFound: false},
              {x: 2720, y: 120, size: 50, isFound: false},
              {x: 4630, y: 390, size: 50, isFound: false}
    ]; 

    
    //Bamboo objects in array
    canyon = [{x: 200, width: 200},
              
              {x: 1040, width: 120},
              {x: 1190, width: 180},
              {x: 1400, width: 240},
              {x: 1670, width: 300},
              
              {x: 2510, width: 500}
    ];
    
    
    //Enemies objects in array & for loop
    enemies = [];
    
    //SPIDER 1
    enemies.push({
        x_pos: 30,
        y_pos: floorPos_y - 40,
        x1: 0, //100
        x2: 120, //120
        speed: 3,
        colour: {r:random(10,150),g:random(10,150),b:random(10,150)},
        display: function(){

            fill(0);
            stroke(0);

            strokeWeight(2.5);
            ellipse(this.x_pos + 40,this.y_pos + 40,30,30);
            
            //Legs
            line(this.x_pos + 50,this.y_pos + 30,this.x_pos + 70,this.y_pos + 25);
            line(this.x_pos + 50,this.y_pos + 35,this.x_pos + 70,this.y_pos + 35);
            line(this.x_pos + 50,this.y_pos + 40,this.x_pos + 70,this.y_pos + 45);
            line(this.x_pos + 70,this.y_pos + 45,this.x_pos + 80,this.y_pos + 55);

            line(this.x_pos + 40,this.y_pos + 30,this.x_pos + 10,this.y_pos + 25);
            line(this.x_pos + 30,this.y_pos + 35,this.x_pos + 10,this.y_pos + 35);
            line(this.x_pos + 30,this.y_pos + 40,this.x_pos + 10,this.y_pos + 45);
            line(this.x_pos + 10,this.y_pos + 45,this.x_pos,this.y_pos + 55);

            line(this.x_pos + 30,this.y_pos + 50,this.x_pos + 20,this.y_pos + 55);
            line(this.x_pos + 20,this.y_pos + 55,this.x_pos + 18,this.y_pos + 65);
            line(this.x_pos + 50,this.y_pos + 50,this.x_pos + 60,this.y_pos + 55);
            line(this.x_pos + 60,this.y_pos + 55,this.x_pos + 62,this.y_pos + 65);

            //ANIMATION LEGS
            //Character goes to right
            if(this.speed > 0){
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 35);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 45);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 15);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 25);
                
            //Character goes to left    
            }else{
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 15);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 25);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 35);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 45);
            }
            
            //Cross
            noStroke();
            fill(this.colour.r,this.colour.g,this.colour.b);
            rect(this.x_pos + 38,this.y_pos + 25,4,30);
            rect(this.x_pos + 25,this.y_pos + 38,30,4);
            
        
            fill(255);
            stroke(0);
            strokeWeight(2);
            
            //ANIMATION EYES
            //Character goes to right
            if(this.speed > 0){
                ellipse(this.x_pos + 34,this.y_pos + 31,12,12);
                ellipse(this.x_pos + 47,this.y_pos + 31,15,15);
                
                line(this.x_pos + 27,this.y_pos + 21,this.x_pos + 37,this.y_pos + 22);
                line(this.x_pos + 43,this.y_pos + 21,this.x_pos + 53,this.y_pos + 18);
                
            //Character goes to left    
            }else{   
                ellipse(this.x_pos + 34,this.y_pos + 31,15,15);
                ellipse(this.x_pos + 47,this.y_pos + 31,12,12);
                
                line(this.x_pos + 27,this.y_pos + 18,this.x_pos + 37,this.y_pos + 21);
                line(this.x_pos + 43,this.y_pos + 22,this.x_pos + 53,this.y_pos + 21);
            }
                
          
            //Pupils and mouth
            fill(0);
            ellipse(this.x_pos + 34,this.y_pos + 31,3,3);
            ellipse(this.x_pos + 47,this.y_pos + 31,3,3);

            fill(255, 166, 166);
            strokeWeight(1);
            arc(this.x_pos + 40, this.y_pos + 42, 15, 18, 0, PI, CHORD);

            
            //ANIMATION TOOTH
            //Character goes to right
            if(this.speed > 0){
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 45,this.y_pos + 42,
                         this.x_pos + 43,this.y_pos + 46);
                
            //Character goes to left
            }else{
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 35,this.y_pos + 42,
                         this.x_pos + 38,this.y_pos + 46);
            }
            
        },
        
        move: function(){
            //Make enemy to move
            if(this.x_pos > this.x2 || this.x_pos < this.x1){
                this.speed =  this.speed * -1;
            }
            this.x_pos = this.x_pos + this.speed;
        },
        
        checkCharCollision: function(){
            
            if(realPos + 25 > this.x_pos - 20 && realPos + 25 < this.x_pos + 100 && character.y + 70 >= floorPos_y - 15){
                playerDied();
            }
            
        }
    });
   
    
    //SPIDER 2
    enemies.push({
        x_pos: 1040,
        y_pos: floorPos_y - 40,
        x1: 1040, 
        x2: 1890, 
        speed: 6,
        colour: {r:random(10,150),g:random(10,150),b:random(10,150)},
        display: function(){

            fill(0);
            stroke(0);

            strokeWeight(2.5);
            ellipse(this.x_pos + 40,this.y_pos + 40,30,30);
            
            //Legs
            line(this.x_pos + 50,this.y_pos + 30,this.x_pos + 70,this.y_pos + 25);
            line(this.x_pos + 50,this.y_pos + 35,this.x_pos + 70,this.y_pos + 35);
            line(this.x_pos + 50,this.y_pos + 40,this.x_pos + 70,this.y_pos + 45);
            line(this.x_pos + 70,this.y_pos + 45,this.x_pos + 80,this.y_pos + 55);

            line(this.x_pos + 40,this.y_pos + 30,this.x_pos + 10,this.y_pos + 25);
            line(this.x_pos + 30,this.y_pos + 35,this.x_pos + 10,this.y_pos + 35);
            line(this.x_pos + 30,this.y_pos + 40,this.x_pos + 10,this.y_pos + 45);
            line(this.x_pos + 10,this.y_pos + 45,this.x_pos,this.y_pos + 55);

            line(this.x_pos + 30,this.y_pos + 50,this.x_pos + 20,this.y_pos + 55);
            line(this.x_pos + 20,this.y_pos + 55,this.x_pos + 18,this.y_pos + 65);
            line(this.x_pos + 50,this.y_pos + 50,this.x_pos + 60,this.y_pos + 55);
            line(this.x_pos + 60,this.y_pos + 55,this.x_pos + 62,this.y_pos + 65);

            //ANIMATION LEGS
            //Character goes to right
            if(this.speed > 0){
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 35);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 45);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 15);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 25);
                
            //Character goes to left    
            }else{
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 15);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 25);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 35);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 45);
            }
            
            //Cross
            noStroke();
            fill(this.colour.r,this.colour.g,this.colour.b);
            rect(this.x_pos + 38,this.y_pos + 25,4,30);
            rect(this.x_pos + 25,this.y_pos + 38,30,4);
            
        
            fill(255);
            stroke(0);
            strokeWeight(2);
            
            //ANIMATION EYES
            //Character goes to right
            if(this.speed > 0){
                ellipse(this.x_pos + 34,this.y_pos + 31,12,12);
                ellipse(this.x_pos + 47,this.y_pos + 31,15,15);
                
                line(this.x_pos + 27,this.y_pos + 21,this.x_pos + 37,this.y_pos + 22);
                line(this.x_pos + 43,this.y_pos + 21,this.x_pos + 53,this.y_pos + 18);
                
            //Character goes to left    
            }else{   
                ellipse(this.x_pos + 34,this.y_pos + 31,15,15);
                ellipse(this.x_pos + 47,this.y_pos + 31,12,12);
                
                line(this.x_pos + 27,this.y_pos + 18,this.x_pos + 37,this.y_pos + 21);
                line(this.x_pos + 43,this.y_pos + 22,this.x_pos + 53,this.y_pos + 21);
            }
                
          
            //Pupils and mouth
            fill(0);
            ellipse(this.x_pos + 34,this.y_pos + 31,3,3);
            ellipse(this.x_pos + 47,this.y_pos + 31,3,3);

            fill(255, 166, 166);
            strokeWeight(1);
            arc(this.x_pos + 40, this.y_pos + 42, 15, 18, 0, PI, CHORD);

            
            //ANIMATION TOOTH
            //Character goes to right
            if(this.speed > 0){
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 45,this.y_pos + 42,
                         this.x_pos + 43,this.y_pos + 46);
                
            //Character goes to left
            }else{
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 35,this.y_pos + 42,
                         this.x_pos + 38,this.y_pos + 46);
            }
            
        },
        
        move: function(){
            //Make enemy to move
            if(this.x_pos > this.x2 || this.x_pos < this.x1){
                this.speed =  this.speed * -1;
            }
            this.x_pos = this.x_pos + this.speed;
        },
        
        checkCharCollision: function(){
            
            if(realPos + 25 > this.x_pos - 20 && realPos + 25 < this.x_pos + 100 && character.y + 70 >= floorPos_y - 15){
                playerDied();
            }
            
        }
    });
    
    
    //SPIDER 3
    enemies.push({
        x_pos: 2720,
        y_pos: 200,
        y1: 100, 
        y2: 476, 
        speed: 5,
        colour: {r:random(10,150),g:random(10,150),b:random(10,150)},
        display: function(){

            fill(0);
            stroke(0);

            strokeWeight(2.5);
            ellipse(this.x_pos + 40,this.y_pos + 40,30,30);
            
            //Legs
            line(this.x_pos + 50,this.y_pos + 30,this.x_pos + 70,this.y_pos + 25);
            line(this.x_pos + 50,this.y_pos + 35,this.x_pos + 70,this.y_pos + 35);
            line(this.x_pos + 50,this.y_pos + 40,this.x_pos + 70,this.y_pos + 45);
            line(this.x_pos + 70,this.y_pos + 45,this.x_pos + 80,this.y_pos + 55);

            line(this.x_pos + 40,this.y_pos + 30,this.x_pos + 10,this.y_pos + 25);
            line(this.x_pos + 30,this.y_pos + 35,this.x_pos + 10,this.y_pos + 35);
            line(this.x_pos + 30,this.y_pos + 40,this.x_pos + 10,this.y_pos + 45);
            line(this.x_pos + 10,this.y_pos + 45,this.x_pos,this.y_pos + 55);

            line(this.x_pos + 30,this.y_pos + 50,this.x_pos + 20,this.y_pos + 55);
            line(this.x_pos + 20,this.y_pos + 55,this.x_pos + 18,this.y_pos + 65);
            line(this.x_pos + 50,this.y_pos + 50,this.x_pos + 60,this.y_pos + 55);
            line(this.x_pos + 60,this.y_pos + 55,this.x_pos + 62,this.y_pos + 65);

            //ANIMATION LEGS
            //Character goes to right
            if(this.speed > 0){
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 35);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 45);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 15);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 25);
                
            //Character goes to left    
            }else{
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 15);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 25);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 35);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 45);
            }
            
            //Cross
            noStroke();
            fill(this.colour.r,this.colour.g,this.colour.b);
            rect(this.x_pos + 38,this.y_pos + 25,4,30);
            rect(this.x_pos + 25,this.y_pos + 38,30,4);
            
        
            fill(255);
            stroke(0);
            strokeWeight(2);
            
            //ANIMATION EYES
            //Character goes to right
            if(this.speed > 0){
                ellipse(this.x_pos + 34,this.y_pos + 31,12,12);
                ellipse(this.x_pos + 47,this.y_pos + 31,15,15);
                
                line(this.x_pos + 27,this.y_pos + 21,this.x_pos + 37,this.y_pos + 22);
                line(this.x_pos + 43,this.y_pos + 21,this.x_pos + 53,this.y_pos + 18);
                
            //Character goes to left    
            }else{   
                ellipse(this.x_pos + 34,this.y_pos + 31,15,15);
                ellipse(this.x_pos + 47,this.y_pos + 31,12,12);
                
                line(this.x_pos + 27,this.y_pos + 18,this.x_pos + 37,this.y_pos + 21);
                line(this.x_pos + 43,this.y_pos + 22,this.x_pos + 53,this.y_pos + 21);
            }
                
          
            //Pupils and mouth
            fill(0);
            ellipse(this.x_pos + 34,this.y_pos + 31,3,3);
            ellipse(this.x_pos + 47,this.y_pos + 31,3,3);

            fill(255, 166, 166);
            strokeWeight(1);
            arc(this.x_pos + 40, this.y_pos + 42, 15, 18, 0, PI, CHORD);

            
            //ANIMATION TOOTH
            //Character goes to right
            if(this.speed > 0){
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 45,this.y_pos + 42,
                         this.x_pos + 43,this.y_pos + 46);
                
            //Character goes to left
            }else{
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 35,this.y_pos + 42,
                         this.x_pos + 38,this.y_pos + 46);
            }
            
        },
        
        move: function(){
            //Make enemy to move
            if(this.y_pos > this.y2 || this.y_pos < this.y1){
                this.speed =  this.speed * -1;
            }
            this.y_pos = this.y_pos + this.speed;
        },
        
        checkCharCollision: function(){
            
            if(realPos + 25 > this.x_pos - 20 && realPos + 25 < this.x_pos + 100 && 
               character.y + 50 >= this.y_pos && character.y + 50 <= this.y_pos + 70){
                playerDied();
            }
            
        }
    });
    
    
    //SPIDER 4
    enemies.push({
        x_pos: 3500,
        y_pos: floorPos_y - 40,
        x1: 3470, 
        x2: 4375, 
        speed: 2,
        colour: {r:random(10,150),g:random(10,150),b:random(10,150)},
        display: function(){

            fill(0);
            stroke(0);

            strokeWeight(2.5);
            ellipse(this.x_pos + 40,this.y_pos + 40,30,30);
            
            //Legs
            line(this.x_pos + 50,this.y_pos + 30,this.x_pos + 70,this.y_pos + 25);
            line(this.x_pos + 50,this.y_pos + 35,this.x_pos + 70,this.y_pos + 35);
            line(this.x_pos + 50,this.y_pos + 40,this.x_pos + 70,this.y_pos + 45);
            line(this.x_pos + 70,this.y_pos + 45,this.x_pos + 80,this.y_pos + 55);

            line(this.x_pos + 40,this.y_pos + 30,this.x_pos + 10,this.y_pos + 25);
            line(this.x_pos + 30,this.y_pos + 35,this.x_pos + 10,this.y_pos + 35);
            line(this.x_pos + 30,this.y_pos + 40,this.x_pos + 10,this.y_pos + 45);
            line(this.x_pos + 10,this.y_pos + 45,this.x_pos,this.y_pos + 55);

            line(this.x_pos + 30,this.y_pos + 50,this.x_pos + 20,this.y_pos + 55);
            line(this.x_pos + 20,this.y_pos + 55,this.x_pos + 18,this.y_pos + 65);
            line(this.x_pos + 50,this.y_pos + 50,this.x_pos + 60,this.y_pos + 55);
            line(this.x_pos + 60,this.y_pos + 55,this.x_pos + 62,this.y_pos + 65);

            //ANIMATION LEGS
            //Character goes to right
            if(this.speed > 0){
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 35);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 45);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 15);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 25);
                
            //Character goes to left    
            }else{
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 15);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 25);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 35);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 45);
            }
            
            //Cross
            noStroke();
            fill(this.colour.r,this.colour.g,this.colour.b);
            rect(this.x_pos + 38,this.y_pos + 25,4,30);
            rect(this.x_pos + 25,this.y_pos + 38,30,4);
            
        
            fill(255);
            stroke(0);
            strokeWeight(2);
            
            //ANIMATION EYES
            //Character goes to right
            if(this.speed > 0){
                ellipse(this.x_pos + 34,this.y_pos + 31,12,12);
                ellipse(this.x_pos + 47,this.y_pos + 31,15,15);
                
                line(this.x_pos + 27,this.y_pos + 21,this.x_pos + 37,this.y_pos + 22);
                line(this.x_pos + 43,this.y_pos + 21,this.x_pos + 53,this.y_pos + 18);
                
            //Character goes to left    
            }else{   
                ellipse(this.x_pos + 34,this.y_pos + 31,15,15);
                ellipse(this.x_pos + 47,this.y_pos + 31,12,12);
                
                line(this.x_pos + 27,this.y_pos + 18,this.x_pos + 37,this.y_pos + 21);
                line(this.x_pos + 43,this.y_pos + 22,this.x_pos + 53,this.y_pos + 21);
            }
                
          
            //Pupils and mouth
            fill(0);
            ellipse(this.x_pos + 34,this.y_pos + 31,3,3);
            ellipse(this.x_pos + 47,this.y_pos + 31,3,3);

            fill(255, 166, 166);
            strokeWeight(1);
            arc(this.x_pos + 40, this.y_pos + 42, 15, 18, 0, PI, CHORD);

            
            //ANIMATION TOOTH
            //Character goes to right
            if(this.speed > 0){
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 45,this.y_pos + 42,
                         this.x_pos + 43,this.y_pos + 46);
                
            //Character goes to left
            }else{
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 35,this.y_pos + 42,
                         this.x_pos + 38,this.y_pos + 46);
            }
            
        },
        
        move: function(){
            //Make enemy to move
            if(this.x_pos > this.x2 || this.x_pos < this.x1){
                this.speed =  this.speed * -1;
            }
            this.x_pos = this.x_pos + this.speed;
        },
        
        checkCharCollision: function(){
            
            if(realPos + 25 > this.x_pos - 20 && realPos + 25 < this.x_pos + 100 && character.y + 70 >= floorPos_y - 15){
                playerDied();
            }
            
        }
    });
    
    
    //SPIDER 5
    enemies.push({
        x_pos: 4000,
        y_pos: floorPos_y - 40,
        x1: 3470, 
        x2: 4375, 
        speed: 2,
        colour: {r:random(10,150),g:random(10,150),b:random(10,150)},
        display: function(){

            fill(0);
            stroke(0);

            strokeWeight(2.5);
            ellipse(this.x_pos + 40,this.y_pos + 40,30,30);
            
            //Legs
            line(this.x_pos + 50,this.y_pos + 30,this.x_pos + 70,this.y_pos + 25);
            line(this.x_pos + 50,this.y_pos + 35,this.x_pos + 70,this.y_pos + 35);
            line(this.x_pos + 50,this.y_pos + 40,this.x_pos + 70,this.y_pos + 45);
            line(this.x_pos + 70,this.y_pos + 45,this.x_pos + 80,this.y_pos + 55);

            line(this.x_pos + 40,this.y_pos + 30,this.x_pos + 10,this.y_pos + 25);
            line(this.x_pos + 30,this.y_pos + 35,this.x_pos + 10,this.y_pos + 35);
            line(this.x_pos + 30,this.y_pos + 40,this.x_pos + 10,this.y_pos + 45);
            line(this.x_pos + 10,this.y_pos + 45,this.x_pos,this.y_pos + 55);

            line(this.x_pos + 30,this.y_pos + 50,this.x_pos + 20,this.y_pos + 55);
            line(this.x_pos + 20,this.y_pos + 55,this.x_pos + 18,this.y_pos + 65);
            line(this.x_pos + 50,this.y_pos + 50,this.x_pos + 60,this.y_pos + 55);
            line(this.x_pos + 60,this.y_pos + 55,this.x_pos + 62,this.y_pos + 65);

            //ANIMATION LEGS
            //Character goes to right
            if(this.speed > 0){
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 35);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 45);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 15);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 25);
                
            //Character goes to left    
            }else{
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 15);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 25);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 35);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 45);
            }
            
            //Cross
            noStroke();
            fill(this.colour.r,this.colour.g,this.colour.b);
            rect(this.x_pos + 38,this.y_pos + 25,4,30);
            rect(this.x_pos + 25,this.y_pos + 38,30,4);
            
        
            fill(255);
            stroke(0);
            strokeWeight(2);
            
            //ANIMATION EYES
            //Character goes to right
            if(this.speed > 0){
                ellipse(this.x_pos + 34,this.y_pos + 31,12,12);
                ellipse(this.x_pos + 47,this.y_pos + 31,15,15);
                
                line(this.x_pos + 27,this.y_pos + 21,this.x_pos + 37,this.y_pos + 22);
                line(this.x_pos + 43,this.y_pos + 21,this.x_pos + 53,this.y_pos + 18);
                
            //Character goes to left    
            }else{   
                ellipse(this.x_pos + 34,this.y_pos + 31,15,15);
                ellipse(this.x_pos + 47,this.y_pos + 31,12,12);
                
                line(this.x_pos + 27,this.y_pos + 18,this.x_pos + 37,this.y_pos + 21);
                line(this.x_pos + 43,this.y_pos + 22,this.x_pos + 53,this.y_pos + 21);
            }
                
          
            //Pupils and mouth
            fill(0);
            ellipse(this.x_pos + 34,this.y_pos + 31,3,3);
            ellipse(this.x_pos + 47,this.y_pos + 31,3,3);

            fill(255, 166, 166);
            strokeWeight(1);
            arc(this.x_pos + 40, this.y_pos + 42, 15, 18, 0, PI, CHORD);

            
            //ANIMATION TOOTH
            //Character goes to right
            if(this.speed > 0){
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 45,this.y_pos + 42,
                         this.x_pos + 43,this.y_pos + 46);
                
            //Character goes to left
            }else{
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 35,this.y_pos + 42,
                         this.x_pos + 38,this.y_pos + 46);
            }
            
        },
        
        move: function(){
            //Make enemy to move
            if(this.x_pos > this.x2 || this.x_pos < this.x1){
                this.speed =  this.speed * -1;
            }
            this.x_pos = this.x_pos + this.speed;
        },
        
        checkCharCollision: function(){
            
            if(realPos + 25 > this.x_pos - 20 && realPos + 25 < this.x_pos + 100 && character.y + 70 >= floorPos_y - 15){
                playerDied();
            }
            
        }
    });
    
    
    //SPIDER 6
    enemies.push({
        x_pos: 3700,
        y_pos: floorPos_y - 40,
        x1: 3470, 
        x2: 4375, 
        speed: 2,
        colour: {r:random(10,150),g:random(10,150),b:random(10,150)},
        display: function(){

            fill(0);
            stroke(0);

            strokeWeight(2.5);
            ellipse(this.x_pos + 40,this.y_pos + 40,30,30);
            
            //Legs
            line(this.x_pos + 50,this.y_pos + 30,this.x_pos + 70,this.y_pos + 25);
            line(this.x_pos + 50,this.y_pos + 35,this.x_pos + 70,this.y_pos + 35);
            line(this.x_pos + 50,this.y_pos + 40,this.x_pos + 70,this.y_pos + 45);
            line(this.x_pos + 70,this.y_pos + 45,this.x_pos + 80,this.y_pos + 55);

            line(this.x_pos + 40,this.y_pos + 30,this.x_pos + 10,this.y_pos + 25);
            line(this.x_pos + 30,this.y_pos + 35,this.x_pos + 10,this.y_pos + 35);
            line(this.x_pos + 30,this.y_pos + 40,this.x_pos + 10,this.y_pos + 45);
            line(this.x_pos + 10,this.y_pos + 45,this.x_pos,this.y_pos + 55);

            line(this.x_pos + 30,this.y_pos + 50,this.x_pos + 20,this.y_pos + 55);
            line(this.x_pos + 20,this.y_pos + 55,this.x_pos + 18,this.y_pos + 65);
            line(this.x_pos + 50,this.y_pos + 50,this.x_pos + 60,this.y_pos + 55);
            line(this.x_pos + 60,this.y_pos + 55,this.x_pos + 62,this.y_pos + 65);

            //ANIMATION LEGS
            //Character goes to right
            if(this.speed > 0){
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 35);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 45);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 15);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 25);
                
            //Character goes to left    
            }else{
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 15);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 25);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 35);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 45);
            }
            
            //Cross
            noStroke();
            fill(this.colour.r,this.colour.g,this.colour.b);
            rect(this.x_pos + 38,this.y_pos + 25,4,30);
            rect(this.x_pos + 25,this.y_pos + 38,30,4);
            
        
            fill(255);
            stroke(0);
            strokeWeight(2);
            
            //ANIMATION EYES
            //Character goes to right
            if(this.speed > 0){
                ellipse(this.x_pos + 34,this.y_pos + 31,12,12);
                ellipse(this.x_pos + 47,this.y_pos + 31,15,15);
                
                line(this.x_pos + 27,this.y_pos + 21,this.x_pos + 37,this.y_pos + 22);
                line(this.x_pos + 43,this.y_pos + 21,this.x_pos + 53,this.y_pos + 18);
                
            //Character goes to left    
            }else{   
                ellipse(this.x_pos + 34,this.y_pos + 31,15,15);
                ellipse(this.x_pos + 47,this.y_pos + 31,12,12);
                
                line(this.x_pos + 27,this.y_pos + 18,this.x_pos + 37,this.y_pos + 21);
                line(this.x_pos + 43,this.y_pos + 22,this.x_pos + 53,this.y_pos + 21);
            }
                
          
            //Pupils and mouth
            fill(0);
            ellipse(this.x_pos + 34,this.y_pos + 31,3,3);
            ellipse(this.x_pos + 47,this.y_pos + 31,3,3);

            fill(255, 166, 166);
            strokeWeight(1);
            arc(this.x_pos + 40, this.y_pos + 42, 15, 18, 0, PI, CHORD);

            
            //ANIMATION TOOTH
            //Character goes to right
            if(this.speed > 0){
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 45,this.y_pos + 42,
                         this.x_pos + 43,this.y_pos + 46);
                
            //Character goes to left
            }else{
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 35,this.y_pos + 42,
                         this.x_pos + 38,this.y_pos + 46);
            }
            
        },
        
        move: function(){
            //Make enemy to move
            if(this.x_pos > this.x2 || this.x_pos < this.x1){
                this.speed =  this.speed * -1;
            }
            this.x_pos = this.x_pos + this.speed;
        },
        
        checkCharCollision: function(){
            
            if(realPos + 25 > this.x_pos - 20 && realPos + 25 < this.x_pos + 100 && character.y + 70 >= floorPos_y - 15){
                playerDied();
            }
            
        }
    });
    
    //SPIDER 7
    enemies.push({
        x_pos: 3800,
        y_pos: floorPos_y - 40,
        x1: 3470, 
        x2: 4375, 
        speed: 2.5,
        colour: {r:random(10,150),g:random(10,150),b:random(10,150)},
        display: function(){

            fill(0);
            stroke(0);

            strokeWeight(2.5);
            ellipse(this.x_pos + 40,this.y_pos + 40,30,30);
            
            //Legs
            line(this.x_pos + 50,this.y_pos + 30,this.x_pos + 70,this.y_pos + 25);
            line(this.x_pos + 50,this.y_pos + 35,this.x_pos + 70,this.y_pos + 35);
            line(this.x_pos + 50,this.y_pos + 40,this.x_pos + 70,this.y_pos + 45);
            line(this.x_pos + 70,this.y_pos + 45,this.x_pos + 80,this.y_pos + 55);

            line(this.x_pos + 40,this.y_pos + 30,this.x_pos + 10,this.y_pos + 25);
            line(this.x_pos + 30,this.y_pos + 35,this.x_pos + 10,this.y_pos + 35);
            line(this.x_pos + 30,this.y_pos + 40,this.x_pos + 10,this.y_pos + 45);
            line(this.x_pos + 10,this.y_pos + 45,this.x_pos,this.y_pos + 55);

            line(this.x_pos + 30,this.y_pos + 50,this.x_pos + 20,this.y_pos + 55);
            line(this.x_pos + 20,this.y_pos + 55,this.x_pos + 18,this.y_pos + 65);
            line(this.x_pos + 50,this.y_pos + 50,this.x_pos + 60,this.y_pos + 55);
            line(this.x_pos + 60,this.y_pos + 55,this.x_pos + 62,this.y_pos + 65);

            //ANIMATION LEGS
            //Character goes to right
            if(this.speed > 0){
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 35);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 45);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 15);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 25);
                
            //Character goes to left    
            }else{
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 15);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 25);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 35);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 45);
            }
            
            //Cross
            noStroke();
            fill(this.colour.r,this.colour.g,this.colour.b);
            rect(this.x_pos + 38,this.y_pos + 25,4,30);
            rect(this.x_pos + 25,this.y_pos + 38,30,4);
            
        
            fill(255);
            stroke(0);
            strokeWeight(2);
            
            //ANIMATION EYES
            //Character goes to right
            if(this.speed > 0){
                ellipse(this.x_pos + 34,this.y_pos + 31,12,12);
                ellipse(this.x_pos + 47,this.y_pos + 31,15,15);
                
                line(this.x_pos + 27,this.y_pos + 21,this.x_pos + 37,this.y_pos + 22);
                line(this.x_pos + 43,this.y_pos + 21,this.x_pos + 53,this.y_pos + 18);
                
            //Character goes to left    
            }else{   
                ellipse(this.x_pos + 34,this.y_pos + 31,15,15);
                ellipse(this.x_pos + 47,this.y_pos + 31,12,12);
                
                line(this.x_pos + 27,this.y_pos + 18,this.x_pos + 37,this.y_pos + 21);
                line(this.x_pos + 43,this.y_pos + 22,this.x_pos + 53,this.y_pos + 21);
            }
                
          
            //Pupils and mouth
            fill(0);
            ellipse(this.x_pos + 34,this.y_pos + 31,3,3);
            ellipse(this.x_pos + 47,this.y_pos + 31,3,3);

            fill(255, 166, 166);
            strokeWeight(1);
            arc(this.x_pos + 40, this.y_pos + 42, 15, 18, 0, PI, CHORD);

            
            //ANIMATION TOOTH
            //Character goes to right
            if(this.speed > 0){
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 45,this.y_pos + 42,
                         this.x_pos + 43,this.y_pos + 46);
                
            //Character goes to left
            }else{
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 35,this.y_pos + 42,
                         this.x_pos + 38,this.y_pos + 46);
            }
            
        },
        
        move: function(){
            //Make enemy to move
            if(this.x_pos > this.x2 || this.x_pos < this.x1){
                this.speed =  this.speed * -1;
            }
            this.x_pos = this.x_pos + this.speed;
        },
        
        checkCharCollision: function(){
            
            if(realPos + 25 > this.x_pos - 20 && realPos + 25 < this.x_pos + 100 && character.y + 70 >= floorPos_y - 15){
                playerDied();
            }
            
        }
    });
    
    
    //SPIDER 8
    enemies.push({
        x_pos: 4100,
        y_pos: floorPos_y - 40,
        x1: 3470, 
        x2: 4375, 
        speed: 2.5,
        colour: {r:random(10,150),g:random(10,150),b:random(10,150)},
        display: function(){

            fill(0);
            stroke(0);

            strokeWeight(2.5);
            ellipse(this.x_pos + 40,this.y_pos + 40,30,30);
            
            //Legs
            line(this.x_pos + 50,this.y_pos + 30,this.x_pos + 70,this.y_pos + 25);
            line(this.x_pos + 50,this.y_pos + 35,this.x_pos + 70,this.y_pos + 35);
            line(this.x_pos + 50,this.y_pos + 40,this.x_pos + 70,this.y_pos + 45);
            line(this.x_pos + 70,this.y_pos + 45,this.x_pos + 80,this.y_pos + 55);

            line(this.x_pos + 40,this.y_pos + 30,this.x_pos + 10,this.y_pos + 25);
            line(this.x_pos + 30,this.y_pos + 35,this.x_pos + 10,this.y_pos + 35);
            line(this.x_pos + 30,this.y_pos + 40,this.x_pos + 10,this.y_pos + 45);
            line(this.x_pos + 10,this.y_pos + 45,this.x_pos,this.y_pos + 55);

            line(this.x_pos + 30,this.y_pos + 50,this.x_pos + 20,this.y_pos + 55);
            line(this.x_pos + 20,this.y_pos + 55,this.x_pos + 18,this.y_pos + 65);
            line(this.x_pos + 50,this.y_pos + 50,this.x_pos + 60,this.y_pos + 55);
            line(this.x_pos + 60,this.y_pos + 55,this.x_pos + 62,this.y_pos + 65);

            //ANIMATION LEGS
            //Character goes to right
            if(this.speed > 0){
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 35);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 45);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 15);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 25);
                
            //Character goes to left    
            }else{
                line(this.x_pos + 10,this.y_pos + 25,this.x_pos,this.y_pos + 15);
                line(this.x_pos + 10,this.y_pos + 35,this.x_pos,this.y_pos + 25);
                
                line(this.x_pos + 70,this.y_pos + 25,this.x_pos + 80,this.y_pos + 35);
                line(this.x_pos + 70,this.y_pos + 35,this.x_pos + 80,this.y_pos + 45);
            }
            
            //Cross
            noStroke();
            fill(this.colour.r,this.colour.g,this.colour.b);
            rect(this.x_pos + 38,this.y_pos + 25,4,30);
            rect(this.x_pos + 25,this.y_pos + 38,30,4);
            
        
            fill(255);
            stroke(0);
            strokeWeight(2);
            
            //ANIMATION EYES
            //Character goes to right
            if(this.speed > 0){
                ellipse(this.x_pos + 34,this.y_pos + 31,12,12);
                ellipse(this.x_pos + 47,this.y_pos + 31,15,15);
                
                line(this.x_pos + 27,this.y_pos + 21,this.x_pos + 37,this.y_pos + 22);
                line(this.x_pos + 43,this.y_pos + 21,this.x_pos + 53,this.y_pos + 18);
                
            //Character goes to left    
            }else{   
                ellipse(this.x_pos + 34,this.y_pos + 31,15,15);
                ellipse(this.x_pos + 47,this.y_pos + 31,12,12);
                
                line(this.x_pos + 27,this.y_pos + 18,this.x_pos + 37,this.y_pos + 21);
                line(this.x_pos + 43,this.y_pos + 22,this.x_pos + 53,this.y_pos + 21);
            }
                
          
            //Pupils and mouth
            fill(0);
            ellipse(this.x_pos + 34,this.y_pos + 31,3,3);
            ellipse(this.x_pos + 47,this.y_pos + 31,3,3);

            fill(255, 166, 166);
            strokeWeight(1);
            arc(this.x_pos + 40, this.y_pos + 42, 15, 18, 0, PI, CHORD);

            
            //ANIMATION TOOTH
            //Character goes to right
            if(this.speed > 0){
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 45,this.y_pos + 42,
                         this.x_pos + 43,this.y_pos + 46);
                
            //Character goes to left
            }else{
                fill(255);
                triangle(this.x_pos + 40,this.y_pos + 42,
                         this.x_pos + 35,this.y_pos + 42,
                         this.x_pos + 38,this.y_pos + 46);
            }
            
        },
        
        move: function(){
            //Make enemy to move
            if(this.x_pos > this.x2 || this.x_pos < this.x1){
                this.speed =  this.speed * -1;
            }
            this.x_pos = this.x_pos + this.speed;
        },
        
        checkCharCollision: function(){
            
            if(realPos + 25 > this.x_pos - 20 && realPos + 25 < this.x_pos + 100 && character.y + 70 >= floorPos_y - 15){
                playerDied();
            }
            
        }
    });
    
    
    //Platforms
    isOnPlatform = false;
    platforms = [];
    
    
    //First platform
    platforms.push({
        x_pos: 850,
        y_pos: floorPos_y - 68,
        width: 120, //Multiples of 30 only!
        height: 15,
        display: function(){
            // Draw platform.
            fill(36, 128, 26);
            stroke(0);
            rect(this.x_pos, this.y_pos, this.width - 1, this.height);
            fill(82, 43, 16);noStroke();
            rect(this.x_pos, this.y_pos + 10, this.width, this.height);
        
            //Triangles
            var trianglesBase = this.width / 30;
            for(var i = 0; i < trianglesBase; i++){
                triangle(this.x_pos + 30 * i,this.y_pos + 10 + 15,
                         this.x_pos + 30 + 30 * i, this.y_pos + 10 + 15,
                         this.x_pos + 15 + 30 * i, this.y_pos + 10 + 30);
            }
            
        },
        
        checkCharOn: function(){
            
            if(realPos + 25 > this.x_pos && realPos + 25 < this.x_pos + this.width 
               && character.y + 70 == this.y_pos - 4){
                
                isOnPlatform = true;
                
            }
             
        }
        
    });
    
    
    //Second platform
    platforms.push({
        x_pos: 1000,
        y_pos: floorPos_y - 79 * 2,
        width: 90, //Multiples of 30 only!
        height: 15,
        display: function(){
            // Draw platform.
            fill(36, 128, 26);
            stroke(0);
            rect(this.x_pos, this.y_pos, this.width - 1, this.height);
            fill(82, 43, 16);noStroke();
            rect(this.x_pos, this.y_pos + 10, this.width, this.height);
        
            //Triangles
            var trianglesBase = this.width / 30;
            for(var i = 0; i < trianglesBase; i++){
                triangle(this.x_pos + 30 * i,this.y_pos + 10 + 15,
                         this.x_pos + 30 + 30 * i, this.y_pos + 10 + 15,
                         this.x_pos + 15 + 30 * i, this.y_pos + 10 + 30);
            }
            
        },
        
        checkCharOn: function(){
            
            if(realPos + 25 > this.x_pos && realPos + 25 < this.x_pos + this.width 
               && character.y + 70 == this.y_pos - 4){
                
                isOnPlatform = true;
                
            }
             
        }
        
    });
    
    
    //Third platform
    platforms.push({
        x_pos: 880,
        y_pos: floorPos_y - 79 * 3 - 5,
        width: 60, //Multiples of 30 only!
        height: 15,
        display: function(){
            // Draw platform.
            fill(36, 128, 26);
            stroke(0);
            rect(this.x_pos, this.y_pos, this.width - 1, this.height);
            fill(82, 43, 16);noStroke();
            rect(this.x_pos, this.y_pos + 10, this.width, this.height);
        
            //Triangles
            var trianglesBase = this.width / 30;
            for(var i = 0; i < trianglesBase; i++){
                triangle(this.x_pos + 30 * i,this.y_pos + 10 + 15,
                         this.x_pos + 30 + 30 * i, this.y_pos + 10 + 15,
                         this.x_pos + 15 + 30 * i, this.y_pos + 10 + 30);
            }
            
        },
        
        checkCharOn: function(){
            
            if(realPos + 25 > this.x_pos && realPos + 25 < this.x_pos + this.width 
               && character.y + 70 == this.y_pos - 4){
                
                isOnPlatform = true;
                
            }
             
        }
        
    });
    
    
    //Forth platform
    platforms.push({
        x_pos: 2530,
        y_pos: floorPos_y - 50,
        width: 60, //Multiples of 30 only!
        height: 15,
        display: function(){
            // Draw platform.
            fill(36, 128, 26);
            stroke(0);
            rect(this.x_pos, this.y_pos, this.width - 1, this.height);
            fill(82, 43, 16);noStroke();
            rect(this.x_pos, this.y_pos + 10, this.width, this.height);
        
            //Triangles
            var trianglesBase = this.width / 30;
            for(var i = 0; i < trianglesBase; i++){
                triangle(this.x_pos + 30 * i,this.y_pos + 10 + 15,
                         this.x_pos + 30 + 30 * i, this.y_pos + 10 + 15,
                         this.x_pos + 15 + 30 * i, this.y_pos + 10 + 30);
            }
            
        },
        
        checkCharOn: function(){
            
            if(realPos + 25 > this.x_pos && realPos + 25 < this.x_pos + this.width 
               && character.y + 70 == this.y_pos - 4){
                
                isOnPlatform = true;
                
            }
             
        }
        
    });
    
    
    //Fifth platform
    platforms.push({
        x_pos: 2620,
        y_pos: floorPos_y - 122,
        width: 60, //Multiples of 30 only!
        height: 15,
        display: function(){
            // Draw platform.
            fill(36, 128, 26);
            stroke(0);
            rect(this.x_pos, this.y_pos, this.width - 1, this.height);
            fill(82, 43, 16);noStroke();
            rect(this.x_pos, this.y_pos + 10, this.width, this.height);
        
            //Triangles
            var trianglesBase = this.width / 30;
            for(var i = 0; i < trianglesBase; i++){
                triangle(this.x_pos + 30 * i,this.y_pos + 10 + 15,
                         this.x_pos + 30 + 30 * i, this.y_pos + 10 + 15,
                         this.x_pos + 15 + 30 * i, this.y_pos + 10 + 30);
            }
            
        },
        
        checkCharOn: function(){
            
            if(realPos + 25 > this.x_pos && realPos + 25 < this.x_pos + this.width 
               && character.y + 70 == this.y_pos - 4){
                
                isOnPlatform = true;
                
            }
             
        }
        
    });
    
    
    //Sixth platform
    platforms.push({
        x_pos: 2840,
        y_pos: floorPos_y - 122,
        width: 60, //Multiples of 30 only!
        height: 15,
        display: function(){
            // Draw platform.
            fill(36, 128, 26);
            stroke(0);
            rect(this.x_pos, this.y_pos, this.width - 1, this.height);
            fill(82, 43, 16);noStroke();
            rect(this.x_pos, this.y_pos + 10, this.width, this.height);
        
            //Triangles
            var trianglesBase = this.width / 30;
            for(var i = 0; i < trianglesBase; i++){
                triangle(this.x_pos + 30 * i,this.y_pos + 10 + 15,
                         this.x_pos + 30 + 30 * i, this.y_pos + 10 + 15,
                         this.x_pos + 15 + 30 * i, this.y_pos + 10 + 30);
            }
            
        },
        
        checkCharOn: function(){
            
            if(realPos + 25 > this.x_pos && realPos + 25 < this.x_pos + this.width 
               && character.y + 70 == this.y_pos - 4){
                
                isOnPlatform = true;
                
            }
             
        }
        
    });
    
    
    //Seventh platform
    platforms.push({
        x_pos: 2930,
        y_pos: floorPos_y - 50,
        width: 60, //Multiples of 30 only!
        height: 15,
        display: function(){
            // Draw platform.
            fill(36, 128, 26);
            stroke(0);
            rect(this.x_pos, this.y_pos, this.width - 1, this.height);
            fill(82, 43, 16);noStroke();
            rect(this.x_pos, this.y_pos + 10, this.width, this.height);
        
            //Triangles
            var trianglesBase = this.width / 30;
            for(var i = 0; i < trianglesBase; i++){
                triangle(this.x_pos + 30 * i,this.y_pos + 10 + 15,
                         this.x_pos + 30 + 30 * i, this.y_pos + 10 + 15,
                         this.x_pos + 15 + 30 * i, this.y_pos + 10 + 30);
            }
            
        },
        
        checkCharOn: function(){
            
            if(realPos + 25 > this.x_pos && realPos + 25 < this.x_pos + this.width 
               && character.y + 70 == this.y_pos - 4){
                
                isOnPlatform = true;
                
            }
             
        }
        
    });
    
    
}



// ---------------------------------
// Checks when player dies
// ---------------------------------
function checkPlayerDie(){
    
    if(character.y > 576){ // The character has fallen below the canvas
        
        playerDied();
        
    }
    
}

function playerDied(){
    
    lives -= 1; //Decreses lives every time falls

    if(lives >= 0){ //Can restart the game IF lives are more than 0
        startGame(); 

    }else{
        isLost = true; //NO more lives, GAME OVER

    }
    
}



// ---------------------------------
// Go to next level
// ---------------------------------
function nextLevel(){
    // DO NOT CHANGE THIS FUNCTION!
    console.log('next level');
}
