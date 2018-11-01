import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
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
        private _db: AngularFirestore,
        private _toastCtrl: ToastController
    ) {
        this._getGrupos().subscribe(i => {
            this.listaGrupos = i.map(item => {
                const data = item.payload.doc.data();
                const id = item.payload.doc.id;
                return { id, ...data };
            });
        });
    }

    private _getGrupos(query?) {
        return this._db.collection('grupos', query).snapshotChanges();
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
                        this.confirmaAddGrupo(data.codigo);
                    }
                }
            ]
        });

        prompt.present();
    }

    confirmaAddGrupo(codigo) {
        const query = ref => ref.where('chave', '==', +codigo).limit(1);

        this._getGrupos(query).subscribe(grupos => {
            if (grupos.length === 0) {
                const toast = this._toastCtrl.create({
                    message: 'Grupo não encontrado',
                    duration: 4000
                });
                toast.present();
                return;
            }

            const data = grupos[0].payload.doc.data();
            const id = grupos[0].payload.doc.id;
            const infoGrupo = {
                id,
                ...data
            };
            this.openTalk(infoGrupo);
        });
    }

    openTalk(talk) {
        this.navCtrl.push(TalkPage, { info: talk });
    }
}
