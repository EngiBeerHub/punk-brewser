import {Component, EnvironmentInjector, inject} from '@angular/core';
import {IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs,} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {
  beerOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  checkmarkSharp,
  closeCircle,
  closeCircleOutline,
  closeCircleSharp,
  ellipsisHorizontalCircleOutline,
  home,
  homeOutline,
  homeSharp,
  informationCircleOutline,
  informationCircleSharp,
  list,
  listOutline,
  listSharp,
  lockClosed,
  lockClosedOutline,
  lockClosedSharp,
  newspaperSharp,
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
      beerOutline,
      checkmarkCircle,
      checkmarkCircleOutline,
      checkmarkSharp,
      closeCircle,
      closeCircleOutline,
      closeCircleSharp,
      ellipsisHorizontalCircleOutline,
      home,
      homeOutline,
      homeSharp,
      informationCircleSharp,
      informationCircleOutline,
      list,
      listOutline,
      listSharp,
      lockClosed,
      lockClosedOutline,
      lockClosedSharp,
      newspaperSharp,
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
