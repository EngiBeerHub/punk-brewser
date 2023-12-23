import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Beer} from "../models/beer";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {
  }

  /**
   * Navigate to detail page
   * @param beer
   * @param isFavorite
   */
  navigateToDetail(beer: Beer, isFavorite: boolean) {
    void this.router.navigate(['/detail'], {state: {beer, isFavorite}});
  }
}
