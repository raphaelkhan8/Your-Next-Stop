import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private getNearbyPlacesEndpoint = `${environment.BASE_API_URL}/nearbyPlaces`;
  private getNearbyPlacesByCategoryEndpoint = `${environment.BASE_API_URL}/nearbyPlacesByCategory`;
  private voteInterestEndpoint = `${environment.BASE_API_URL}/likedInterest`;
  private getPlaceInfoEndpoint = `${environment.BASE_API_URL}/getPlaceInfo`;
  private getUserPlacesEndpoint = `${environment.BASE_API_URL}/getLikedAndSavedForLater`;
  private wait = false;

  constructor(private http: HttpClient) { }
  
  public getCurrentPosition(): Observable<Position> {
    return new Observable((observer) => {
      // Get the next and error callbacks. These will be passed in when
      // the consumer subscribes.
      let watchId;
      // next callback
      const onSuccess: PositionCallback = function(pos: Position) {
        observer.next(pos);
      };
      // error callback
      const onError: PositionErrorCallback | any = function(error) {
        observer.error(error);
      };
    
      // Simple geolocation API check provides values to publish
      if (navigator.geolocation) {
        watchId = navigator.geolocation.getCurrentPosition(onSuccess, onError,
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 0
          }
          );
      } else {
        onError('Geolocation not available');
      }
      // When the consumer unsubscribes, clean up data ready for next subscription.
      return {unsubscribe() { navigator.geolocation.clearWatch(watchId); }};
    })
  }

  public getNearbyPlaces(location, snapshotUrl) {
    
    const currentPositionString = `${location.coords.latitude},${location.coords.longitude}`;
    const id = localStorage.getItem('userId');

      return this.http.get(this.getNearbyPlacesEndpoint, {
        params: new HttpParams()
        .set('location', currentPositionString)
        .set('id', id)
        .set('snapshotUrl', snapshotUrl)
      })
  
  }

  public getNearbyPlacesByCategory(location, category) {
    
    const currentPositionString = `${location.coords.latitude},${location.coords.longitude}`;

      return this.http.get(this.getNearbyPlacesByCategoryEndpoint, {
        params: new HttpParams()
        .set('location', currentPositionString)
        .set('category', category)
        
      })
  
  }

  public getPlacePhoto(coordinates) {
    return this.http.get(`${environment.BASE_API_URL}/yelpAPI`, {
      params: new HttpParams()
      .set('latitude', coordinates.lat)
      .set('longitude', coordinates.lng)
      .set('name', coordinates.name)
    })
    // return this.http.get(this.getPlacePhotoEndpoint, {
    //   responseType: "blob",
    //   params: new HttpParams().set('ref', photoRef)
    // })
  }

  public getPlaceInfo(place, userId) {
    const placeId = place.id;
    return this.http.get(`${this.getPlaceInfoEndpoint}`, {
      params: new HttpParams()
      .set("userId", userId)
      .set("placeId", placeId)
    })
  }

  voteInterest(votedPlace, action, userId) {
    const placeId = votedPlace.placeId;
    if (action === 'remove') {
      return this.http.delete(this.voteInterestEndpoint, {
        params: new HttpParams()
        .set('placeId', placeId)
        .set('userId', userId)
      })
    } 

    return this.http.post(this.voteInterestEndpoint, {
      status: action,
      userId,
      interest: votedPlace.interest || votedPlace.category,
      name: votedPlace.name,
      hours: votedPlace.hours,
      coordinates: votedPlace.coordinates,
      city: votedPlace.city,
      address: votedPlace.address,
      phone: votedPlace.phone,
      photoRef: votedPlace.photos || votedPlace.photo,
      placeId: votedPlace.placeId,
      priceLevel: votedPlace.priceLevel,
      rating: votedPlace.rating,
      review: votedPlace.reviews || null,
      website: votedPlace.website || 'No website available',
    });
  }

  getUserPlaces(user) {
    return this.http.get(`${this.getUserPlacesEndpoint}?id=${user}`);
  }

}
