import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInfo } from 'firebase';
import { PushOptions, PushObject, Push } from '@ionic-native/push';

@Injectable()
export class UserProvider {
    public infoUser: UserInfo;
    private pushObject: PushObject;
    public registerDevice: any;

    constructor(private push: Push) {}

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

    addUserToTopic(chave) {
        this.pushObject.subscribe(chave);
    }

    removeUserToTopic(chave) {
        this.pushObject.subscribe(chave);
    }
}
