import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MapSizeService } from '../service/map-size.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  //Boards
  smallBoard:boolean = true;
  mediumBoard:boolean = false;

  //default fields
  fieldsSmall: any = Array(9).fill(0);
  fieldsMedium: any = Array(25).fill(0);
  fieldsLarge: any = Array(100).fill(0);

   //placed marker arrays
   fieldsOfFirstPlayer:Array<Array<number>> = [];
   fieldsOfSecondPlayer:Array<Array<number>> = [];

   //First or Second player
   firstPlayerTurn:boolean = false;

   //Player Names
   firstPlayerName:string = '';
   secondPlayerName:string = '';
   

   // chances Of Winning
   chanceOfWinning: Array<any> = [];

   //who is the winner
    winnerFirstPlayer:boolean = false;
    winnerSecondPlayer:boolean = false;
    gameIsOver:boolean = false;

    //Winner Medium Board
    winnerFirstPlayerMediumBoard: boolean = false;
    winnerSecondPlayerMediumBoard: boolean = false;
    winnerThirdPlayerMediumBoard: boolean = false;

    //winning counter
    firstPlayerWonCounter:number = 0;
    secondPlayerWonCounter:number = 0;

    //Players object
    playersObject:any;

    //three player?-------------------------------------------->
    threePlayerGame:boolean = false;
    thirdPlayerName:string = '';
    fieldsOfThirdPlayer:Array<Array<number>> = [];
    winnerThirdPlayer:boolean = false;
    thirdPlayerWonCounter:number = 0;

    //Who is the next player
    whoIsTheNextPlayer:Array<string>;
    indexOfPlayersArray:number = 0;

    //current player
    currentPlayer:string;


   
  
  constructor(
    private mapSizeService: MapSizeService
  ) { }

  ngOnInit(): void {
    this.mapSizeService.mapSize.subscribe(
      (playersObj) => {console.log(playersObj)
        if(playersObj.map === 'small') {
          this.createSmallBoard(playersObj);
          this.playersObject = playersObj;
          this.firstPlayerName = playersObj.firstPlayerName;
          this.secondPlayerName = playersObj.secondPlayerName;
        }
        
        if(playersObj.map === 'medium') {
          this.createMediumBoard(playersObj);
          this.playersObject = playersObj;
          this.firstPlayerName = playersObj.firstPlayerName;
          this.secondPlayerName = playersObj.secondPlayerName;
        }

        if(playersObj.map === 'large') {
          this.createLargeBoard(playersObj);
          this.playersObject = playersObj;
          this.firstPlayerName = playersObj.firstPlayerName;
          this.secondPlayerName = playersObj.secondPlayerName;
        }
        
        if(playersObj.thirdPlayerName !== "" && playersObj.thirdPalyerselectedIcon !== "") {
          this.threePlayerGame = true;
          this.thirdPlayerName = playersObj.thirdPlayerName;
          this.whoIsTheNextPlayer = [this.firstPlayerName, this.secondPlayerName, this.thirdPlayerName];
          this.currentPlayer = this.firstPlayerName;
          
          console.log(this.currentPlayer);
        }

      },
      (err) => {console.log(err)},
    )
  }

  //-----------------Similar functions-------------

  //New Game function
  createNewGame = () => {
    if(this.playersObject.map === "small") {
      this.createANewSmallGame()
    }else if(this.playersObject.map === "medium") {
      this.createANewMediumGame();
    }
  } 

  //Array cutter
  chunkArray = (myArray, chunk_size) =>{
    let index = 0;
    let arrayLength = myArray.length;
    let tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
       let myChunk = myArray.slice(index, index+chunk_size);

        tempArray.push(myChunk);
    }

    return tempArray;
}

  //Pointer events on-off
  setPointerEvents(status:string) {
    let allFields = document.querySelectorAll('.fieldsSmall');

    allFields.forEach(field => {
    
      ((field) as HTMLElement).style.pointerEvents = status;
    })
  }

  getCurrentSquare = (field, index, playersObj) =>{

    let nextTurnText = document.getElementById("next-player-text");

    if(!this.threePlayerGame) {

      this.firstPlayerTurn = !this.firstPlayerTurn;
  
      field.innerText = this.firstPlayerTurn ? playersObj.firstPalyerselectedIcon : playersObj.secondPalyerselectedIcon;
  
      this.fieldsSmall[index] = this.firstPlayerTurn ? playersObj.firstPalyerselectedIcon : playersObj.secondPalyerselectedIcon;
      this.fieldsMedium[index] = this.firstPlayerTurn ? playersObj.firstPalyerselectedIcon : playersObj.secondPalyerselectedIcon;
  
      if (this.firstPlayerTurn) {
        this.fieldsOfFirstPlayer.push(index + 1);
        nextTurnText.innerText = `Next player: ${playersObj.secondPlayerName} `
        
      } else {
        this.fieldsOfSecondPlayer.push(index + 1);
        nextTurnText.innerText = `Next player: ${playersObj.firstPlayerName} `
      }
    }



    //Three player-------------------------------------------->
    
    //Who is the current player
    if(this.threePlayerGame) {

      if(this.indexOfPlayersArray <= this.whoIsTheNextPlayer.length-2) {
        this.indexOfPlayersArray += 1;
        this.currentPlayer = this.whoIsTheNextPlayer[this.indexOfPlayersArray];
        console.log(this.currentPlayer);
      }else {
        this.indexOfPlayersArray = 0;
        this.currentPlayer = this.whoIsTheNextPlayer[this.indexOfPlayersArray];
        console.log(this.currentPlayer);
      }
  
      //Add icon to field
      //first player
      if(this.currentPlayer === playersObj.firstPlayerName) {
        field.innerText = playersObj.firstPalyerselectedIcon;
        //Small map
        this.fieldsSmall[index] = playersObj.firstPalyerselectedIcon;
        //Medium map
        this.fieldsMedium[index] = playersObj.firstPalyerselectedIcon;

        this.fieldsOfFirstPlayer.push(index + 1);
        nextTurnText.innerText = `Next player: ${playersObj.secondPlayerName} `
      }
      //second player
      else if(this.currentPlayer === playersObj.secondPlayerName) {
        field.innerText = playersObj.secondPalyerselectedIcon
        //Small map
        this.fieldsSmall[index] = playersObj.secondPalyerselectedIcon;
        //Medium map
        this.fieldsMedium[index] = playersObj.secondPalyerselectedIcon;
        this.fieldsOfSecondPlayer.push(index + 1);
        nextTurnText.innerText = `Next player: ${playersObj.thirdPlayerName} `
      }
      //third player
      else if(this.currentPlayer === playersObj.thirdPlayerName) {
        field.innerText = playersObj.thirdPalyerselectedIcon
        //Small map
        this.fieldsSmall[index] = playersObj.thirdPalyerselectedIcon;
        //Medium map
        this.fieldsMedium[index] = playersObj.thirdPalyerselectedIcon;
        this.fieldsOfThirdPlayer.push(index + 1);
        nextTurnText.innerText = `Next player: ${playersObj.firstPlayerName} `
      }

   
    }

  }
  
  //Player functions

  //First player
  firstPlayerIsTheWinner = () => {
    const firstPlayerWonText = document.getElementById("winnerPlayerText");
    const newGameBtn = document.getElementById('new-game-btn');
    const winnerBox = document.getElementById("winner-box");

    let setStyleAndWonCounter = () => {
      this.winnerFirstPlayer = true;
      this.setPointerEvents('none');
      winnerBox.classList.add("winner-box");
      newGameBtn.style.display = 'block';
      firstPlayerWonText.style.display = "block";
      firstPlayerWonText.innerText = `${this.firstPlayerName} WON`;
      this.firstPlayerWonCounter++;
      this.firstPlayerTurn = true;
    }

    for(let chance of this.chanceOfWinning) {
      if(chance.every(boxes => this.fieldsOfFirstPlayer.includes(boxes))) {
        setStyleAndWonCounter();
      }
    }

    if(this.winnerFirstPlayerMediumBoard) {
        setStyleAndWonCounter();
    }

  }

  //Second player

  secondPlayerIsTheWinner = () => {
    const secondPlayerWonText = document.getElementById("winnerPlayerText");
    const newGameBtn = document.getElementById('new-game-btn');
    const winnerBox = document.getElementById("winner-box");

    let setStyleAndWonCounter = () => {
      this.winnerSecondPlayer = true;
      this.setPointerEvents('none');
      winnerBox.classList.add("winner-box");
      newGameBtn.style.display = 'block';
      secondPlayerWonText.style.display = "block";
      secondPlayerWonText.innerText = `${this.secondPlayerName} WON`;
      this.secondPlayerWonCounter++;
      this.firstPlayerTurn = false;
    }

    for(let chance of this.chanceOfWinning) {
      if(chance.every(boxes => this.fieldsOfSecondPlayer.includes(boxes))) {
        setStyleAndWonCounter();

      
      }
    }

    if(this.winnerSecondPlayerMediumBoard) {
      setStyleAndWonCounter();

    }

  }

   //Third player

   thirdPlayerIsTheWinner = () => {
    const thirdPlayerWonText = document.getElementById("winnerPlayerText");
    const newGameBtn = document.getElementById('new-game-btn');
    const winnerBox = document.getElementById("winner-box");

    let setStyleAndWonCounter = () => {
      this.winnerThirdPlayer = true;
      this.setPointerEvents('none');
      winnerBox.classList.add("winner-box");
      newGameBtn.style.display = 'block';
      thirdPlayerWonText.style.display = "block";
      thirdPlayerWonText.innerText = `${this.thirdPlayerName} NYERT`;
      this.thirdPlayerWonCounter++;
      this.firstPlayerTurn = false;
    }

    for(let chance of this.chanceOfWinning) {
      if(chance.every(boxes => this.fieldsOfThirdPlayer.includes(boxes))) {
 
        setStyleAndWonCounter();

      }
    }

    if(this.winnerThirdPlayerMediumBoard) {
 
      setStyleAndWonCounter();

    }
  }

  //Check end of the game

  checkEndOfTheGame() {
    const drawText = document.getElementById("winnerPlayerText");
    const newGameBtn = document.getElementById('new-game-btn');
    const winnerBox = document.getElementById("winner-box");

    let setStyle = () => {
      this.setPointerEvents('none');
      winnerBox.classList.add("winner-box");
      newGameBtn.style.display = 'block';
      drawText.style.display = "block";
      drawText.innerText = 'Draw';
    }

    if(!this.threePlayerGame) {

      if (!this.gameIsOver && !this.fieldsSmall.includes(0) && !this.winnerFirstPlayer && !this.winnerSecondPlayer) {
        setStyle();
      } 
      
      if (!this.gameIsOver && !this.fieldsMedium.includes(0) && !this.winnerFirstPlayer && !this.winnerSecondPlayer) {
        setStyle();
      }
    }else if(this.threePlayerGame) {
      
      if (!this.gameIsOver && !this.fieldsSmall.includes(0) && !this.winnerFirstPlayer && !this.winnerSecondPlayer && !this.winnerThirdPlayer) {

        setStyle();
      } 
      
      if (!this.gameIsOver && !this.fieldsMedium.includes(0) && !this.winnerFirstPlayer && !this.winnerSecondPlayer && !this.winnerThirdPlayer) {

        setStyle();
      }
    }
   
  }


   //-----------------Small Board Creating START-------------
   createSmallBoard = (playersObject:any) => {
    this.gameIsOver = false;
    const smallBoard: HTMLElement = document.querySelector('.board');

    this.fieldsSmall.forEach((field, index) => {
      if(this.gameIsOver) {
        smallBoard.innerText = '';   
      }

      let fieldSmallDiv = document.createElement('div');

      fieldSmallDiv.setAttribute('class', 'field fieldsSmall');

      fieldSmallDiv.style.border = "3px solid #ffe3ded2";
      fieldSmallDiv.style.width = "33.3%";
      fieldSmallDiv.style.height = "33.3%";
      fieldSmallDiv.style.color = "#ffe3ded2";
      fieldSmallDiv.style.fontSize = "6rem";
      fieldSmallDiv.style.display = "flex";
      fieldSmallDiv.style.justifyContent = "center";
      fieldSmallDiv.style.alignItems = "center";
      fieldSmallDiv.style.cursor = "pointer";

      
      fieldSmallDiv.addEventListener('click', () => {
        
        this.getCurrentSquare(fieldSmallDiv, index, playersObject);
        fieldSmallDiv.style.pointerEvents = 'none';

        //chances of winning
        this.chancesOfWinningSmallBoard();

        //Who is the winner?
        if(!this.threePlayerGame) {
          this.firstPlayerIsTheWinner();
          this.secondPlayerIsTheWinner();
        }else if(this.threePlayerGame) {
          this.firstPlayerIsTheWinner();
          this.secondPlayerIsTheWinner();
          this.thirdPlayerIsTheWinner();
        }  

        //Draw?
        this.checkEndOfTheGame();
      })

      smallBoard.appendChild(fieldSmallDiv);

    });

   }


  chancesOfWinningSmallBoard = () => {
    //Chances and diagonal
    this.chanceOfWinning = [[1, 5, 9], [7, 5, 3]];
    
    //Small board
    let smallBoard = [[1, 2, 3],
                      [4, 5, 6],
                      [7, 8, 9]];            

    for (let x = 0; x < smallBoard.length; x++) {

      this.chanceOfWinning.push(
        //Horizontal
        smallBoard[x]
      )
      for (let y = 0; y < smallBoard[x].length - 2; y++) {
        
        //Vertical
        this.chanceOfWinning.push(
          [smallBoard[y][x],
          smallBoard[y + 1][x],
          smallBoard[y + 2][x]]
        )

      }
    }

    console.log(this.fieldsSmall);
  }
  
  

 

  
  createANewSmallGame() {
    const winnerText = document.getElementById("winnerPlayerText");
    const winnerBox = document.getElementById("winner-box");
    let allFields = document.querySelectorAll('.fieldsSmall');
    const newGameBtn = document.getElementById('new-game-btn');
    
      this.gameIsOver = false;
      this.winnerFirstPlayer = false;
      this.winnerSecondPlayer = false;
      this.winnerThirdPlayer = false;
      this.fieldsOfFirstPlayer = [];
      this.fieldsOfSecondPlayer = [];
      this.fieldsOfThirdPlayer = [];
      this.fieldsSmall = Array(9).fill(0);
     
     
      allFields.forEach(field => {
        field.innerHTML = '';
        ((field) as HTMLElement).style.pointerEvents = 'auto';
      }) 
      newGameBtn.style.display = 'none';
      winnerText.style.display = "none";
      winnerBox.classList.remove("winner-box");
    }

 
    
    //-----------------Small Board Creating END----------------------

    //-----------------Medium Board Creating START----------------------
    createMediumBoard = (playersObject:any) => {
      this.gameIsOver = false;
      const mediumBoard: HTMLElement = document.querySelector('.board');
  
      this.fieldsMedium.forEach((field, index) => {
        if(this.gameIsOver) {
          mediumBoard.innerText = '';      
        }
  
        let fieldMediumDiv = document.createElement('div');
  
        fieldMediumDiv.setAttribute('class', 'field fieldsMedium');
  
        fieldMediumDiv.style.border = "3px solid #ffe3ded2";
        fieldMediumDiv.style.width = "20%";
        fieldMediumDiv.style.height = "20%";
        fieldMediumDiv.style.color = "#ffe3ded2";
        fieldMediumDiv.style.fontSize = "6rem";
        fieldMediumDiv.style.display = "flex";
        fieldMediumDiv.style.justifyContent = "center";
        fieldMediumDiv.style.alignItems = "center";
        fieldMediumDiv.style.cursor = "pointer";
  
        
        fieldMediumDiv.addEventListener('click', () => {
          
          this.getCurrentSquare(fieldMediumDiv, index, playersObject);
          fieldMediumDiv.style.pointerEvents = 'none';
  
          //chances of winning
          this.chancesOfWinningMediumBoard(playersObject);
  
          //Who is the winner?
          if(!this.threePlayerGame) {
           
              this.firstPlayerIsTheWinner();
              this.secondPlayerIsTheWinner();
            
          }else if(this.threePlayerGame) {
            this.firstPlayerIsTheWinner();
            this.secondPlayerIsTheWinner();
            this.thirdPlayerIsTheWinner();
          }  
  
          //Draw?
          this.checkEndOfTheGame();
        })
  
        mediumBoard.appendChild(fieldMediumDiv);
  
      });
  
     }

     chancesOfWinningMediumBoard(playersObject:any) {

      let chunkedArray = this.chunkArray(this.fieldsMedium, 5)
       console.log(this.fieldsMedium);
      console.log(chunkedArray);

      //Horizontal winning chance
      let horizontalWinningChance = (selectedIcon, x) => {
       return chunkedArray[x][0] === selectedIcon && chunkedArray[x][1] === selectedIcon && chunkedArray[x][2] === selectedIcon||
            chunkedArray[x][1] === selectedIcon && chunkedArray[x][2] === selectedIcon && chunkedArray[x][3] === selectedIcon||
            chunkedArray[x][2] === selectedIcon && chunkedArray[x][3] === selectedIcon && chunkedArray[x][4] === selectedIcon
      }
      
      //Vertical winning chance

      let verticalWinningChance = (selectedIcon, y) => {
        return chunkedArray[0][y] === selectedIcon && chunkedArray[1][y] === selectedIcon && chunkedArray[2][y] === selectedIcon ||
        chunkedArray[1][y] === selectedIcon && chunkedArray[2][y] === selectedIcon && chunkedArray[3][y] === selectedIcon ||
        chunkedArray[2][y] === selectedIcon && chunkedArray[3][y] === selectedIcon && chunkedArray[4][y] === selectedIcon
      }

      //Diagonal winning chance
      let diagonalWinningChance = (selectedIcon, y) => {
        return chunkedArray[y][y] === selectedIcon && chunkedArray[y+1][y+1] === selectedIcon && chunkedArray[y+2][y+2] === selectedIcon||
        chunkedArray[y][y+1] === selectedIcon && chunkedArray[y+1][y+2] === selectedIcon && chunkedArray[y+2][y+3] === selectedIcon|| 
        chunkedArray[0][y+2] === selectedIcon && chunkedArray[1][3] === selectedIcon && chunkedArray[2][4] === selectedIcon||
        chunkedArray[1][0] === selectedIcon && chunkedArray[2][1] === selectedIcon && chunkedArray[3][2] === selectedIcon||
        chunkedArray[2][1] === selectedIcon && chunkedArray[3][2] === selectedIcon && chunkedArray[4][3] === selectedIcon||
        chunkedArray[2][0] === selectedIcon && chunkedArray[3][1] === selectedIcon && chunkedArray[4][2] === selectedIcon||
        chunkedArray[4][0] === selectedIcon && chunkedArray[3][1] === selectedIcon && chunkedArray[2][2] === selectedIcon||
        chunkedArray[3][1] === selectedIcon && chunkedArray[2][2] === selectedIcon && chunkedArray[1][3] === selectedIcon||
        chunkedArray[2][0] === selectedIcon && chunkedArray[1][1] === selectedIcon && chunkedArray[0][2] === selectedIcon||
        chunkedArray[3][0] === selectedIcon && chunkedArray[2][1] === selectedIcon && chunkedArray[1][2] === selectedIcon||
        chunkedArray[2][1] === selectedIcon && chunkedArray[1][2] === selectedIcon && chunkedArray[0][3] === selectedIcon||
        chunkedArray[4][1] === selectedIcon && chunkedArray[3][2] === selectedIcon && chunkedArray[2][3] === selectedIcon||
        chunkedArray[3][2] === selectedIcon && chunkedArray[2][3] === selectedIcon && chunkedArray[1][4] === selectedIcon||
        chunkedArray[4][2] === selectedIcon && chunkedArray[3][3] === selectedIcon && chunkedArray[2][4] === selectedIcon||
        chunkedArray[2][2] === selectedIcon && chunkedArray[1][3] === selectedIcon && chunkedArray[0][4] === selectedIcon
      }

    
      //Horizontal 
      //First player
      for (let x = 0; x < chunkedArray.length; x++) {

        if(horizontalWinningChance(playersObject.firstPalyerselectedIcon, x)) {
          console.log('firstPlayer won')
          this.winnerFirstPlayer = true;
          this.winnerFirstPlayerMediumBoard = true;
        }

      //Second player


        if(horizontalWinningChance(playersObject.secondPalyerselectedIcon, x)) {
          console.log('secondPlayer won')
          this.winnerSecondPlayer = true;
          this.winnerSecondPlayerMediumBoard = true;
        }


      
       //Third player  


        if(horizontalWinningChance(playersObject.thirdPalyerselectedIcon, x)) {
          console.log('thirdPlayer won')
          this.winnerThirdPlayer = true;
          this.winnerThirdPlayerMediumBoard = true;
        }
  
        //Vertical
        //First player
        for(let i = 0; i < 5; i++) {
 
             if(verticalWinningChance(playersObject.firstPalyerselectedIcon, i)) {
              console.log('firstPlayer won')
              this.winnerFirstPlayer = true;
              this.winnerFirstPlayerMediumBoard = true;
             }
          //Second player 

             if(verticalWinningChance(playersObject.secondPalyerselectedIcon, i)) {
              console.log('secondPlayer won')
              this.winnerSecondPlayer = true;
              this.winnerSecondPlayerMediumBoard = true;
             }

             //Third player  
  

              if(verticalWinningChance(playersObject.thirdPalyerselectedIcon, i)) {
                console.log('thirdPlayer won')
                this.winnerThirdPlayer = true;
                this.winnerThirdPlayerMediumBoard = true;
               }
        }

  
        //Diagonal
        //First player
        for(let y = 0; y < 3; y++) {

             if(diagonalWinningChance(playersObject.firstPalyerselectedIcon, y)) {
              console.log('firstPlayer won')
              this.winnerFirstPlayer = true;
              this.winnerFirstPlayerMediumBoard = true;
             }
           //Second player

              if(diagonalWinningChance(playersObject.secondPalyerselectedIcon, y)) {
                console.log('secondPlayer won')
                this.winnerSecondPlayer = true;
                this.winnerSecondPlayerMediumBoard = true;
               }

               //Third player  
                
              if(diagonalWinningChance(playersObject.thirdPalyerselectedIcon, y)) {
                console.log('thirdPlayer won')
                this.winnerThirdPlayer = true;
                this.winnerThirdPlayerMediumBoard = true;
               }
        }
      
      }
  
    }

    createANewMediumGame() {
      const winnerText = document.getElementById("winnerPlayerText");
      const winnerBox = document.getElementById("winner-box");
      let allFields = document.querySelectorAll('.fieldsMedium');
      const newGameBtn = document.getElementById('new-game-btn');
      
        this.gameIsOver = false;
        this.winnerFirstPlayer = false;
        this.winnerSecondPlayer = false;
        this.winnerThirdPlayer = false;
        this.fieldsOfFirstPlayer = [];
        this.fieldsOfFirstPlayer = [];
        this.fieldsOfThirdPlayer = [];
        this.winnerFirstPlayerMediumBoard = false;
        this.winnerSecondPlayerMediumBoard = false;
        this.winnerThirdPlayerMediumBoard = false;
        this.fieldsSmall = Array(9).fill(0);
        this.fieldsMedium = Array(25).fill(0);
       
       
        allFields.forEach(field => {
          field.innerHTML = '';
        
          ((field) as HTMLElement).style.pointerEvents = 'auto';
        }) 
       
      
        newGameBtn.style.display = 'none';
        winnerText.style.display = "none";
        winnerBox.classList.remove("winner-box");
      

  
  }
    
    
    //-----------------Medium Board Creating END----------------------

    //-----------------Large Board Creating START----------------------
    createLargeBoard = (playersObject:any) => {
      this.gameIsOver = false;
      const largeBoard: HTMLElement = document.querySelector('.board');
  
      this.fieldsLarge.forEach((field, index) => {
        if(this.gameIsOver) {
          largeBoard.innerText = '';      
        }
  
        let fieldLargeDiv = document.createElement('div');
  
        fieldLargeDiv.setAttribute('class', 'field fieldsLarge');
  
        fieldLargeDiv.style.border = "3px solid #ffe3ded2";
        fieldLargeDiv.style.width = "10%";
        fieldLargeDiv.style.height = "10%";
        fieldLargeDiv.style.color = "#ffe3ded2";
        fieldLargeDiv.style.fontSize = "3rem";
        fieldLargeDiv.style.display = "flex";
        fieldLargeDiv.style.justifyContent = "center";
        fieldLargeDiv.style.alignItems = "center";
        fieldLargeDiv.style.cursor = "pointer";
  
        
        fieldLargeDiv.addEventListener('click', () => {
          
          this.getCurrentSquare(fieldLargeDiv, index, playersObject);
          fieldLargeDiv.style.pointerEvents = 'none';
  
          //chances of winning
          this.chancesOfWinningMediumBoard(playersObject);
  
          //Who is the winner?
          if(!this.threePlayerGame) {
           
              this.firstPlayerIsTheWinner();
              this.secondPlayerIsTheWinner();
            
          }else if(this.threePlayerGame) {
            this.firstPlayerIsTheWinner();
            this.secondPlayerIsTheWinner();
            this.thirdPlayerIsTheWinner();
          }  
  
          //Draw?
          this.checkEndOfTheGame();
        })
  
        largeBoard.appendChild(fieldLargeDiv);
  
      });
    }

    //-----------------Large Board Creating END----------------------

}
