import {Component, Input} from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText
} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-skeleton-summary',
  template: `
      <ion-card style="margin: 0;">
          <ion-card-header>
              <ion-card-title *ngIf="useTitle">
                  <ion-skeleton-text
                          animated="true"
                          style="height: 1.6rem; width: 90%">
                  </ion-skeleton-text>
              </ion-card-title>
              <ion-card-subtitle *ngIf="!useTitle">
                  <ion-skeleton-text
                          animated="true"
                          style="height: 1.25rem; width: 90%">
                  </ion-skeleton-text>
              </ion-card-subtitle>
          </ion-card-header>
          <ion-card-content style="padding-bottom: 0">
              <!-- image -->
              <div style="display: flex; justify-content: center">
                  <ion-skeleton-text
                          animated="true"
                          style="height: 19.054vh; width: 10vh; border-radius: 1vh">
                  </ion-skeleton-text>
              </div>
              <!-- icon -->
              <div style="height: 6.25vh; display: flex; justify-content: center; align-items: center">
                  <ion-skeleton-text
                          animated="true"
                          style="height: 2.5vh; width: 2.5vh; border-radius: 1vh">
                  </ion-skeleton-text>
              </div>
          </ion-card-content>
      </ion-card>
  `,
  styles: [],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonSkeletonText,
    NgIf,
    IonCardSubtitle
  ],
  standalone: true
})
export class SkeletonSummaryComponent {
  // use title or subtitle
  @Input() useTitle = false;
}
