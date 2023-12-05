import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RefresherCustomEvent} from '@ionic/angular';
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonText,
    IonThumbnail,
    IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";
import {Beer} from "../../models/beer";
import {BeerService} from "../../services/beer.service";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
    standalone: true,
    imports: [
        IonToolbar,
        IonTitle,
        IonContent,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent,
        IonHeader,
        IonImg,
        IonText,
        NgIf,
        IonIcon,
        IonSkeletonText,
        IonThumbnail,
        NgClass,
        IonRefresher,
        IonRefresherContent,
        IonList,
        IonItem,
        IonLabel,
        NgForOf]
})
export class DetailPage implements OnInit {
    beer?: Beer;
    isLoadedBeer = false;
    imageUrl?: string;
    private readonly altImageUrl = 'https://images.punkapi.com/v2/keg.png';

    constructor(
        private beerService: BeerService
    ) {
    }

    ngOnInit(): void {
        this.fetchRandomBeer();
    }

    /**
     * Handle pull to refresh
     * @param event
     */
    handleRefresh(event: RefresherCustomEvent) {
        this.isLoadedBeer = false;
        this.fetchRandomBeer(event);
    }

    /**
     * Fetch a random beer from API
     * @param event
     * @private
     */
    private fetchRandomBeer(event?: RefresherCustomEvent) {
        this.beerService.getRandomBeer().subscribe({
            next: (fetchedBeer) => {
                this.beer = fetchedBeer;
                // set alternative keg image when image url is null.
                this.beer.image_url
                    ? (this.imageUrl = this.beer.image_url)
                    : (this.imageUrl = this.altImageUrl);
                // show card
                this.isLoadedBeer = true;
                // when pull to refresh, complete is necessary
                event?.target.complete();
            },
            error: () => {
                // TODO: not implemented yet.
                // when pull to refresh, complete is necessary
                event?.target.complete();
            },
            complete: () => console.log('getRandomBeer completed.'),
        });
    }
}
