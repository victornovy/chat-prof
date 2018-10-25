import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TalkPage } from '../talk/talk';
import { HomePage } from '../home/home';

/**
 * Generated class for the NewGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-new-group',
    templateUrl: 'new-group.html'
})
export class NewGroupPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad NewGroupPage');
    }

    confirm() {
        this.navCtrl.setPages([{ page: HomePage }, { page: TalkPage }]);
    }
}
