import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameLobby } from 'src/app/models/gameLobby';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-browse-rooms',
  templateUrl: './browse-rooms.component.html',
  styleUrls: ['./browse-rooms.component.css']
})
export class BrowseRoomsComponent implements OnInit {

  games: GameLobby[] = [];
  showModal: boolean = false;
  _roomPassForm = {
    id: -1,
    password: ""
  }
  
  roomPassForm: FormGroup | undefined;

  constructor(private GameService: GameService, private router: Router) {     
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
    this.roomPassForm = new FormGroup({
      password: new FormControl(this._roomPassForm.password, [Validators.required, Validators.minLength(1)])
    });
  }

  enterRoom(){
    this.GameService.isRightPassword(this._roomPassForm.id, this._roomPassForm.password)
    .then(
      res => {
        Promise.resolve();
        if(res==true){
          console.log("navigating to room: ", this._roomPassForm.id)
          this.router.navigate(['./room'], { queryParams: {id: this._roomPassForm.id}});
        }
      },
      err => {
        Promise.reject();
      }
    );
  }
}
