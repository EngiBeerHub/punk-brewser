import {Directive, ElementRef, HostListener} from '@angular/core';
import {AnimationController} from "@ionic/angular/standalone";

@Directive({
  selector: '[appFadeInIonImage]',
  standalone: true
})
export class FadeInIonImageDirective {

  constructor(private el: ElementRef, private animationCtrl: AnimationController) {
  }

  @HostListener('ionImgWillLoad')
  onLoadImage() {
    const animation = this.animationCtrl.create()
      .addElement(this.el.nativeElement)
      .duration(500)
      .fromTo('opacity', '0', '1');
    void animation.play();
  }

}
