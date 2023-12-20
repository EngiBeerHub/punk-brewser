import {Component, OnInit, TrackByFunction} from '@angular/core';
import {
  AnimationController,
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
import {BeerService, SearchCondition} from "../../../services/beer.service";
import {Beer} from "../../../models/beer";
import {NgForOf, NgIf} from "@angular/common";
import {DatetimeCustomEvent, InfiniteScrollCustomEvent, RangeCustomEvent, SearchbarCustomEvent} from "@ionic/angular";
import {Router} from "@angular/router";
import {StorageService} from "../../../services/storage.service";
import {Keyboard} from "@capacitor/keyboard";
import {FormsModule} from "@angular/forms";

// Range limit
interface Range {
  min: number;
  max: number;
}

// Range value
interface RangeValue {
  lower: number;
  upper: number;
}

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
  pageIndex = this.defaultPage;
  beers?: Beer[];
  // to show skeleton
  isLoadedBeers = false;
  searchText?: string | null;
  // ABV
  isAbvEnabled = false; // bind to checkbox
  readonly abvRange: Range = {min: 0, max: 60}; // abv value range
  abvValue: RangeValue = {lower: this.abvRange.min, upper: this.abvRange.max}; // abv value
  // IBU
  isIbuEnabled = false;
  readonly ibuRange: Range = {min: 0, max: 250};
  ibuValue: RangeValue = {lower: this.ibuRange.min, upper: this.ibuRange.max};
  // EBC
  isEbcEnabled = false;
  readonly ebcRange: Range = {min: 0, max: 600};
  ebcValue: RangeValue = {lower: this.ebcRange.min, upper: this.ebcRange.max};
  // Brewed After
  isBrewedAfterEnabled = false;
  brewedAfter?: string;
  // Brewed Before
  isBrewedBeforeEnabled = false;
  brewedBefore?: string;

  searchCondition?: SearchCondition;

  constructor(private beerService: BeerService, private storage: StorageService, private router: Router, private animationCtrl: AnimationController) {
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
    this.isLoadedBeers = false;
    this.beerService.fetchBeerPageByConditions(undefined, this.defaultPage).subscribe({
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
  onScroll(event: InfiniteScrollCustomEvent) {
    // get next page
    if (this.searchCondition) {
      this.beerService.fetchBeerPageByConditions(this.searchCondition!, ++this.pageIndex).subscribe({
        next: fetchedBeers => {
          this.beers?.push(...fetchedBeers);
          void event.target.complete();
        },
        error: () => {
          void event.target.complete();
        }
      });
    } else {
      this.beerService.fetchBeerPageByConditions(undefined, ++this.pageIndex).subscribe({
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

  onLoadImage(event: any) {
    const animation = this.animationCtrl.create()
      .addElement(event.target)
      .duration(500)
      .fromTo('opacity', '0', '1');
    void animation.play();
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
  onChangeSearchbar(event: SearchbarCustomEvent) {
    console.debug(`search value: ${event.target.value}`);
    void Keyboard.hide();
    this.searchText = event.target.value;
    this.updateSearchCondition();
    this.searchWithCondition();

    // if (event.target.value) { // if some name searched
    //   this.searchWithCondition();
    // } else if (event.target.value === '') { // if entered with blank, fetch all beers again
    //   // Fetch first page again
    //   this.fetchFirstPage();
    // }
  }

  /**
   * Necessary to disable dismiss by swipe
   * @param data
   * @param role
   */
  async disableDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  /**
   * Handle change of AVB
   * @param event
   */
  onChangeAbv(event: RangeCustomEvent) {
    this.abvValue = event.target.value as RangeValue;
  }

  /**
   * Handle change of IBU
   * @param event
   */
  onChangeIbu(event: RangeCustomEvent) {
    this.ibuValue = event.target.value as RangeValue;
  }

  /**
   * Handle change of EBC
   * @param event
   */
  onChangeEbc(event: RangeCustomEvent) {
    this.ebcValue = event.target.value as RangeValue;
  }

  /**
   * Handle change of Brewed After
   * @param event
   */
  onChangeBrewedAfter(event: DatetimeCustomEvent) {
    // if not changed, undefined is fired
    if (event.target.value == null) {
      this.brewedAfter = this.getTodayString();
    } else {
      this.brewedAfter = event.target.value as string;
    }
  }

  /**
   * Handle change of Brewed Before
   * @param event
   */
  onChangeBrewedBefore(event: DatetimeCustomEvent) {
    // if not changed, undefined is fired
    if (event.target.value == null) {
      this.brewedBefore = this.getTodayString();
    } else {
      this.brewedBefore = event.target.value as string;
    }
  }

  /**
   * Get today's string
   * @private
   */
  private getTodayString(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Handle applying filtering
   */
  onApplyFiltering() {
    console.debug('filtering applied.');
    // if checked but undefined, today
    if (this.isBrewedAfterEnabled && !this.brewedAfter) {
      this.brewedAfter = this.getTodayString();
    }
    // if checked but undefined, today
    if (this.isBrewedBeforeEnabled && !this.brewedBefore) {
      this.brewedBefore = this.getTodayString();
    }
    this.updateSearchCondition();
    this.searchWithCondition();
  }

  /**
   * Handle clearing filtering
   */
  onClearFiltering() {
    // ABV
    this.isAbvEnabled = false; // bind to checkbox
    this.abvValue = {lower: this.abvRange.min, upper: this.abvRange.max}; // abv value
    // IBU
    this.isIbuEnabled = false;
    this.ibuValue = {lower: this.ibuRange.min, upper: this.ibuRange.max};
    // EBC
    this.isEbcEnabled = false;
    this.ebcValue = {lower: this.ebcRange.min, upper: this.ebcRange.max};
    // Brewed After
    this.isBrewedAfterEnabled = false;
    this.brewedAfter = undefined;
    // Brewed Before
    this.isBrewedBeforeEnabled = false;
    this.brewedBefore = undefined;

    this.searchCondition = undefined;
  }

  /**
   * Update search condition
   * @private
   */
  private updateSearchCondition() {
    this.searchCondition = {
      name: this.searchText ? this.searchText : undefined,
      abvLower: this.isAbvEnabled ? this.abvValue.lower : undefined,
      abvUpper: this.isAbvEnabled ? this.abvValue.upper : undefined,
      ibuLower: this.isIbuEnabled ? this.ibuValue.lower : undefined,
      ibuUpper: this.isIbuEnabled ? this.ibuValue.upper : undefined,
      ebcLower: this.isEbcEnabled ? this.ebcValue.lower : undefined,
      ebcUpper: this.isEbcEnabled ? this.ebcValue.upper : undefined,
      brewedAfter: this.isBrewedAfterEnabled ? this.brewedAfter : undefined,
      brewedBefore: this.isBrewedBeforeEnabled ? this.brewedBefore : undefined
    };
  }

  /**
   * Search beers with conditions
   * @private
   */
  private searchWithCondition(page: number = 1) {
    this.resetPageIndex();
    this.isLoadedBeers = false;
    this.beerService.fetchBeerPageByConditions(this.searchCondition, page).subscribe({
      next: fetchedBeers => {
        this.beers = fetchedBeers;
      },
      complete: () => {
        this.isLoadedBeers = true;
      }
    });
  };
}
