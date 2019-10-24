import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { from, Subscription } from 'rxjs';
import { IgxCarouselComponent, Direction } from 'igniteui-angular';
import { NavbarService } from '../services/navbar.service';


@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  @ViewChild(MapComponent, { static: false }) private map: MapComponent;
  @ViewChild(IgxCarouselComponent, { static: false }) private carousel: IgxCarouselComponent;
  
  public places: Array<any> = [];
  public images: Array<string> = [];
  public title = 'Your Personalized Stops';
  private personalizedPlacesSubscription: Subscription;
  private currentUser = localStorage.getItem('userId');
  private category: string;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private navBar: NavbarService
  ) {}

  ngOnInit() {
    // this.shouldLoad = true;
    const userId = this.route.snapshot.queryParams.id;
    const savedUserId = localStorage.getItem('userId');
    if (userId && !savedUserId) {
      localStorage.setItem('userId', userId);
      window.location.reload();
    }
    this.updateNavbar();
  }

  loadPlaces() {
    if (this.personalizedPlacesSubscription) this.personalizedPlacesSubscription.unsubscribe();
      this.places = [];
      this.personalizedPlacesSubscription = from(this.map.nearbyPlaces).subscribe(place => {
        this.places.push(place);
      });
  }

  loadImages(index) {
    this.images[index] = this.map.images[index].photos[0];
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

  chooseCategory(selected) {
    this.map.setPlaces(selected);
    this.category = selected;
  }
 

  updateNavbar() {
    this.navBar.updateTitle(this.title);
  }
}
