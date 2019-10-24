import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { LocationService } from '../services/location.service';
import { from } from 'rxjs';
import { IgxCarouselComponent, Direction } from 'igniteui-angular';
import { AgmInfoWindow } from '@agm/core';
import { NavbarService } from '../services/navbar.service';


@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  @ViewChild(MapComponent, { static: false }) private map: MapComponent;
  @ViewChild(IgxCarouselComponent, { static: false })
  private carousel: IgxCarouselComponent;
  @ViewChild(AgmInfoWindow, { static: false })
  private infoWindow: AgmInfoWindow;
  public places = [];
  public images = [];
  public title = 'Your Personalized Stops';
  placesSubscription;
  imagesSubscription;
  currentUser = localStorage.getItem('userId');
  category = {
    bakery: false,
    bar: false,
    cafe: false,
    museum: false,
    park: false,
    restaurant: false,
    shopping: false,
    tourist: false,
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private location: LocationService,
    private navBar: NavbarService
  ) {}

  ngOnInit() {
    // this.updateNavbar();
    const userId = this.route.snapshot.queryParams.id;
    const savedUserId = localStorage.getItem('userId');
    if (userId && !savedUserId) {
      localStorage.setItem('userId', userId);
      window.location.reload();
    }
    this.updateNavbar();
  }

  loadPlaces() {
    if (!this.placesSubscription) {
      // console.log('Map Nearby Places', this.map.nearbyPlaces);
      this.placesSubscription = from(this.map.nearbyPlaces).subscribe(place => {
        // console.log('PLACE', place);
        this.places.push(place);
      });
    }
  }

  loadImages(index) {
    this.images[index] = this.map.images[index].photos[0];
    // console.log('IMAGES LOADED', this.map.images);
  }

  mapMarkerClicked(i) {
    const focus = this.carousel.get(i);
    this.carousel.select(focus, Direction.NEXT);
  }

  onSlideChanged(slideIndex, fromSlide) {
    this.map.markerClick(slideIndex, true);
  }

  navigateWithState(id) {
    this.router.navigateByUrl('/details', { state: { id } });
  }

  chooseCategory(select) {
    const filteredPlaces = this.map.nearbyPlaces.filter(
      place => place.interest === select
    );
    this.places = filteredPlaces;
    this.category[select] = !this.category[select];
    return this.map.nearbyPlaces.filter((place, index) => {
      if (place.interest === select) {
        console.log('Image Index', index);
        console.log(
          'Filtered Places:',
          this.places,
          'Filtered Images:',
          this.images
        );
        this.loadImages(index);
      }
    });
  }
  // const filteredImages = this.map.nearbyPlaces.filter((place, index) => {
  //   if (place.interest === category) {
  //     console.log('Image Index', index);
  //     return this.loadImages(index);
  //   }
  // });
  // const filteredPlaces = this.map.nearbyPlaces.filter(place => place.interest === category);
  // this.places = filteredPlaces;
  // this.images = filteredImages;
  // console.log('Filtered Places:', this.places, 'Filtered Images:', this.images);
  // }

  updateNavbar() {
    this.navBar.updateTitle(this.title);
  }
}
