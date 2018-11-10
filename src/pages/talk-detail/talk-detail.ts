import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

    private membrosSubs: Subscription;

    constructor(private navCtrl: NavController, private navParams: NavParams, _db: AngularFirestore) {
        const info = this.navParams.get('info');
        this.titulo = info.nome;
        this.descricao = info.descricao;
        this.chave = info.chave;

        const querys$ = [];
        info.membros.forEach(id => {
            querys$.push(_db.collection(`usuarios`, ref => ref.where('uid', '==', id)).valueChanges());
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
}
