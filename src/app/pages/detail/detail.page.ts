import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonPopover,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {Beer} from "../../models/beer";
import {addIcons} from "ionicons";
import {beer, beerOutline, informationCircleOutline, starOutline, water} from "ionicons/icons";
import {StorageService} from "../../services/storage.service";
import {BeerService} from "../../services/beer.service";
import {FadeInIonImageDirective} from "../../directives/fade-in-ion-image.directive";
import {ToastService} from "../../services/toast.service";

/**
 * state passed from parent component
 */
export interface RouterParameter {
  beer: Beer;
  isFavorite: boolean;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonHeader,
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
    IonBackButton,
    IonButtons,
    IonButton,
    IonItemDivider,
    IonItemGroup,
    IonGrid,
    IonRow,
    IonCol,
    IonProgressBar,
    IonPopover,
    FadeInIonImageDirective
  ]
})
export class DetailPage implements OnInit {
  beer!: Beer;
  imageUrl?: string;
  beerColor!: string;
  isFavorite = false;
  ibuIndex = 0;
  ibuValue = 0;
  private readonly altImageUrl = 'https://images.punkapi.com/v2/keg.png';

  constructor(private storage: StorageService, private beerService: BeerService, private toastService: ToastService) {
    addIcons({starOutline, beer, beerOutline, informationCircleOutline, water});
  }

  ngOnInit(): void {
    // receive params from previous page
    const routerParam = history.state as RouterParameter;
    this.beer = routerParam.beer;
    this.isFavorite = routerParam.isFavorite;
    this.beerColor = this.beerService.getSrmColor(this.beer.srm);
    this.ibuValue = this.beer.ibu / 100;

    this.imageUrl = this.beer.image_url ?? this.altImageUrl;
  }

  ionViewWillEnter() {
    // animate progressbar according to IBU value
    const interval = setInterval(() => {
      this.ibuIndex += 0.01;
      if (this.ibuIndex >= this.ibuValue) {
        clearInterval(interval);
      }
    }, 7.5);
  }

  /**
   * Handle click Fav button
   * @param event
   */
  onClickFavButton(event: MouseEvent) {
    event.stopPropagation();
    void this.toastService.showFavoriteToast(this.isFavorite, this.beer.name);
    this.toggleFavorite();
  }

  /**
   * Toggle favorite status and update storage
   * @private
   */
  private toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.storage.toggleFavorite(this.beer.id);
  }
}
