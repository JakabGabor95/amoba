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

    console.log(this.fieldsOfFirstPlayer);
    console.log(this.fieldsOfSecondPlayer);

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
        this.fieldsSmall[index] = playersObj.firstPalyerselectedIcon;
        this.fieldsOfFirstPlayer.push(index + 1);
        nextTurnText.innerText = `Next player: ${playersObj.secondPlayerName} `
      }
      //second player
      else if(this.currentPlayer === playersObj.secondPlayerName) {
        field.innerText = playersObj.secondPalyerselectedIcon
        this.fieldsSmall[index] = playersObj.secondPalyerselectedIcon;
        this.fieldsOfSecondPlayer.push(index + 1);
        nextTurnText.innerText = `Next player: ${playersObj.thirdPlayerName} `
      }
      //third player
      else if(this.currentPlayer === playersObj.thirdPlayerName) {
        field.innerText = playersObj.thirdPalyerselectedIcon
        this.fieldsSmall[index] = playersObj.thirdPalyerselectedIcon;
        this.fieldsOfThirdPlayer.push(index + 1);
        nextTurnText.innerText = `Next player: ${playersObj.firstPlayerName} `
      }

      console.log("Map"+ this.fieldsSmall);
      console.log("First"+ this.fieldsOfFirstPlayer);
      console.log("Second"+ this.fieldsOfSecondPlayer);
      console.log("Third"+ this.fieldsOfThirdPlayer);
    }

   

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
  
  firstPlayerIsTheWinner = () => {
    const firstPlayerWonText = document.getElementById("winnerPlayerText");
    const newGameBtn = document.getElementById('new-game-btn');
    const winnerBox = document.getElementById("winner-box");

    for(let chance of this.chanceOfWinning) {
      if(chance.every(boxes => this.fieldsOfFirstPlayer.includes(boxes))) {
        this.winnerFirstPlayer = true;
        this.setPointerEvents('none');
        winnerBox.classList.add("winner-box");
        newGameBtn.style.display = 'block';
        firstPlayerWonText.style.display = "block";
        firstPlayerWonText.innerText = `${this.firstPlayerName} WON`;
        this.firstPlayerWonCounter++;
        this.firstPlayerTurn = true;
        console.log('first won')
      }
    }


  }

  secondPlayerIsTheWinner = () => {
    const secondPlayerWonText = document.getElementById("winnerPlayerText");
    const newGameBtn = document.getElementById('new-game-btn');
    const winnerBox = document.getElementById("winner-box");

    for(let chance of this.chanceOfWinning) {
      if(chance.every(boxes => this.fieldsOfSecondPlayer.includes(boxes))) {
        this.winnerSecondPlayer = true;
        this.setPointerEvents('none');
        winnerBox.classList.add("winner-box");
        newGameBtn.style.display = 'block';
        secondPlayerWonText.style.display = "block";
        secondPlayerWonText.innerText = `${this.secondPlayerName} WON`;
        this.secondPlayerWonCounter++;
        this.firstPlayerTurn = false;

        console.log('second won')
      }
    }


  }

  checkEndOfTheGame() {
    const drawText = document.getElementById("winnerPlayerText");
    const newGameBtn = document.getElementById('new-game-btn');
    const winnerBox = document.getElementById("winner-box");
    if (!this.gameIsOver && !this.fieldsSmall.includes(0) && !this.winnerFirstPlayer && !this.winnerSecondPlayer) {
      this.setPointerEvents('none');
      winnerBox.classList.add("winner-box");
      newGameBtn.style.display = 'block';
      drawText.style.display = "block";
      drawText.innerText = 'Draw';
    } 
    
    if (!this.gameIsOver && !this.fieldsMedium.includes(0) && !this.winnerFirstPlayer && !this.winnerSecondPlayer) {
      this.setPointerEvents('none');
      winnerBox.classList.add("winner-box");
      newGameBtn.style.display = 'block';
      drawText.style.display = "block";
      drawText.innerText = 'Draw';
    }
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

    //3player
    thirdPlayerIsTheWinner = () => {
    const thirdPlayerWonText = document.getElementById("winnerPlayerText");
    const newGameBtn = document.getElementById('new-game-btn');
    const winnerBox = document.getElementById("winner-box");

    for(let chance of this.chanceOfWinning) {
      if(chance.every(boxes => this.fieldsOfThirdPlayer.includes(boxes))) {
        this.winnerThirdPlayer = true;
        this.setPointerEvents('none');
        winnerBox.classList.add("winner-box");
        newGameBtn.style.display = 'block';
        thirdPlayerWonText.style.display = "block";
        thirdPlayerWonText.innerText = `${this.thirdPlayerName} WON`;
        this.thirdPlayerWonCounter++;
        this.firstPlayerTurn = false;

        console.log('third won')
      }
    }
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
  
        fieldMediumDiv.setAttribute('class', 'field fieldsSmall');
  
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
      console.log(playersObject);
      
      let chunkedArray = this.chunkArray(this.fieldsMedium, 5)
  
      console.log(chunkedArray);
      
      //Horizontal
      for (let x = 0; x < chunkedArray.length; x++) {
        if( chunkedArray[x][0] === 'X' && chunkedArray[x][1] === 'X' && chunkedArray[x][2] === 'X'||
            chunkedArray[x][1] === 'X' && chunkedArray[x][2] === 'X' && chunkedArray[x][3] === 'X'||
            chunkedArray[x][2] === 'X' && chunkedArray[x][3] === 'X' && chunkedArray[x][4] === 'X'
        ){
         
        }
  
        if( chunkedArray[x][0] === 'O' && chunkedArray[x][1] === 'O' && chunkedArray[x][2] === 'O' ||
            chunkedArray[x][1] === 'O' && chunkedArray[x][2] === 'O' && chunkedArray[x][3] === 'O' ||
            chunkedArray[x][2] === 'O' && chunkedArray[x][3] === 'O' && chunkedArray[x][4] === 'O'
        ){
        
         
        }
  
        //Vertical
        for(let i = 0; i < 5; i++) {
          if(chunkedArray[0][i] === 'X' && chunkedArray[1][i] === 'X' && chunkedArray[2][i] === 'X' ||
             chunkedArray[1][i] === 'X' && chunkedArray[2][i] === 'X' && chunkedArray[3][i] === 'X' ||
             chunkedArray[2][i] === 'X' && chunkedArray[3][i] === 'X' && chunkedArray[4][i] === 'X') 
             {
          
             }
          
         if( chunkedArray[0][i] === 'O' && chunkedArray[1][i] === 'O' && chunkedArray[2][i] === 'O' ||
             chunkedArray[1][i] === 'O' && chunkedArray[2][i] === 'O' && chunkedArray[3][i] === 'O' ||
             chunkedArray[2][i] === 'O' && chunkedArray[3][i] === 'O' && chunkedArray[4][i] === 'O') 
             {
     
           
             }
        }
  
        //Diagonal
        for(let y = 0; y < 3; y++) {
          if(chunkedArray[y][y] === 'X' && chunkedArray[y+1][y+1] === 'X' && chunkedArray[y+2][y+2] === 'X'||
             chunkedArray[y][y+1] === 'X' && chunkedArray[y+1][y+2] === 'X' && chunkedArray[y+2][y+3] === 'X'|| 
             chunkedArray[0][y+2] === 'X' && chunkedArray[1][3] === 'X' && chunkedArray[2][4] === 'X'||
             chunkedArray[1][0] === 'X' && chunkedArray[2][1] === 'X' && chunkedArray[3][2] === 'X'||
             chunkedArray[2][1] === 'X' && chunkedArray[3][2] === 'X' && chunkedArray[4][3] === 'X'||
             chunkedArray[2][0] === 'X' && chunkedArray[3][1] === 'X' && chunkedArray[4][2] === 'X'||
             chunkedArray[4][0] === 'X' && chunkedArray[3][1] === 'X' && chunkedArray[2][2] === 'X'||
             chunkedArray[3][1] === 'X' && chunkedArray[2][2] === 'X' && chunkedArray[1][3] === 'X'||
             chunkedArray[2][0] === 'X' && chunkedArray[1][1] === 'X' && chunkedArray[0][2] === 'X'||
             chunkedArray[3][0] === 'X' && chunkedArray[2][1] === 'X' && chunkedArray[1][2] === 'X'||
             chunkedArray[2][1] === 'X' && chunkedArray[1][2] === 'X' && chunkedArray[0][3] === 'X'||
             chunkedArray[4][1] === 'X' && chunkedArray[3][2] === 'X' && chunkedArray[2][3] === 'X'||
             chunkedArray[3][2] === 'X' && chunkedArray[2][3] === 'X' && chunkedArray[1][4] === 'X'||
             chunkedArray[4][2] === 'X' && chunkedArray[3][3] === 'X' && chunkedArray[2][4] === 'X'||
             chunkedArray[2][2] === 'X' && chunkedArray[1][3] === 'X' && chunkedArray[0][4] === 'X') 
             {
           
               
             }
          
          if( chunkedArray[y][y] === 'O' && chunkedArray[y+1][y+1] === 'O' && chunkedArray[y+2][y+2] === 'O' ||
              chunkedArray[y][y+1] === 'O' && chunkedArray[y+1][y+2] === 'O' && chunkedArray[y+2][y+3] === 'O'|| 
              chunkedArray[0][y+2] === 'O' && chunkedArray[1][3] === 'O' && chunkedArray[2][4] === 'O'||
              chunkedArray[1][0] === 'O' && chunkedArray[2][1] === 'O' && chunkedArray[3][2] === 'O'||
              chunkedArray[2][1] === 'O' && chunkedArray[3][2] === 'O' && chunkedArray[4][3] === 'O'||
              chunkedArray[2][0] === 'O' && chunkedArray[3][1] === 'O' && chunkedArray[4][2] === 'O'||
              chunkedArray[4][0] === 'O' && chunkedArray[3][1] === 'O' && chunkedArray[2][2] === 'O'||
              chunkedArray[3][1] === 'O' && chunkedArray[2][2] === 'O' && chunkedArray[1][3] === 'O'||
              chunkedArray[2][0] === 'O' && chunkedArray[1][1] === 'O' && chunkedArray[0][2] === 'O'||
              chunkedArray[3][0] === 'O' && chunkedArray[2][1] === 'O' && chunkedArray[1][2] === 'O'||
              chunkedArray[2][1] === 'O' && chunkedArray[1][2] === 'O' && chunkedArray[0][3] === 'O'||
              chunkedArray[4][1] === 'O' && chunkedArray[3][2] === 'O' && chunkedArray[2][3] === 'O'||
              chunkedArray[3][2] === 'O' && chunkedArray[2][3] === 'O' && chunkedArray[1][4] === 'O'||
              chunkedArray[4][2] === 'O' && chunkedArray[3][3] === 'O' && chunkedArray[2][4] === 'O'||
              chunkedArray[2][2] === 'O' && chunkedArray[1][3] === 'O' && chunkedArray[0][4] === 'O') 
                       
             {
             
               
             }
  
        }
      
      }
  
    }
    
    
    //-----------------Medium Board Creating END----------------------
}
