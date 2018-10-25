import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController
    ) {}

    enterTalk() {
        const prompt = this.alertCtrl.create({
            title: 'Nova conversa',
            inputs: [
                {
                    name: 'Código',
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
                        console.log('Saved clicked');
                    }
                }
            ]
        });

        prompt.present();
    }
}
