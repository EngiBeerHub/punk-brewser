import {Injectable} from '@angular/core';
import {ToastController} from "@ionic/angular/standalone";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) {
  }

  async showFavoriteToast(isFavorite: boolean, beerName: string) {
    const message = isFavorite
      ? `Removed ${beerName} from favorites.`
      : `Added ${beerName} to favorites.`;

    const toast = await this.toastCtrl.create({
      position: 'top',
      icon: 'checkmark-circle-outline',
      message: message,
      duration: 1500
    });

    await toast.present();
  }
}
