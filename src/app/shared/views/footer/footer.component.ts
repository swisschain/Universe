import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-footer1',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  today: number = Date.now();
  fluid: boolean = true;

  ngOnInit() {
  }

}
