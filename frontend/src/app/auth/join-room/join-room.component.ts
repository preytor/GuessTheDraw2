import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit {

  urlID: any;
  hasPass: any;

  constructor(private router: Router, private aRoute: ActivatedRoute) {
    //get if it has pass "pass"
    //if it has show the module of the login, 
    //if not wait the seconds and go to the room
/*    console.log(this.aRoute.queryParams)

    this.aRoute.queryParams.subscribe(params => {
      this.urlID = params['id'];
      this.hasPass = params['pass'];
    });*/
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {


    async () => {
      await delay(5000);
      console.log("Waited 5s");
    
      await delay(5000);
      console.log("Waited an additional 5s");
      
      this.router.navigate(['/room', { queryParams: { id: this.urlID} }]);
    };
  }
  
}
