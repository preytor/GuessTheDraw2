import { Component, OnInit } from '@angular/core';
import { GameLobby } from 'src/app/models/gameLobby';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-browse-rooms',
  templateUrl: './browse-rooms.component.html',
  styleUrls: ['./browse-rooms.component.css']
})
export class BrowseRoomsComponent implements OnInit {

  games: GameLobby[] = [];

  constructor(private GameService: GameService) {     
    let index = 0;
    const offset = 10;

    this.GameService.getGameRooms(index, offset)
    .subscribe((rankings: any) => {
      for(let i = 0; i<rankings.length; i++){
        this.games.push(rankings[i]);
      }

    });
  }

  ngOnInit(): void {
  }
}
