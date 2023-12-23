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
import {CardSummaryComponent} from "../../../components/card-summary/card-summary.component";
import {SkeletonSummaryComponent} from "../../../components/skeleton-summary/skeleton-summary.component";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonSkeletonText, IonThumbnail, IonIcon, IonButton, IonText, CardSummaryComponent, SkeletonSummaryComponent]
})
export class FavoritesPage {
  favIds: number[] = [];
  favBeers: Beer[] = [];
  isLoadedBeers = false;
  skeletonArray = Array.from({length: 3}, (_, index) => {
    index++;
  });
  readonly ALT_IMAGE_URL = 'https://images.punkapi.com/v2/keg.png';

  constructor(private storageService: StorageService, private beerService: BeerService) {
  }

  ionViewWillEnter() {
    this.isLoadedBeers = false;
    // fetch favorite beers
    this.favIds = this.storageService.favIds;
    this.beerService.fetchBeersByIds(this.favIds).subscribe({
      next: fetchedBeers => {
        this.favBeers = fetchedBeers;
        this.isLoadedBeers = true;
      }
    });
  }

  /**
   * Tracking function to optimize loading
   * @param index
   * @param beer
   */
  trackByBeerId: TrackByFunction<Beer> = (index: number, beer: Beer) => beer.id;
}
