import { Component } from '@angular/core';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { AngularFireAuth } from '@angular/fire/auth';
import { HomePage } from '../pages/home/home';
import { PushOptions, PushObject, Push } from '@ionic-native/push';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { UserProvider } from '../providers/user/user';
import { auth } from 'firebase';
import { User } from '../model/user';

/**
 * Classe princial
 */
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = '';

    constructor(
        private platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private _afAuth: AngularFireAuth,
        _userProvider: UserProvider
    ) {
        _userProvider.getAccess().then(access => {
            if (!access) {
                this.rootPage = LoginPage;
                return;
            }

            this.rootPage = HomePage;
            this._afAuth.auth
                .signInWithCredential(
                    auth.GoogleAuthProvider.credential(
                        access.idToken,
                        access.accessToken
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
                    _userProvider.setUser(userInfo);
                });
        });

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
}
