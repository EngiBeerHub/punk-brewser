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
import {StorageService} from "../../services/storage.service";
import {FadeInIonImageDirective} from "../../directives/fade-in-ion-image.directive";
import {ToastService} from "../../services/toast.service";
import {NavigationService} from "../../services/navigation.service";

@Component({
  selector: 'app-card-summary',
  template: `
      <ion-card button="true" (click)="onClickCard()">
          <ion-card-header>
              <ion-card-title *ngIf="useTitle">{{ beer.name }}</ion-card-title>
              <ion-card-subtitle *ngIf="!useTitle">{{ beer.name }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
              <!-- prevent height change from lazy loading image -->
              <div class="img-container">
                  <!-- lazy loading image -->
                  <ion-img [src]="beer.image_url ? beer.image_url : ALT_IMAGE_URL" appFadeInIonImage></ion-img>
              </div>

              <!-- favorite button -->
              <div class="button-container">
                  <ion-button class="ion-no-margin" fill="clear" (click)="onClickFavButton($event)">
                      <!-- filled if favorite -->
                      <ion-icon *ngIf="isFavorite() else notFavorite" name="star"
                                color="warning"></ion-icon>
                      <ng-template #notFavorite>
                          <ion-icon name="star-outline" color="medium"></ion-icon>
                      </ng-template>
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
    FadeInIonImageDirective,
  ]
})
export class CardSummaryComponent implements OnInit {
  // use title or subtitle
  @Input() useTitle = false;
  @Input() beer!: Beer;
  // isFavorite = false;
  readonly ALT_IMAGE_URL = 'https://images.punkapi.com/v2/keg.png';

  constructor(private storageService: StorageService, private toastService: ToastService, private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    // non-null assertion for required input property
    if (this.beer == null) {
      throw new Error('[beer] is required');
    }
  }

  isFavorite(): boolean {
    return this.storageService.isFavorite(this.beer.id);
  }

  /**
   * Handle click card
   */
  onClickCard() {
    this.navigationService.navigateToDetail(this.beer, this.isFavorite());
  }

  /**
   * Handle click Fav button
   * @param event
   */
  onClickFavButton(event: MouseEvent) {
    event.stopPropagation();
    void this.toastService.showFavoriteToast(this.storageService.isFavorite(this.beer.id), this.beer.name);
    this.storageService.toggleFavorite(this.beer.id);
  }
}
