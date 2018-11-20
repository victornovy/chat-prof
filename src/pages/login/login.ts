import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth, UserInfo } from 'firebase/app';
import { IonicPage, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    constructor(
        private _afAuth: AngularFireAuth,
        private _toastCtrl: ToastController,
        private _db: AngularFirestore
    ) {}

    ionViewDidLoad() {}

    /**
     * Login com o google
     */
    loginGoogle() {
        this._afAuth.auth
            .signInWithPopup(new auth.GoogleAuthProvider())
            .then(resp => {
                const infoUser: any = resp.user.providerData[0];
                this._addUser(infoUser);
            })
            .catch(err => {
                this._toastCtrl
                    .create({
                        message: 'Não foi possível conectar sua conta',
                        duration: 3000
                    })
                    .present();
            });
    }

    /**
     * Login com o facebook
     */
    loginFacebook() {
        this._afAuth.auth
            .signInWithPopup(new auth.FacebookAuthProvider())
            .then(resp => {
                const infoUser: any = resp.user.providerData[0];
                this._addUser(infoUser);
            })
            .catch(err => {
                this._toastCtrl
                    .create({
                        message: 'Não foi possível conectar sua conta',
                        duration: 3000
                    })
                    .present();
            });
    }

    /**
     * Salva usuario no tabela
     */
    private _addUser(providerData: UserInfo) {
        const userData = {
            displayName: providerData.displayName,
            email: providerData.email,
            phoneNumber: providerData.phoneNumber,
            photoURL: providerData.photoURL,
            providerId: providerData.providerId,
            uid: providerData.uid
        };

        const queryUser = this._db.collection('usuarios', ref =>
            ref.where('uid', '==', userData.uid)
        );

        queryUser.snapshotChanges().subscribe(user => {
            if (user.length === 0) {
                this._db.collection('usuarios').add(userData);
            } else {
                queryUser.doc(user[0].payload.doc.id).update(userData);
            }
        });
    }
}
