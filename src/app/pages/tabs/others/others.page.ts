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

  onClickPrivacyPolicy() {
    void this.router.navigate(['/privacy-policy']);
  }

  onClickTermsAndConditions() {
    void this.router.navigate(['/terms-and-conditions']);
  }

  onClickLicenses() {
    void this.router.navigate(['/licenses']);
  }
}
