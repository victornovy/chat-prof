import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TalkDetailPage } from '../talk-detail/talk-detail';

@IonicPage()
@Component({
    selector: 'page-talk',
    templateUrl: 'talk.html'
})
export class TalkPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad TalkPage');
    }

    openTalkDetail() {
        this.navCtrl.push(TalkDetailPage);
    }
}
