import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Push, PushOptions } from '@ionic-native/push';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { auth } from 'firebase';
import { Platform, ToastController } from 'ionic-angular';
import { User } from '../model/user';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UserProvider } from '../providers/user/user';

/**
 * Classe princial
 */
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = '';

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private _afAuth: AngularFireAuth,
        private _userProvider: UserProvider,
        private push: Push,
        private _toastCtrl: ToastController
    ) {
        _userProvider.getAccess().then(access => {
            if (!access) {
                this.rootPage = LoginPage;
                return;
            }

            if (access.service === 'google') {
                this._afAuth.auth
                    .signInWithCredential(
                        auth.GoogleAuthProvider.credential(
                            access.idToken,
                            access.accessToken
                        )
                    )
                    .then(this._setUser.bind(this));
            } else if (access.service === 'facebook') {
                this._afAuth.auth
                    .signInWithCredential(
                        auth.FacebookAuthProvider.credential(access.accessToken)
                    )
                    .then(this._setUser.bind(this));
            }

            this.rootPage = HomePage;
        });

        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();
            this._configurePush();
        });
    }

    private _configurePush() {
        const options: PushOptions = {
            android: {
                senderID: '512390234652',
                sound: 'true'
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        };

        const pushObject = this.push.init(options);

        this._userProvider.setPushObject(pushObject);

        pushObject.on('notification').subscribe((notification: any) => {
            console.log('Received a notification', notification);

            if (notification.additionalData.coldstart) {
                this._toastCtrl
                    .create({ message: 'a', duration: 5000 })
                    .present();
            }
        });

        pushObject.on('registration').subscribe((registration: any) => {
            console.log('Device registered', registration);
        });

        pushObject
            .on('error')
            .subscribe(error => console.error('Error with Push plugin', error));
    }

    private _setUser(resp) {
        const providerData: any = resp.providerData[0];
        const userInfo: User = {
            displayName: providerData.displayName,
            email: providerData.email,
            phoneNumber: providerData.phoneNumber,
            photoURL: providerData.photoURL,
            providerId: providerData.providerId,
            uid: providerData.uid
        };
        this._userProvider.setUser(userInfo);
    }
}
