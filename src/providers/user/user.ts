import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInfo } from 'firebase';

@Injectable()
export class UserProvider {
    public infoUser: UserInfo;

    constructor(private _afAuth: AngularFireAuth) {
        this._afAuth.user.subscribe((user: any) => {
            this.infoUser = user.providerData[0];
        });
    }
}
