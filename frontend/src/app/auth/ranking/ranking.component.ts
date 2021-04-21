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
    this.authService.getRanking(0, 50)
    .subscribe((rankings: PlayerScore) => {
      console.log("ranking received: ", rankings);
      this.players.push(rankings);
    });
  }

  ngOnInit(): void {
  }

}
