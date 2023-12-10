import {Component, Input, OnInit} from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonImg
} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {Beer} from "../../models/beer";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-card-summary',
  template: `
      <ion-card button="true" (click)="onClickCard(beer)">
          <ion-card-header>
              <ion-card-title *ngIf="useTitle">{{ beer.name }}</ion-card-title>
              <ion-card-subtitle *ngIf="!useTitle">{{ beer.name }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
              <!-- prevent height change from lazy loading image -->
              <div class="img-container">
                  <!-- lazy loading image -->
                  <ion-img [src]="beer.image_url ? beer.image_url : ALT_IMAGE_URL"></ion-img>
              </div>

              <!-- favorite button -->
              <div class="button-container">
                  <ion-button class="ion-no-margin" fill="clear" (click)="onClickFavButton($event)">
                      <ion-icon name="star-outline" color="medium"></ion-icon>
                  </ion-button>
              </div>
          </ion-card-content>
      </ion-card>
  `,
  styles: [`
    ion-img::part(image) {
      max-height: 20vh;
    }

    .img-container {
      height: 20vh;
    }

    ion-card {
      margin: 0;

      ion-card-content {
        padding-bottom: 0;
      }

      .button-container {
        display: flex;
        justify-content: center;
      }
    }
  `],
  standalone: true,
  imports: [
    IonCard,
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonIcon,
    IonImg,
    NgIf,
  ]
})
export class CardSummaryComponent implements OnInit {
  // use title or subtitle
  @Input() useTitle = false;
  @Input() beer!: Beer;
  readonly ALT_IMAGE_URL = 'https://images.punkapi.com/v2/keg.png';

  constructor(private router: Router, private storage: StorageService) {
  }

  ngOnInit(): void {
    if (this.beer == null) {
      throw new Error('[beer] is required');
    }
  }

  /**
   * Handle click card
   * @param beer
   */
  onClickCard(beer: Beer) {
    void this.router.navigate(['/detail'], {state: {beer: beer}});
  }

  /**
   * Handle click Fav button
   * @param event
   */
  onClickFavButton(event: MouseEvent) {
    event.stopPropagation();
    this.storage.add(this.beer!.id);
  }
}
