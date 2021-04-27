import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-selected-player',
  templateUrl: './selected-player.component.html',
  styleUrls: ['./selected-player.component.scss']
})
export class SelectedPlayerComponent implements OnInit {

 @Input() playerDetails: any = {
    playerNumber: 0,
    playerFormControlName: 'unknown',
  };

  constructor() { }

  ngOnInit(): void {
  }

}
