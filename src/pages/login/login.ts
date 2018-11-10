import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    ToastController
} from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, UserInfo } from 'firebase/app';
import { HomePage } from '../home/home';
import { UserProvider } from '../../providers/user/user';
import { AngularFirestore } from '@angular/fire/firestore';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private _afAuth: AngularFireAuth,
        private _toastCtrl: ToastController,
        private _db: AngularFirestore
    ) {
        this._afAuth.user.subscribe(user => {
            if (!!user) {
                this.navCtrl.setRoot(HomePage);
            }
        });
        this._afAuth.auth.signOut();
    }

    ionViewDidLoad() {}

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
