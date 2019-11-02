import { DetailsComponent } from './../details/details.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TripsService } from '../services/trips.service';
import { NavbarService } from '../services/navbar.service';
@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit, OnDestroy {
  currentUser = localStorage.getItem('userId');

  details = {
    origin: '',
    destination: '',
    wayPoints: [],
    start: '',
    end: '',
    distance: '',
    duration: ''
  };

  etaSubscription;

  public upcoming = [];
  public current = [];
  public previous = [];

  constructor(private trips: TripsService, private navBar: NavbarService, private router: Router) {
    if (!this.currentUser) {
      this.router.navigate(['/']);
    }
  }

  public editTrip(event, trip) {
    // console.log('TRIP SELECTED FROM TRIPS PAGE GOING INTO LOCALSTORAGE', trip);
    let storageTrip = JSON.stringify(trip);
    localStorage.setItem('trip', storageTrip);
    event.dialog.close();
    //window.location.href = '/route';
    this.router.navigate(['/route']);
  }

  ngOnInit() {
    this.navBar.updateTitle('Trips');
    this.getAllTrips();
  }

  getEta(origin, waypoints, destination) {
    this.trips.getETA(origin, waypoints, destination).subscribe((response: any): void => {
      this.details.distance = response.distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
      this.details.duration = response.duration;
    });
  }

  tripDetails(trip) {
    this.details.origin = trip.route.split('->')[0];
    this.details.destination = trip.route.split('->')[1];
    this.details.wayPoints = trip.wayPoints.filter(waypoint => waypoint.length).map(waypoint => waypoint.trim().replace(/,/g, ''));
    // ${trip.wayPoints.filter(waypoint => waypoint.length)
    //   .map((waypoint, i) => `Waypoint ${i + 1}: ${waypoint}`).join('\n')}
    // this.details.wayPoints;
    this.details.start = new Date(trip.dateStart.split('T')[0]).toDateString();
    this.details.end = new Date(trip.dateEnd.split('T')[0]).toDateString();
    this.getEta(this.details.origin, this.details.wayPoints, this.details.destination);
  }

  getAllTrips() {
    return this.trips
      .getAllTrips(this.currentUser)
      .subscribe((response: Object[]): void => {
        // console.log('Trips RETRIEVED from database', response);
        response.forEach(element => {
          if (element[0].status === 'current') {
            this.current = this.current.concat(element);
          }
          if (element[0].status === 'previous') {
            this.previous = this.previous.concat(element);
          } else if (element[0].status === 'upcoming') {
            this.upcoming = this.upcoming.concat(element);
          }
        });
      });
  }

  deleteTrip(trip) {
    return this.trips.deleteTrip(trip).subscribe(() => {
      if (trip.status === 'current') {
        this.current = this.current.filter(currentTrip => currentTrip.id !== trip.id);
      }
      if (trip.status === 'upcoming') {
        this.upcoming = this.upcoming.filter(upcomingTrip => upcomingTrip.id !== trip.id);
      }
      if (trip.status === 'previous') {
        this.previous = this.previous.filter(previousTrip => previousTrip.id !== trip.id);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.etaSubscription) {
      this.etaSubscription.unsubscribe();
    }
  }
}
