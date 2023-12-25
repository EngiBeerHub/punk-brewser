import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: true,
  imports: [CommonModule, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class PrivacyPolicyPage {
  url = 'https://engibeerhub.github.io/punk-brewser-privacy-policy/';
  trustedUrl: SafeResourceUrl;

  constructor(private domSanitizer: DomSanitizer) {
    this.trustedUrl = domSanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
