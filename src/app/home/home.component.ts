import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MapSizeService } from '../service/map-size.service';

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

   //Array option
   arrayOfOptions:Array<any> = [
     {name: '⭕', value: '⭕', disable: false}, 
     {name: '❌', value: '❌', disable: false}, 
     {name: '💣', value: '💣', disable: false}, 
     {name: '⚓', value: '⚓', disable: false},
     {name: '💥', value: '💥', disable: false},
     {name: '🔥', value: '🔥', disable: false},
     {name: '🛫', value: '🛫', disable: false},
     {name: '🛦', value: '🛦', disable: false}, 
     {name: '☻', value: '☻', disable: false}
    
    ];

  playersArray:Array<any> = [];

  constructor(
    private mapSizeService: MapSizeService,
    private router: Router
  ) {

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

    this.mapSizeService.mapSize.next(amobaFormValues);
    this.router.navigate(['game']);

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
      }
      /* {
        playerNumber: 4,
        formControlName: 'fourthPlayerName',
        selectedIcon: 'fourthPalyerselectedIcon'
      }, */
    ];
    

    for(let i = 0; i < +numberOfThePlayers; i++) {
      this.playersArray.push(arrayOfPlayers[i]);

    }
    
  }

  selectedIcon = (icon:string) => {
    for(let option of this.arrayOfOptions) {
      if(option.name === icon) {
        option.disable = true;
        
      }
    }
  }

}
