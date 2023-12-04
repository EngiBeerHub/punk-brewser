import {Component} from '@angular/core';
import {IonContent, IonHeader, IonIcon, IonTitle, IonToolbar,} from '@ionic/angular/standalone';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
    standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon],
})
export class Tab3Page {
    constructor() {
    }
}
