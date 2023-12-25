import {Component} from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonNote,
  IonRouterLink,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {Router} from "@angular/router";
import {Browser} from "@capacitor/browser";

@Component({
  selector: 'app-others',
  templateUrl: 'others.page.html',
  styleUrls: ['others.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonList, IonItem, IonLabel, IonNote, IonItemDivider, IonRouterLink],
})
export class OthersPage {
  constructor(private router: Router) {
  }

  /**
   * Handle click Privacy Policy
   */
  async onClickPrivacyPolicy() {
    await Browser.open({url: 'https://engibeerhub.github.io/punk-brewser-privacy-policy/'});
  }

  /**
   * Handle click Terms and Conditions
   */
  async onClickTermsAndConditions() {
    await Browser.open({url: 'https://engibeerhub.github.io/punk-brewser-terms-and-conditions/'});
  }

  /**
   * Handle click Open Source License
   */
  onClickLicenses() {
    void this.router.navigate(['/licenses']);
  }
}
