import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    AlertController
} from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, combineLatest } from 'rxjs';

@IonicPage()
@Component({
    selector: 'page-talk-detail',
    templateUrl: 'talk-detail.html'
})
export class TalkDetailPage {
    titulo: string;
    descricao: string;
    chave: number;
    membrosList: Array<any> = [];
    infoGrupo: any;

    private membrosSubs: Subscription;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        private _db: AngularFirestore
    ) {
        this.infoGrupo = this.navParams.get('info');
        this.titulo = this.infoGrupo.nome;
        this.descricao = this.infoGrupo.descricao;
        this.chave = this.infoGrupo.chave;

        const querys$ = [];
        this.infoGrupo.membros.forEach(id => {
            querys$.push(
                _db
                    .collection(`usuarios`, ref => ref.where('uid', '==', id))
                    .valueChanges()
            );
        });

        this.membrosList = [];
        this.membrosSubs = combineLatest(querys$).subscribe(usuarios => {
            usuarios.forEach(usu => {
                this.membrosList.push(usu[0]);
            });
        });
    }

    ionViewWillLeave() {
        this.membrosSubs.unsubscribe();
    }

    exitGroup() {
        this.alertCtrl
            .create({
                title: 'Deseja sair do grupo?',
                buttons: [
                    {
                        text: 'Cancelar'
                    },
                    {
                        text: 'Confirmar',
                        handler: () => {
                            this.removeUserFromGroup();
                        }
                    }
                ]
            })
            .present();
    }

    removeUserFromGroup() {
        const userInfo = this.navParams.get('userInfo');
        const idx = this.infoGrupo.membros.indexOf(userInfo.uid);
        this.infoGrupo.membros.splice(idx, 1);

        this._db
            .doc(`grupos/${this.infoGrupo.id}`)
            .update({ membros: this.infoGrupo.membros })
            .then(() => {
                this.navCtrl.popToRoot();
            });
    }
}
