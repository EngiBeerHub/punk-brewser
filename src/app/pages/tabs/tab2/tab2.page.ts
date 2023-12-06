import {Component, OnInit, TrackByFunction} from '@angular/core';
import {
    IonAvatar,
    IonContent,
    IonHeader,
    IonImg,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonLabel,
    IonList,
    IonTitle,
    IonToolbar,
} from '@ionic/angular/standalone';
import {BeerService} from "../../../services/beer.service";
import {Beer} from "../../../models/beer";
import {NgForOf} from "@angular/common";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, NgForOf, IonAvatar, IonImg, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent],
})
export class Tab2Page implements OnInit {
    beers?: Beer[];
    readonly ALT_IMAGE_URL = 'https://images.punkapi.com/v2/keg.png';
    page = 1;

    constructor(private beerService: BeerService, private router: Router) {
    }

    ngOnInit() {
        this.beerService.getPage(1).subscribe({
                next: fetchedBeers => {
                    this.beers = fetchedBeers;
                }
            }
        );
    }

    getPage(event: InfiniteScrollCustomEvent) {
        this.beerService.getPage(this.page++).subscribe({
                next: fetchedBeers => {
                    // this.beers?.concat(fetchedBeers);
                    // this.beers = fetchedBeers;
                    this.beers?.push(...fetchedBeers);
                    void event.target.complete();
                }
            }
        );
    }

    onClickItem(beer: Beer) {
        void this.router.navigate(['/detail'], {state: {beer: beer}});
    }

    // trackByBeer(index: number, value: Beer) {
    //     return value ? value.id : null;
    // }

    trackByBeerId: TrackByFunction<Beer> = (index: number, beer: Beer) => beer.id;
}
