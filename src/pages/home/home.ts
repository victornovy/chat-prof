import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TalkPage } from '../talk/talk';
import { NewGroupPage } from '../new-group/new-group';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    listaGrupos: Array<any> = [];

    constructor(
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        _db: AngularFirestore
    ) {
        _db.collection('grupos')
            .snapshotChanges()
            .subscribe(i => {
                this.listaGrupos = i.map(item => {
                    const data = item.payload.doc.data();
                    const id = item.payload.doc.id;
                    return { id, ...data };
                });
                console.log(this.listaGrupos);
            });
    }

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

    openTalk(talk) {
        this.navCtrl.push(TalkPage, { info: talk });
    }
}
