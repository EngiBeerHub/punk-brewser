import {Component, Input, OnInit} from '@angular/core';
import {
  AnimationController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonImg,
  ToastController
} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {Beer} from "../../models/beer";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";

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
                  <ion-img [src]="beer.image_url ? beer.image_url : ALT_IMAGE_URL"
                           (ionImgWillLoad)="onLoadImage($event)"></ion-img>
              </div>

              <!-- favorite button -->
              <div class="button-container">
                  <ion-button class="ion-no-margin" fill="clear" (click)="onClickFavButton($event)">
                      <!-- filled if favorite -->
                      <ion-icon *ngIf="isFavorite() else notFavorite" name="star" color="warning"></ion-icon>
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
  ]
})
export class CardSummaryComponent implements OnInit {
  // use title or subtitle
  @Input() useTitle = false;
  @Input() beer!: Beer;
  // isFavorite = false;
  readonly ALT_IMAGE_URL = 'https://images.punkapi.com/v2/keg.png';

  constructor(private router: Router, private storage: StorageService, private toastController: ToastController, private animationCtrl: AnimationController) {
  }

  ngOnInit(): void {
    // non-null assertion for required input property
    if (this.beer == null) {
      throw new Error('[beer] is required');
    }
  }

  isFavorite(): boolean {
    return this.storage.includes(this.beer.id);
  }

  /**
   * Handle click card
   */
  onClickCard() {
    void this.router.navigate(['/detail'], {state: {beer: this.beer, isFavorite: this.isFavorite()}});
  }

  /**
   * Handle click Fav button
   * @param event
   */
  onClickFavButton(event: MouseEvent) {
    event.stopPropagation();
    void this.showToast();
    this.toggleFavorite();
  }

  /**
   * Handle load image and add fade in animation
   * @param event
   */
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
  private toggleFavorite() {
    if (this.isFavorite()) {
      // this.isFavorite = false;
      this.storage.remove(this.beer.id);
    } else {
      // this.isFavorite = true;
      this.storage.add(this.beer.id);
    }
  }

  /**
   * Show toast for adding/removing favorites
   * @private
   */
  private async showToast() {
    const toast = await this.toastController.create({
      position: 'top',
      icon: 'checkmark-circle-outline',
      message: this.isFavorite() ? `Removed ${this.beer.name} from favorites.` : `Added ${this.beer.name} to favorites.`,
      duration: 1500
    });
    await toast.present();
  }
}
