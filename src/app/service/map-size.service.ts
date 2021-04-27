import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapSizeService {

  mapSize = new BehaviorSubject<any>(null);

  constructor() { }
}
