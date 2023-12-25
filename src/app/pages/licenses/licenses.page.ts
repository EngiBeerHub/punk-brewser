import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from "@angular/common/http";
import {IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-licenses',
  template: `
      <ion-header [translucent]="true">
          <ion-toolbar>
              <ion-buttons>
                  <ion-back-button></ion-back-button>
              </ion-buttons>
              <ion-title>licenses</ion-title>
          </ion-toolbar>
      </ion-header>

      <ion-content [fullscreen]="true" class="ion-padding">
          <pre style="white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word">{{ fileContent$ | async }}</pre>
      </ion-content>
  `,
  styles: [`
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class LicensesPage {
  fileContent$ = this.httpClient.get('assets/3rdpartylicenses.txt', {responseType: 'text'});

  constructor(private httpClient: HttpClient) {
  }

}
