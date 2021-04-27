import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  amobaForm: FormGroup;
  selectedPlayersNumber:Array<number> = [];

  //show label
  showPlayerNameLabel:boolean = false;

  playersArray:Array<any> = [];

  constructor() {
    this.amobaForm = new FormGroup({
      map: new FormControl('', Validators.required),
      numberOfPlayers: new FormControl('', Validators.required),
     
      //First player details
      firstPlayerName: new FormControl('', Validators.required),
      firstPalyerselectedIcon: new FormControl('', Validators.required),
     
      //Second player details
      secondPlayerName: new FormControl('', Validators.required),
      secondPalyerselectedIcon: new FormControl('', Validators.required),
   
      //Third player details
      thirdPlayerName: new FormControl('',),
      thirdPalyerselectedIcon: new FormControl('',),

      //Fourth player details
      fourthPlayerName: new FormControl('', ),
      fourthPalyerselectedIcon: new FormControl('',),
    })
  }

  ngOnInit(): void {
  }

  detailsOfPlayers = () => {
    const amobaFormValues = this.amobaForm.value;

    console.log(amobaFormValues);

  }

  howManyPlayers = (numberOfThePlayers) => {
    this.showPlayerNameLabel = true;
    this.playersArray = [];

    let arrayOfPlayers:any = [
      {
        playerNumber: 1,
        formControlName: 'firstPlayerName',
        selectedIcon: 'firstPalyerselectedIcon'
      },
      {
        playerNumber: 2,
        formControlName: 'secondPlayerName',
        selectedIcon: 'secondPalyerselectedIcon'
      },
      {
        playerNumber: 3,
        formControlName: 'thirdPlayerName',
        selectedIcon: 'thirdPalyerselectedIcon'
      },
      {
        playerNumber: 4,
        formControlName: 'fourthPlayerName',
        selectedIcon: 'fourthPalyerselectedIcon'
      },
    ];
    

    for(let i = 0; i < +numberOfThePlayers; i++) {
      this.playersArray.push(arrayOfPlayers[i]);
    }
    
  }

}
