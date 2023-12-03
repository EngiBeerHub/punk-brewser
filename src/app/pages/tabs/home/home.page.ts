import {Component, OnInit} from '@angular/core';
import {
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
  IonLoading,
  IonText, IonIcon
} from "@ionic/angular/standalone";
import {Beer} from "../../../models/beer";
import {BeerService} from "../../../services/beer.service";
import {NgIf} from "@angular/common";

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
    IonLoading,
    IonText,
    NgIf,
    IonIcon
  ],
})
export class HomePage implements OnInit {
  beer?: Beer;
  isLoadedBeer = false;
  isLoadedImage = false;
  imageUrl?: string;
  readonly altImageUrl = 'https://images.punkapi.com/v2/keg.png';

  constructor(
    private beerService: BeerService
  ) {
  }

  ngOnInit(): void {
    this.beerService.getRandomBeer().subscribe({
      next: (fetchedBeer) => {
        this.beer = fetchedBeer;
        // set alternative keg image when image url is null.
        this.beer.image_url
          ? (this.imageUrl = this.beer.image_url)
          : (this.imageUrl = this.altImageUrl);
        // show card
        this.isLoadedBeer = true;
      },
      error: (error) => {
        // TODO: not implemented yet.
      },
      complete: () => console.log('getRandomBeer completed.'),
    });
  }
}
