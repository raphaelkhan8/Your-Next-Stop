import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
  @Output() placesLoaded = new EventEmitter<string>();
  // @Output() imagesLoaded = new EventEmitter<string>();
  snapshotUrl = '/results';
  currentUser = localStorage.getItem('userId');
  public allPlaces = [];
  public images = [];
  newColor = false;
  allPlacesSubscription;
  imagesSubscription;
  // private _window;

  constructor(
    public router: Router,
    private locationService: LocationService,
    private navBar: NavbarService,
    ) { }

  ngOnInit() {
    this.navBar.updateTitle('All Results');
    this.loadPlaces();
  }

  loadPlaces() {
    return this.locationService.getCurrentPosition()
    .subscribe(loc => {
      // console.log('LOCATION NATION', loc);
      const stubLocation = {
        coords: { latitude: 29.948661689490685, longitude: -90.07339305901507 }
      };

      this.allPlacesSubscription = this.locationService.getNearbyPlaces(stubLocation, this.snapshotUrl)
      .subscribe(place => {
        this.allPlaces.push(place);
        console.log('ALL PLACES', this.allPlaces[0]);
        //console.log('IMAGE REFERENCE', this.allPlaces[0][0][0].photos);
      });
    })
  }

  navigateWithState(id) {
    // console.log('ID', id);
    this.router.navigateByUrl('/details', { state: { id } });
  }

  toggleColor() {
    this.newColor = !this.newColor;
    console.log('color change');
  }

  onUpvote(place) {
    console.log('PLACE UPVOTED', place);
    this.toggleColor();
    this.locationService.voteInterest(place, null, this.currentUser)
      .subscribe(response => {
        console.log('UPVOTE response', response);
    });
  }

}