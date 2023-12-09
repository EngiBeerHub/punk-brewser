import {Component, OnInit, TrackByFunction} from '@angular/core';
import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {BeerService} from "../../../services/beer.service";
import {Beer} from "../../../models/beer";
import {NgForOf} from "@angular/common";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, NgForOf, IonAvatar, IonImg, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonThumbnail],
})
export class Tab2Page implements OnInit {
  beers?: Beer[];
  readonly ALT_IMAGE_URL = 'https://images.punkapi.com/v2/keg.png';
  page = 1;

  constructor(private beerService: BeerService, private router: Router) {
  }

  ngOnInit() {
    // get first page
    this.beerService.getPage(1).subscribe({
        next: fetchedBeers => {
          this.beers = fetchedBeers;
        }
      }
    );
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
        }
      }
    );
  }

  /**
   * Handle click item
   * @param beer
   */
  onClickItem(beer: Beer) {
    void this.router.navigate(['/detail'], {state: {beer: beer}});
  }

  /**
   * Tracking function to optimize loading
   * @param index
   * @param beer
   */
  trackByBeerId: TrackByFunction<Beer> = (index: number, beer: Beer) => beer.id;
}
