import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
  standalone: true,
  imports: [CommonModule, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class TermsAndConditionsPage {
  url = 'https://engibeerhub.github.io/punk-brewser-terms-and-conditions/';
  trustedUrl: SafeResourceUrl;

  constructor(private domSanitizer: DomSanitizer) {
    this.trustedUrl = domSanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

}
