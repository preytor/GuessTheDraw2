import { Component, OnInit } from '@angular/core';
import { PlayerScore } from 'src/app/models/playerScore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  players: PlayerScore[] = [];

  constructor(private authService: AuthService) {
    let index = 1;
    const offset = 10;
    this.authService.getRanking(index, offset)
    .subscribe((rankings: any) => {
      for(let i = 0; i<rankings.users.length; i++){
        //console.log("memememe0: ", rankings.users[i].username)
        let _playerscore = {
          rank: (index*i)+1,
          name: rankings.users[i].username,
          score: rankings.users[i].score
        }
        this.players.push(_playerscore);
      }

    });
  }

  ngOnInit(): void {
  }

}
