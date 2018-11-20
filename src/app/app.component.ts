import { Component } from '@angular/core';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { AngularFireAuth } from '@angular/fire/auth';
import { HomePage } from '../pages/home/home';
import { PushOptions, PushObject, Push } from '@ionic-native/push';

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
        _afAuth: AngularFireAuth,
        private alertCtrl: AlertController
    ) {
        _afAuth.user.subscribe(user => {
            if (!!user) {
                this.rootPage = HomePage;
            } else {
                this.rootPage = LoginPage;
            }
        });

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            this._pushsetup();
        });
    }

    /**
     * Configurações de push notification
     */
    private _pushsetup() {
        
        if (this.platform.is('android')) {
            // this.push
            //     .createChannel({
            //         id: 'testchannel1',
            //         description: 'My first test channel',
            //         // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
            //         importance: 3
            //     })
            //     .then(() => console.log('Channel created'));
            // Delete a channel (Android O and above)
            // this.push
            //     .deleteChannel('testchannel1')
            //     .then(() => console.log('Channel deleted'));
            // Return a list of currently configured channels
            // this.push
            //     .listChannels()
            //     .then(channels => console.log('List of channels', channels));
        }
    }
}
