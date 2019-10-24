import { Component, OnInit } from '@angular/core';
import { TripsService } from '../services/trips.service';
import { NavbarService } from '../services/navbar.service';
@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {
  currentUser = localStorage.getItem('userId');

  upcomingDetails = {
    origin: '',
    destination: '',
    wayPoints: [],
    start: '',
    end: ''
  };

  currentDetails = {
    origin: '',
    destination: '',
    wayPoints: [],
    start: '',
    end: ''
  };

  previousDetails = {
    origin: '',
    destination: '',
    wayPoints: [],
    start: '',
    end: ''
  };

  public upcoming = [];
  public current = [];
  public previous = [];

  constructor(private trips: TripsService, private navBar: NavbarService) {}

  public editTrip(event, trip) {
    // console.log('TRIP SELECTED FROM TRIPS PAGE GOING INTO LOCALSTORAGE', trip);
    let storageTrip = JSON.stringify(trip);
    localStorage.setItem('trip', storageTrip);
    event.dialog.close();
    window.location.href = '/route';
  }

  ngOnInit() {
    this.navBar.updateTitle('Trips');
    this.getAllTrips();
  }

  currentTrip(trip) {
    this.currentDetails.origin = trip.route.split('->')[0];
    this.currentDetails.destination = trip.route.split('->')[1];
    // ${trip.wayPoints.filter(waypoint => waypoint.length)
    //   .map((waypoint, i) => `Waypoint ${i + 1}: ${waypoint}`).join('\n')}
    // this.upcomingDetails.wayPoints;
    this.currentDetails.start = new Date(
      trip.dateStart.split('T')[0]
    ).toDateString();
    this.currentDetails.end = new Date(
      trip.dateEnd.split('T')[0]
    ).toDateString();
  }

  upcomingTrip(trip) {
    this.upcomingDetails.origin = trip.route.split('->')[0];
    this.upcomingDetails.destination = trip.route.split('->')[1];
    // ${trip.wayPoints.filter(waypoint => waypoint.length)
    //   .map((waypoint, i) => `Waypoint ${i + 1}: ${waypoint}`).join('\n')}
    // this.upcomingDetails.wayPoints;
    this.upcomingDetails.start = new Date(
      trip.dateStart.split('T')[0]
    ).toDateString();
    this.upcomingDetails.end = new Date(
      trip.dateEnd.split('T')[0]
    ).toDateString();
  }

  previousTrip(trip) {
    this.previousDetails.origin = trip.route.split('->')[0];
    this.previousDetails.destination = trip.route.split('->')[1];
    // ${trip.wayPoints.filter(waypoint => waypoint.length)
    //   .map((waypoint, i) => `Waypoint ${i + 1}: ${waypoint}`).join('\n')}
    // this.upcomingDetails.wayPoints;
    this.previousDetails.start = new Date(
      trip.dateStart.split('T')[0]
    ).toDateString();
    this.previousDetails.end = new Date(
      trip.dateEnd.split('T')[0]
    ).toDateString();
  }

  getAllTrips() {
    return this.trips
      .getAllTrips(this.currentUser)
      .subscribe((response: Object[]): void => {
        // console.log('Trips RETRIEVED from database', response);
        response.forEach(element => {
          if (element[0].status === 'current') {
            this.current.push(element);
          }
          if (element[0].status === 'previous') {
            this.previous.push(element);
          } else if (element[0].status === 'upcoming') {
            this.upcoming.push(element);
          }
        });
      });
  }
}
