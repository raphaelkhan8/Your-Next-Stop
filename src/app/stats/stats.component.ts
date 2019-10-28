import { Component, OnInit } from '@angular/core';
import { TripsService } from '../services/trips.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  userId = localStorage.getItem('userId');
  nearbyPlaces = JSON.parse(localStorage.getItem('allUserNearbyPlaces'));
  public stats = null;

  constructor(private trips: TripsService, private navBar: NavbarService) {}

  ngOnInit() {
    this.navBar.updateTitle('Stats');
    this.getStats();
  }

  getStats() {
    this.trips.getStats(this.userId).subscribe(stats => {
      console.log('STATS', stats);
      this.stats = stats;
      if (this.stats.milesTraveled > 999) {
        this.stats.milesTraveled = this.stats.milesTraveled
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return this.stats;
      }
    });
  }
}
