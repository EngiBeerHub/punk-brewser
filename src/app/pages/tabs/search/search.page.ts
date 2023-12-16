import {Component, OnInit, TrackByFunction} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonChip,
  IonCol,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonFab,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRange,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonText,
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
import {Keyboard} from "@capacitor/keyboard";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, NgForOf, IonAvatar, IonImg, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail, NgIf, IonSkeletonText, IonIcon, IonButton, IonSearchbar, IonChip, IonSegment, IonSegmentButton, IonFab, IonFabButton, IonModal, IonButtons, IonFooter, IonRange, IonDatetimeButton, IonDatetime, IonText, IonCheckbox, IonGrid, IonRow, IonCol, FormsModule],
})
export class SearchPage implements OnInit {
  // number of skeleton item while loading
  readonly skeletonArray = Array.from({length: 15}, (_, index) => {
    index++;
  });
  readonly ALT_IMAGE_URL = 'https://images.punkapi.com/v2/keg.png';
  readonly defaultPage = 1;
  pageIndex = 1;
  beers?: Beer[];
  // to show skeleton
  isLoadedBeers = false;
  // search mode to prevent scroll event
  isSearched = false;
  // bind to checkboxes
  isBrewedAfterEnabled = false;
  isBrewedBeforeEnabled = false;

  constructor(private beerService: BeerService, private storage: StorageService, private router: Router) {
  }

  ngOnInit() {
    // get first page
    this.fetchFirstPage();
  }

  /**
   * Fetch first page of all beers
   * @private
   */
  private fetchFirstPage() {
    this.resetPageIndex();
    this.isSearched = false;
    this.isLoadedBeers = false;
    this.beerService.getPage(this.defaultPage).subscribe({
        next: fetchedBeers => {
          this.beers = fetchedBeers;
        },
        complete: () => {
          this.isLoadedBeers = true;
        }
      }
    );
  }

  /**
   * Reset page index
   * @private
   */
  private resetPageIndex() {
    this.pageIndex = 1;
  }

  /**
   * Check if stored as favorite
   * @param beerId
   */
  isFavorite(beerId: number): boolean {
    return this.storage.includes(beerId);
  }

  /**
   * Handle infinite scroll event when not search mode
   * @param event
   */
  handleScroll(event: InfiniteScrollCustomEvent) {
    // get next page
    this.beerService.getPage(this.pageIndex++).subscribe({
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

  /**
   * Handle value change of searchbar
   * @param event
   */
  handleSearch(event: SearchbarCustomEvent) {
    console.log(`search value: ${event.target.value}`);
    void Keyboard.hide();

    if (event.target.value) { // if some name searched
      this.isLoadedBeers = false;
      this.beerService.getBeersByName(event.target.value).subscribe({
        next: fetchedBeers => {
          this.beers = fetchedBeers;
        },
        complete: () => {
          this.isSearched = true;
          this.isLoadedBeers = true;
        }
      });
    } else if (event.target.value === '') { // if entered with blank, fetch all beers again
      // Fetch first page again
      this.fetchFirstPage();
    }
  }

  /**
   * Handle clear button of searchbar
   */
  handleClearSearch() {
    // Fetch first page again
    this.fetchFirstPage();
  }

  handleCancelSearch() {
  }

  /**
   * Necessary to disable dismiss by swipe
   * @param data
   * @param role
   */
  async disableDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }
}
