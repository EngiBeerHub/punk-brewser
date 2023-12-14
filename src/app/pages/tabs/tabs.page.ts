import {Component, EnvironmentInjector, inject} from '@angular/core';
import {IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs,} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {
  checkmarkCircle,
  checkmarkCircleOutline,
  checkmarkSharp,
  closeCircle,
  closeCircleOutline,
  closeCircleSharp,
  home,
  homeOutline,
  homeSharp,
  list,
  listOutline,
  listSharp,
  options,
  optionsOutline,
  optionsSharp,
  reload,
  reloadOutline,
  reloadSharp,
  search,
  searchOutline,
  searchSharp,
  settings,
  settingsOutline,
  settingsSharp,
  star,
  starOutline,
  starSharp
} from 'ionicons/icons';

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
    addIcons({
      checkmarkCircle,
      checkmarkCircleOutline,
      checkmarkSharp,
      closeCircle,
      closeCircleOutline,
      closeCircleSharp,
      home,
      homeOutline,
      homeSharp,
      list,
      listOutline,
      listSharp,
      options,
      optionsOutline,
      optionsSharp,
      search,
      searchOutline,
      searchSharp,
      settings,
      settingsOutline,
      settingsSharp,
      star,
      starOutline,
      starSharp,
      reload,
      reloadOutline,
      reloadSharp
    });
  }
}
