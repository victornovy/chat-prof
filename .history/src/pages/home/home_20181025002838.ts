import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TalkPage } from '../talk/talk';
import { NewGroupPage } from '../new-group/new-group';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController
    ) {}

    createGroup() {
        this.navCtrl.push(NewGroupPage);
    }

    enterTalk() {
        const prompt = this.alertCtrl.create({
            title: 'Nova conversa',
            inputs: [
                {
                    name: 'codigo',
                    placeholder: 'Código do grupo'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirmar',
                    handler: data => {
                        this.navCtrl.push(TalkPage, data);
                    }
                }
            ]
        });

        prompt.present();
    }
}
