import {Component, TrackByFunction} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {StorageService} from "../../../services/storage.service";
import {Beer} from "../../../models/beer";
import {BeerService} from "../../../services/beer.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonSkeletonText, IonThumbnail, IonIcon, IonButton, IonText]
})
export class FavoritesPage {
  favIds: number[] = [];
  favBeers: Beer[] = [];
  isLoadedBeers = false;
  skeletonArray = Array.from({length: 15}, (_, index) => {
    index++;
  });
  readonly ALT_IMAGE_URL = 'https://images.punkapi.com/v2/keg.png';

  constructor(private storageService: StorageService, private beerService: BeerService, private router: Router) {
  }

  ionViewWillEnter() {
    this.isLoadedBeers = false;
    // fetch favorite beers
    this.favIds = this.storageService.favIds;
    this.beerService.getBeersByIds(this.favIds).subscribe({
      next: fetchedBeers => {
        this.favBeers = fetchedBeers;
        this.isLoadedBeers = true;
      }
    });
  }

  /**
   * Check if stored as favorite
   * @param beerId
   */
  isFavorite(beerId: number): boolean {
    return this.storageService.includes(beerId);
  }

  /**
   * Tracking function to optimize loading
   * @param index
   * @param beer
   */
  trackByBeerId: TrackByFunction<Beer> = (index: number, beer: Beer) => beer.id;

  /**
   * Handle click item
   * @param beer
   */
  onClickItem(beer: Beer) {
    void this.router.navigate(['/detail'], {state: {beer: beer, isFavorite: this.isFavorite(beer.id)}});
  }

  /**
   * Handle click Fav button
   * @param event
   * @param beerId
   */
  onClickFavButton(event: MouseEvent, beerId: number) {
    event.stopPropagation();
    this.toggleFavorite(beerId);
  }

  /**
   * Toggle favorite status and update storage
   * @private
   */
  private toggleFavorite(beerId: number) {
    if (this.isFavorite(beerId)) {
      this.storageService.remove(beerId);
    } else {
      this.storageService.add(beerId);
    }
  }
}
