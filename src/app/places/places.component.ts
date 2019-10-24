import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  userId = localStorage.getItem('userId');
  thumbColor = false;
  userPlaces = [];

  constructor(
    private location: LocationService,
    private router: Router,
    private navBar: NavbarService,
    ) {}

  ngOnInit() {
    this.navBar.updateTitle('Places');
    this.getUserPlaces();
  }

  getUserPlaces() {
    this.location.getUserPlaces(this.userId).subscribe(userPlace => {
      this.userPlaces.push(userPlace);
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
