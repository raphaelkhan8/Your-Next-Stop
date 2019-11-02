import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';
import { NavbarService } from '../services/navbar.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  objectKeys = Object.keys;
  userId = localStorage.getItem('userId');
  thumbColor = false;
  userPlaces = null;

  constructor(
    private location: LocationService,
    private router: Router,
    private navBar: NavbarService,
    ) {
    if (!this.userId) {
      this.router.navigate(['/']);
    }
    }

  ngOnInit() {
    this.navBar.updateTitle('Places');
    this.getUserPlaces();
  }

  getUserPlaces() {
    this.location.getUserPlaces(this.userId).subscribe(userPlace => {
      console.log('User Places', userPlace);
      userPlace['likedPlaces'] = _.groupBy(userPlace['likedPlaces'], place => place.city.slice(0, place.city.length-6));
      userPlace['savedPlaces'] = _.groupBy(userPlace['savedPlaces'], place => place.city.slice(0, place.city.length - 6));
      this.userPlaces = userPlace;
      console.log('this.useeeepp', this.userPlaces)
    });
  }

  navigateWithState(id) {
    this.router.navigateByUrl('/details', { state: { id } });
  }

  toggleThumb() {
    this.thumbColor = !this.thumbColor;
  }

  onUpvote(place) {
    this.toggleThumb();
    this.location.voteInterest(place, status, this.userId)
      .subscribe()
  }
}
