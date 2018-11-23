import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInfo } from 'firebase';
import { PushOptions, PushObject, Push } from '@ionic-native/push';
import { Platform } from 'ionic-angular';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Storage } from '@ionic/storage';
import { User } from '../../model/user';

@Injectable()
export class UserProvider {
    private pushObject: PushObject;
    public registerDevice: any;

    constructor(
        private push: Push,
        private _platform: Platform,
        private afMessaging: AngularFireMessaging,
        private _storage: Storage
    ) {
        this._configurePush();

        this.afMessaging.requestPermission.subscribe(
            () => {
                console.log('Permission granted!');
            },
            error => {
                console.error(error);
            }
        );
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

        this.pushObject = this.push.init(options);
        this.pushObject
            .on('notification')
            .subscribe((notification: any) =>
                console.log('Received a notification', notification)
            );

        this.pushObject.on('registration').subscribe((registration: any) => {
            this.registerDevice = registration;
            console.log('Device registered', registration);
        });

        this.pushObject
            .on('error')
            .subscribe(error => console.error('Error with Push plugin', error));
    }

    createChannel(chanel) {
        if (this._platform.is('android')) {
            this.push
                .createChannel({
                    id: chanel.toString(),
                    description: 'My first test channel',
                    importance: 4
                })
                .then(() => console.log('Channel created'));
        }
    }

    addUserToTopic(chave) {
        this.pushObject.subscribe(chave);
    }

    removeUserToTopic(chave) {
        this.pushObject.subscribe(chave);
    }

    getUser() {
        return this._storage.get('user');
    }

    setUser(user: User) {
        this._storage.set('user', user);
    }

    removeUser() {
        this._storage.remove('user');
    }

    crearStorage() {
        this._storage.clear();
    }

    seveAccess(idToken, accessToken) {
        this._storage.set('access', {
            idToken,
            accessToken
        });
    }

    getAccess() {
        return this._storage.get('access');
    }
}
