import {Component, OnInit} from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {Beer} from "../../../models/beer";
import {BeerService} from "../../../services/beer.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RefresherCustomEvent} from "@ionic/angular";
import {concatMap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  // selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonImg,
    IonText,
    NgIf,
    IonIcon,
    IonSkeletonText,
    IonThumbnail,
    NgClass,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItem,
    IonLabel,
    NgForOf,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonFab,
    IonFabButton
  ],
})
export class HomePage implements OnInit {
  // beers to show on cards
  beer1?: Beer;
  imageUrl1?: string;
  beer2?: Beer;
  imageUrl2?: string;
  beer3?: Beer;
  imageUrl3?: string;
  // state for skeleton text
  isLoadedBeers = false;
  // use when image url is null
  private readonly ALT_IMAGE_URL = 'https://images.punkapi.com/v2/keg.png';

  constructor(
    private beerService: BeerService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.fetchRandomBeers();
  }

  /**
   * Fetch random beers from API
   * @param event
   * @private
   */
  private fetchRandomBeers(event?: RefresherCustomEvent) {
    this.isLoadedBeers = false;
    // fetch 3 beers in order
    this.beerService.getRandomBeer().pipe(
      concatMap(firstBeer => {
        this.beer1 = firstBeer;
        this.imageUrl1 = firstBeer.image_url
          ? firstBeer.image_url
          : this.ALT_IMAGE_URL;
        // start second call
        return this.beerService.getRandomBeer();
      }),
      concatMap(secondBeer => {
        this.beer2 = secondBeer;
        this.imageUrl2 = secondBeer.image_url
          ? secondBeer.image_url
          : this.ALT_IMAGE_URL;
        // start third call
        return this.beerService.getRandomBeer();
      })
    ).subscribe(thirdBeer => {
      this.beer3 = thirdBeer;
      this.imageUrl3 = thirdBeer.image_url
        ? thirdBeer.image_url
        : this.ALT_IMAGE_URL;
      // show card
      this.isLoadedBeers = true;
      // when pull to refresh, complete is necessary
      event?.target.complete();
    });
  }

  /**
   * Handle pull to refresh
   * @param event
   */
  handleRefresh(event: RefresherCustomEvent) {
    this.isLoadedBeers = false;
    this.fetchRandomBeers(event);
  }

  onClickCard(beer: Beer) {
    void this.router.navigate(['/detail'], {state: {beer: beer}});
  }

  onClickFavButton(event: MouseEvent) {
    event.stopPropagation();
  }

  onClickFab() {
    this.fetchRandomBeers();
  }
}
