import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router'
import { LocationService } from '../services/location.service';
import { map, take } from 'rxjs/operators';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  thumbColor = false;
  saveColor = false;
  state$: Observable<object>;
  placeId: string;
  selectedPlaceInfo: {
    photo: any,
    name: any,
    interest: any, 
    category: any, 
    priceLevel: any, 
    rating: any, 
    website: any, 
    phone: any, 
    address: any,
    status?: string,
    formattedPhone?: string
  };
  selectedPlacePhoto: null;
  currentUser = localStorage.getItem('userId');
  currentLocationSubscription: Subscription;
  currentLocation;
  
  constructor(
    public activatedRoute: ActivatedRoute,
    private location: LocationService,
    private navBar: NavbarService,
    ) { }
  
  toggleThumb() {
    this.thumbColor = !this.thumbColor;
  }

  toggleSave() {
    this.saveColor = !this.saveColor;
  }

  ngOnInit() {
    this.navBar.updateTitle('Details');
    this.state$ = this.activatedRoute.paramMap
      .pipe(
        map((value) => this.placeId = window.history.state),
        take(1)
        )
    this.state$.subscribe(state => 
      this.getPlaceInfo(state));
    this.currentLocationSubscription = this.location
      .getCurrentPosition()
      .subscribe(position => this.currentLocation = position);
}

  getPlaceInfo(place) {
    const currentUser = localStorage.getItem('userId');
    this.location.getPlaceInfo(place, currentUser)
    .subscribe((info: any) => {
      this.selectedPlaceInfo = info;
      const phone = this.selectedPlaceInfo.phone;
      this.selectedPlaceInfo.formattedPhone = this.formatPhoneNumber(phone);
      
      if (info.status === 'liked') {
        this.selectedPlaceInfo.status = 'liked';
        this.thumbColor = true; 
      }
      if (info.status === 'saved') {
        this.selectedPlaceInfo.status = 'saved';
        this.saveColor = true;
      } 
    })
  }

  onSelection(place, status) {
    let action = status;
    if (status === 'liked') {
      this.toggleThumb();
      if (this.saveColor) {
        this.saveColor = false;
      }
      if (this.selectedPlaceInfo.status === 'liked') {
        action = 'remove';
        this.selectedPlaceInfo.status = null;
      } else {
        this.selectedPlaceInfo.status = 'liked';
      }
      

    } else {
      this.toggleSave();
      if (this.thumbColor) {
        this.thumbColor = false;
      }
      if (this.selectedPlaceInfo.status === 'saved') {
        action = 'remove';
        this.selectedPlaceInfo.status = null;
      } else {
        this.selectedPlaceInfo.status = 'saved';
      }
    }
    this.location.voteInterest(place, action, this.currentUser)
      .subscribe();
  }

  formatPhoneNumber(number) {
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let formattedNumber = '';
    number && number.split('').forEach(string => {if (numbers.indexOf(string) !== -1) { formattedNumber += string; }})
    return formattedNumber;
  }

}
