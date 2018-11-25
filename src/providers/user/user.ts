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

    constructor(
        private _platform: Platform,
        private afMessaging: AngularFireMessaging,
        private _storage: Storage
    ) {
        this.afMessaging.requestPermission.subscribe(
            () => {
                console.log('Permission granted!');
            },
            error => {
                console.error(error);
            }
        );
    }

    setPushObject(pushObject: PushObject) {
        this.pushObject = pushObject;
    }

    addUserToTopic(chave) {
        this.pushObject.subscribe(chave.toString());
    }

    removeUserToTopic(chave) {
        this.pushObject.unsubscribe(chave.toString());
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

    seveAccess(idToken, accessToken, service) {
        this._storage.set('access', {
            idToken,
            accessToken,
            service
        });
    }

    getAccess() {
        return this._storage.get('access');
    }
}
