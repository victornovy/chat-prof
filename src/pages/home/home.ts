import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfo } from 'firebase';
import { AlertController, NavController, ToastController } from 'ionic-angular';
import { NewGroupPage } from '../new-group/new-group';
import { TalkPage } from '../talk/talk';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    listaGrupos: Array<any> = [];
    userInfo: UserInfo;

    constructor(
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private _db: AngularFirestore,
        private _toastCtrl: ToastController,
        private _afAuth: AngularFireAuth
    ) {
        _afAuth.user.subscribe(user => {
            if (!user) {
                this.navCtrl.setRoot(LoginPage);
                return;
            }

            this.userInfo = user.providerData[0];
            this._getGrupos(ref =>
                ref.where('membros', 'array-contains', this.userInfo.uid)
            ).subscribe(i => {
                this.listaGrupos = i.map(item => {
                    const data = item.payload.doc.data();
                    const id = item.payload.doc.id;
                    return { id, ...data };
                });
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

            const data: any = grupos[0].payload.doc.data();
            const id = grupos[0].payload.doc.id;

            if (!data.membros.some(m => m === this.userInfo.uid)) {
                data.membros.push(this.userInfo.uid);
                grupos[0].payload.doc.ref.update({ membros: data.membros });
                return;
            }

            const infoGrupo = {
                id,
                ...data
            };
            this.openTalk(infoGrupo);
        });
    }

    openTalk(talk) {
        this.navCtrl.push(TalkPage, { info: talk, userInfo: this.userInfo });
    }

    logout() {
        this._afAuth.auth.signOut();
    }
}
