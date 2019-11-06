import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';
import { NavbarService } from '../services/navbar.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
  @Output() placesLoaded = new EventEmitter<string>();
  
  snapshotUrl = '/results';
  currentUser = localStorage.getItem('userId');
  public allPlaces = [];
  public images = [];
  newColor = false;
  allPlacesSubscription;
  imagesSubscription;

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
      this.allPlacesSubscription = this.locationService.getCurrentPosition()
      .pipe(
        switchMap((pos): Observable<any> => this.locationService.getNearbyPlaces(pos, this.snapshotUrl))
      )
      .subscribe(place => {
        this.allPlaces.push(place);
      });
    })
  }

  navigateWithState(id) {
    this.router.navigateByUrl('/details', { state: { id } });
  }

  toggleColor() {
    this.newColor = !this.newColor;
  }

  onUpvote(place) {
    this.toggleColor();
    this.locationService.voteInterest(place, null, this.currentUser)
      .subscribe();
  }

}