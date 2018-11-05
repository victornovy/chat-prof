import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

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

    private membrosSubs: Subscription;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        _db: AngularFirestore
    ) {
        const info = this.navParams.get('info');
        this.titulo = info.nome;
        this.descricao = info.descricao;
        this.chave = info.chave;

        this.membrosSubs = _db
            .collection(`usuarios`, ref => {
                info.membros.forEach(membro => {
                    ref.where('uid', '==', membro);
                });
                return ref;
            })
            .valueChanges()
            .subscribe((usuarios: any) => {
                this.membrosList = usuarios;
            });
    }

    ionViewWillLeave() {
        this.membrosSubs.unsubscribe();
    }
}
