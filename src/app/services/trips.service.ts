import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  private getAllTripsEndpoint = `${environment.BASE_API_URL}/getAllUsersTrips`;
  private deleteTripEndpoint = `${environment.BASE_API_URL}/removeTrip`;
  private getUserStatsEndpoint = `${environment.BASE_API_URL}/getStats`;
  private getEtaEndpoint = `${environment.BASE_API_URL}/eta`;

  constructor(private http: HttpClient) {}

  getAllTrips(user) {
    return this.http.get(`${this.getAllTripsEndpoint}?id=${user}`);
  }

  getStats(user) {
    return this.http.get(`${this.getUserStatsEndpoint}?id=${user}`);
  }

  getETA(origin, waypoints, destination) {
    return this.http.get(this.getEtaEndpoint, {
      params: new HttpParams()
        .set('origin_addresses', origin)
        .set('destination_addresses', destination)
        .set('waypoints', waypoints)
    });
  }

  deleteTrip(selectedTrip) {
    console.log('Trip about to be deleted', selectedTrip);
    return this.http.post(this.deleteTripEndpoint, selectedTrip);
  }
}