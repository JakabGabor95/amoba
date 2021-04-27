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
        this.firstPlayerIsTheWinner();
        this.secondPlayerIsTheWinner();

        //Draw?
        this.checkEndOfTheGame();
      })

      smallBoard.appendChild(fieldSmallDiv);

    });

   }

   getCurrentSquare = (field, index, playersObj) =>{

    let nextTurnText = document.getElementById("next-player-text");


    this.firstPlayerTurn = !this.firstPlayerTurn;

    field.innerText = this.firstPlayerTurn ? playersObj.firstPalyerselectedIcon : playersObj.secondPalyerselectedIcon;

    this.fieldsSmall[index] = this.firstPlayerTurn ? playersObj.firstPalyerselectedIcon : playersObj.secondPalyerselectedIcon;
    this.fieldsMedium[index] = this.firstPlayerTurn ? 'X' : 'O';

    if (this.firstPlayerTurn) {
      this.fieldsOfFirstPlayer.push(index + 1);
      nextTurnText.innerText = `Next player: ${playersObj.secondPalyerselectedIcon} `
      
    } else {
      this.fieldsOfSecondPlayer.push(index + 1);
      nextTurnText.innerText = `Next player: ${playersObj.firstPalyerselectedIcon} `
    }

    console.log(this.fieldsOfFirstPlayer);
    console.log(this.fieldsOfSecondPlayer);
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
      this.fieldsOfFirstPlayer = [];
      this.fieldsOfSecondPlayer = [];
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
}
