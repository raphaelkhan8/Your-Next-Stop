import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TripsService } from '../services/trips.service';
import { MapComponent } from '../map/map.component';
import { RouteService } from '../services/route.service';
import { PreviousRouteService } from '../services/router.service';
import {
  ConnectedPositioningStrategy,
} from 'igniteui-angular';
import { debounceTime, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { NavbarService } from '../services/navbar.service';


@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit, OnDestroy {
  @Output() public onClosing = new EventEmitter<string>();
  @ViewChild(MapComponent, { static: false }) public map: MapComponent;

  currentUser = localStorage.getItem('userId');
  parsedTrip = JSON.parse(localStorage.getItem('trip'));
  milesTraveled = '';
  tripId = Number;

  form = {
    origin: '',
    destination: '',
    route: '',
    waypoints: [],
    dateStart: new Date(),
    dateEnd: new Date(),
    userId: JSON.parse(this.currentUser)
  };

  category: string = '';

  private isoDate = {
    start: '',
    end: ''
  };
  public show = [0];
  public suggestions = [];

  public settings = {
    positionStrategy: new ConnectedPositioningStrategy({
      closeAnimation: null,
      openAnimation: null,
      verticalDirection: 0,
      verticalStartPoint: 0
    })
  };

  inputSubscription;
  routeSuggestionsSubscription;

  constructor(
    private trips: TripsService,
    private route: RouteService,
    private router: PreviousRouteService,
    private navBar: NavbarService,
    private routerInstance: Router
  ) {
    if (!this.currentUser) {
      this.routerInstance.navigate(['/']);
    }
  }
  

  ngOnInit() {
    this.navBar.updateTitle('Route');
    const previousPage = this.router.getPreviousUrl();
    if (previousPage === '/trips' && this.parsedTrip) {
      this.fromTripsSubmit();
    }
  }

  public onSubmit() {
    this.map.setRoute(this.form);
    this.map.routeSuggestions = from([]);
  }

  public submitTrip(form) {
    form.route = this.form.origin + ' -> ' + this.form.destination;
    form.waypoints = this.form.waypoints;
    this.trips.getETA(this.form.origin, this.form.waypoints, this.form.destination).subscribe((response: any): void => {
      this.milesTraveled = response.distance;
      this.route.saveTrips(form, this.tripId, this.milesTraveled).subscribe(userTrip => {
        console.log('Return from submitTrip function', userTrip);
      });
    });
  }

  public onKey(field, index) {
    let input;
    if (index) input = this.form[field][index];
    else input = this.form[field];

    if (input.length) {
      this.inputSubscription = from(input)
        .pipe(
          debounceTime(250),
          switchMap(text => {
            if (field === 'origin') {
              return this.route.autoSuggestion(input, this.map.currentPosition);
            } else {
              return this.route.autoSuggestion(input, '');
            }
          })
        )
        .subscribe((suggestions: any) => {
          this.suggestions = suggestions;
        });
    }
  }

  public onInputClick() {
    this.suggestions = [];
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }

  public onDateSelection(value) {
    if (value === 'startValue') {
      this.form.dateStart = value;
    }
    this.form.dateEnd = value;
  }

  public autosuggestClick(suggestion) { }

  public fromTripsSubmit() {
    this.form.origin = this.parsedTrip.route.split('->')[0];
    this.form.destination = this.parsedTrip.route.split('-> ')[1];
    this.form.dateStart = new Date(this.parsedTrip.dateStart);
    this.form.dateEnd = new Date(this.parsedTrip.dateEnd);
    this.form.userId = JSON.parse(this.currentUser);
    this.form.route = this.parsedTrip.route;
    this.form.waypoints = this.parsedTrip.wayPoints.filter(waypoint => waypoint.trim()).map(waypoint => waypoint.replace(/,/g, '')) || [];
    this.tripId = this.parsedTrip.id;
    this.trips.getETA(this.form.origin, this.form.waypoints, this.form.destination).subscribe((response: any): void => {
      this.milesTraveled = response.distance;
    })
    setTimeout(() => this.map.setRoute(this.form), 500);
    setTimeout(() => localStorage.removeItem('trip'), 1500);
  }

  addWaypointInput() {
    this.show[this.show.length] = this.show.length;
  }

  removeWaypointInput(index) {
    if (index === 0) this.form.waypoints[0] = '';
    else this.show.splice(index, 1);
  }

  humanReadableDate(isoDate) {
    let day = isoDate.slice(9, 11);
    if (day[0] === '0') day = day.slice(1);
    let month = isoDate.slice(6, 8);
    if (month[0] === 0) month = month.slice(1);
    let year = isoDate.slice(1, 5);

    return `${month}/${day}/${year}`;
  }

  chooseCategory(selected) {
    this.category = selected;
    console.log(this.map.waypoints)
    this.map.routeSuggestions = this.route.getRouteSuggestions(this.map.origin, this.map.destination, this.map.waypoints, selected)
  }

  setWaypoint(location) {
    if (this.form.waypoints.length) {
      this.addWaypointInput()
    }
    this.form.waypoints.push(location.address);
  }

  ngOnDestroy() {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }
}
