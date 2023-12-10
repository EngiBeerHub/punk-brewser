import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {
    IonBackButton,
    IonButton,
    IonButtons,
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
import {addIcons} from "ionicons";
import {starOutline} from "ionicons/icons";

/**
 * state passed from parent component
 */
export interface BeerState {
    beer: Beer;
}

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
        NgForOf,
        IonBackButton,
        IonButtons,
        IonButton
    ]
})
export class DetailPage implements OnInit {
    beer?: Beer;
    imageUrl?: string;
    private readonly altImageUrl = 'https://images.punkapi.com/v2/keg.png';

    constructor() {
        addIcons({starOutline});
    }

    ngOnInit(): void {
        // receive beer from previous page
        this.beer = (history.state as BeerState).beer;
        this.beer.image_url
            ? (this.imageUrl = this.beer.image_url)
            : (this.imageUrl = this.altImageUrl);
    }

    onClickButton(event: MouseEvent) {
        event.stopPropagation();
    }
}
