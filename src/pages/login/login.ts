import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth, UserInfo } from 'firebase/app';
import {
    IonicPage,
    ToastController,
    NavController,
    Platform
} from 'ionic-angular';
import { HomePage } from '../home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import { User } from '../../model/user';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    constructor(
        private _navCtrl: NavController,
        private _afAuth: AngularFireAuth,
        private _toastCtrl: ToastController,
        private _db: AngularFirestore,
        private _platform: Platform,
        private _plus: GooglePlus,
        private _userProvider: UserProvider
    ) {}

    /**
     * Login com o google
     */
    loginGoogle() {
        if (this._platform.is('android')) {
            this._loginGooleAndroid();
        } else {
            this._loginGoogleWeb();
        }
    }

    private _loginGooleAndroid() {
        this._plus
            .login({
                webClientId:
                    '512390234652-lpukkmjtbdp254k8rsblul51qpj5bl56.apps.googleusercontent.com',
                offline: false,
                scopes: 'profile email'
            })
            .then(user => {
                this._userProvider.seveAccess(user.idToken, user.accessToken);
                this._afAuth.auth
                    .signInWithCredential(
                        auth.GoogleAuthProvider.credential(
                            user.idToken,
                            user.accessToken
                        )
                    )
                    .then(resp => {
                        const providerData: any = resp.providerData[0];
                        const userInfo: User = {
                            displayName: providerData.displayName,
                            email: providerData.email,
                            phoneNumber: providerData.phoneNumber,
                            photoURL: providerData.photoURL,
                            providerId: providerData.providerId,
                            uid: providerData.uid
                        };
                        this._addUserAndSaveLocal(userInfo);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }

    private _loginGoogleWeb() {
        this._afAuth.auth
            .signInWithPopup(new auth.GoogleAuthProvider())
            .then((resp: any) => {
                this._userProvider.seveAccess(
                    resp.credential.idToken,
                    resp.credential.accessToken
                );
                const providerData: any = resp.user.providerData[0];
                const userInfo: User = {
                    displayName: providerData.displayName,
                    email: providerData.email,
                    phoneNumber: providerData.phoneNumber,
                    photoURL: providerData.photoURL,
                    providerId: providerData.providerId,
                    uid: providerData.uid
                };
                this._addUserAndSaveLocal(userInfo);
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
                const providerData: any = resp.user.providerData[0];
                const userInfo: User = {
                    displayName: providerData.displayName,
                    email: providerData.email,
                    phoneNumber: providerData.phoneNumber,
                    photoURL: providerData.photoURL,
                    providerId: providerData.providerId,
                    uid: providerData.uid
                };
                this._addUserAndSaveLocal(userInfo);
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
    private _addUser(providerData: User) {
        const queryUser = this._db.collection('usuarios', ref =>
            ref.where('uid', '==', providerData.uid)
        );

        const query$ = queryUser.snapshotChanges().subscribe(user => {
            if (user.length === 0) {
                this._db.collection('usuarios').add(providerData);
            } else {
                queryUser.doc(user[0].payload.doc.id).update(providerData);
            }
            query$.unsubscribe();
        });
    }

    private _addUserAndSaveLocal(userInfo: User) {
        this._addUser(userInfo);
        this._userProvider.setUser(userInfo);
        this._navCtrl.setRoot(HomePage);
    }
}
