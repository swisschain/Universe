import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'kt-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  private unsubscribe: Subscription[] = [];
  
  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
	}
}
