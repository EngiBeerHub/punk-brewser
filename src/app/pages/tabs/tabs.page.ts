import {Component, EnvironmentInjector, inject} from '@angular/core';
import {IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs,} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {homeOutline, reloadOutline, searchOutline, settingsOutline, starOutline} from 'ionicons/icons';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: true,
    imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
    public environmentInjector = inject(EnvironmentInjector);

    constructor() {
        addIcons({homeOutline, searchOutline, settingsOutline, starOutline, reloadOutline});
    }
}
