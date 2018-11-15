import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    AlertController,
    IonicPage,
    NavController,
    NavParams
} from 'ionic-angular';
import { TalkPage } from '../talk/talk';

@IonicPage()
@Component({
    selector: 'page-new-group',
    templateUrl: 'new-group.html'
})
export class NewGroupPage {
    codigoGrupo: string;
    form: FormGroup = this._fb.group({
        nome: ['', Validators.required],
        descricao: ['', Validators.required]
    });
    userInfo;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private _alertCtrl: AlertController,
        private _fb: FormBuilder,
        private _db: AngularFirestore,
        _afAuth: AngularFireAuth
    ) {
        _afAuth.user.subscribe(user => {
            this.userInfo = user.providerData[0];
        });
    }

    private gerarChave(): number {
        return Math.floor(10000 + Math.random() * 90000);
    }

    confirm() {
        if (this.form.invalid) return;

        const chave = this.gerarChave();
        const data = {
            adm: this.userInfo.uid,
            ativo: true,
            descricao: this.form.value.descricao,
            nome: this.form.value.nome,
            membros: [this.userInfo.uid],
            chave,
            grupo: true
        };
        this._db.doc(`conversas/${this._db.createId()}`).set(data);

        this.showAlert(chave);
        this.navCtrl.pop();
        this.navCtrl.push(TalkPage, { info: data, userInfo: this.userInfo });
    }

    showAlert(codigo: number) {
        const alert = this._alertCtrl.create({
            title: 'Grupo criado',
            subTitle:
                'Grupo criado com sucesso, para adicionar membros no grupo basta enviar o código: ' +
                codigo,
            buttons: ['OK']
        });
        alert.present();
    }
}
