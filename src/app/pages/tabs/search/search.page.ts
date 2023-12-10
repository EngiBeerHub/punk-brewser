import {Component, OnInit, TrackByFunction} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSkeletonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {BeerService} from "../../../services/beer.service";
import {Beer} from "../../../models/beer";
import {NgForOf, NgIf} from "@angular/common";
import {InfiniteScrollCustomEvent, SearchbarCustomEvent} from "@ionic/angular";
import {Router} from "@angular/router";
import {StorageService} from "../../../services/storage.service";

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styles: [],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, NgForOf, IonAvatar, IonImg, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, NgIf, IonSkeletonText, IonIcon, IonButton, IonSearchbar, IonChip],
})
export class SearchPage implements OnInit {
  beers?: Beer[];
  readonly ALT_IMAGE_URL = 'https://images.punkapi.com/v2/keg.png';
  page = 1;
  // to show skeleton
  isLoaded1stPage = false;
  // number of skeleton item while loading
  skeletonArray = Array.from({length: 15}, (_, index) => {
    index++;
  });

  constructor(private beerService: BeerService, private storage: StorageService, private router: Router) {
  }

  ngOnInit() {
    // get first page
    this.beerService.getPage(1).subscribe({
        next: fetchedBeers => {
          this.beers = fetchedBeers;
        },
        complete: () => {
          this.isLoaded1stPage = true;
        }
      }
    );
  }

  /**
   * Check if stored as favorite
   * @param beerId
   */
  isFavorite(beerId: number): boolean {
    return this.storage.includes(beerId);
  }

  /**
   * Handle infinite scroll event
   * @param event
   */
  handleScroll(event: InfiniteScrollCustomEvent) {
    // get next page
    this.beerService.getPage(this.page++).subscribe({
        next: fetchedBeers => {
          this.beers?.push(...fetchedBeers);
          void event.target.complete();
        },
        error: () => {
          void event.target.complete();
        }
      }
    );
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
      this.storage.remove(beerId);
    } else {
      this.storage.add(beerId);
    }
  }

  handleInput(event: SearchbarCustomEvent) {
    console.log(`input: ${event.target.value}`);
  }
}
