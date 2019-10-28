import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HttpParams } from "@angular/common/http";
import { CustomHttpParamEncoder } from '../custom-http-param-encoder';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private getRoutePositionsEndpoint = `${environment.BASE_API_URL}/routePositions`;
  private autocompleteAddressEndpoint = `${environment.BASE_API_URL}/autocompleteAddress`;
  private addTripEndpoint = `${environment.BASE_API_URL}/addTrip`;
  private routeSuggestionsEndpoint = `${environment.BASE_API_URL}/routeDirectionsSuggestions`;
  constructor(private http: HttpClient) { }

  getRoutePositions(route) {
    let waypointsString = '';
    for (let point of route.waypoints) {
      if (point.length) waypointsString += point + ';';
    }

    return this.http.get(this.getRoutePositionsEndpoint, {
      params: new HttpParams({ encoder: new CustomHttpParamEncoder() })
                  .set('origin', route.origin)
                  .set('destination', route.destination)
                  .set('waypoints', waypointsString)
    })
  }
  
  autoSuggestion(text, location) {
    let currentPositionString;
    if (location.length) {
      currentPositionString  = `${location.lat},${location.lng}`;
    } else {
      currentPositionString = '';
    }
    return this.http.get(this.autocompleteAddressEndpoint, {
      params: new HttpParams().set('input', text).set('location', currentPositionString)
    })
  }

  saveTrips(form, tripId, milesTraveled) {
    form.tripId = tripId;
    form.milesTraveled = milesTraveled
    console.log('form info that will be saved to the DATABASE', form);
    return this.http.post(this.addTripEndpoint, form);
  }

  getRouteSuggestions(location1, location2, waypoints, category): Observable<any> {
    let waypointsString = '';
    for (let point of waypoints) {
      waypointsString += `${point.location.lat},${point.location.lng};`;
    }
    const loc1 = `${location1.lat},${location1.lng}`;
    const loc2 = `${location2.lat},${location2.lng}`;
    return this.http.get(this.routeSuggestionsEndpoint, {
      params: new HttpParams({ encoder: new CustomHttpParamEncoder() })
      .set('loc1', loc1)
      .set('loc2', loc2)
      .set('waypoints', waypointsString)
      .set('category', category)
      
    })
  }
}