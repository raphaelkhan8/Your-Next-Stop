import { ActivatedRoute, Router } from '@angular/router';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  ConnectedPositioningStrategy,
  HorizontalAlignment,
  ISelectionEventArgs,
  NoOpScrollStrategy,
  VerticalAlignment
} from 'igniteui-angular';
import { NavbarService } from '../services/navbar.service';
import { Observable } from 'rxjs';

@Component({
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  currentUser = localStorage.getItem('userId');
  public currentView: Observable<string>;
  constructor(
    private _location: Location,
    private navbar: NavbarService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  public ngOnInit() {
    this.currentView = this.navbar.title;
  }

  public items: Array<{ text: string }> = [
    { text: 'Stats' },
    { text: 'Logout' }
  ];
  public text: string;
  public overlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy({
      horizontalDirection: HorizontalAlignment.Left,
      horizontalStartPoint: HorizontalAlignment.Right,
      verticalStartPoint: VerticalAlignment.Bottom
    }),
    scrollStrategy: new NoOpScrollStrategy()
  };

  public onSelection(eventArgs: ISelectionEventArgs) {
    this.text = eventArgs.newSelection.value;
    if (this.text === 'Logout') {
      this.logoutUser();
    }
    if (this.text === 'Stats') {
      this.router.navigateByUrl('/stats');
    }
    eventArgs.cancel = true;
  }

  logoutUser() {
    localStorage.clear();
    window.location.href = '/';
  }
}
