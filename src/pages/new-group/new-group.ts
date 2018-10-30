import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    AlertController
} from 'ionic-angular';
import { TalkPage } from '../talk/talk';
import { HomePage } from '../home/home';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

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

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private _alertCtrl: AlertController,
        private _fb: FormBuilder,
        private _db: AngularFirestore
    ) {}

    private gerarChave(): number {
        return Math.floor(10000 + Math.random() * 90000);
    }

    confirm() {
        if (this.form.invalid) return;

        const chave = this.gerarChave();
        const data = {
            adm: 'RxwYxG1ZF3LaoTzbtIcH',
            ativo: true,
            descricao: this.form.value.descricao,
            nome: this.form.value.nome,
            membros: ['RxwYxG1ZF3LaoTzbtIcH'],
            chave
        };
        this._db.doc(`grupos/${this._db.createId()}`).set(data);

        this.showAlert(chave);
        this.navCtrl.pop();
        this.navCtrl.push(TalkPage, {info: data});
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
