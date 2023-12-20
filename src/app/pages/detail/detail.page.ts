import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {
  AnimationController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {Beer} from "../../models/beer";
import {addIcons} from "ionicons";
import {starOutline} from "ionicons/icons";
import {StorageService} from "../../services/storage.service";

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
    IonButton
  ]
})
export class DetailPage implements OnInit {
  beer!: Beer;
  imageUrl?: string;
  isFavorite = false;
  private readonly altImageUrl = 'https://images.punkapi.com/v2/keg.png';

  constructor(private storage: StorageService, private animationCtrl: AnimationController) {
    addIcons({starOutline});
  }

  ngOnInit(): void {
    // receive params from previous page
    const routerParam = history.state as RouterParameter;
    this.beer = routerParam.beer;
    this.isFavorite = routerParam.isFavorite;

    this.beer.image_url
      ? (this.imageUrl = this.beer.image_url)
      : (this.imageUrl = this.altImageUrl);
  }

  /**
   * Handle click Fav button
   * @param event
   */
  onClickFavButton(event: MouseEvent) {
    event.stopPropagation();
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
    if (this.isFavorite) {
      this.isFavorite = false;
      this.storage.remove(this.beer.id);
    } else {
      this.isFavorite = true;
      this.storage.add(this.beer.id);
    }
  }
}
