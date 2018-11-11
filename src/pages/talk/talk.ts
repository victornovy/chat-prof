import { Component, ElementRef, ViewChild } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TalkDetailPage } from '../talk-detail/talk-detail';
import { AngularFireStorage } from '@angular/fire/storage';

@IonicPage()
@Component({
    selector: 'page-talk',
    templateUrl: 'talk.html'
})
export class TalkPage {
    @ViewChild('upload') upload;

    title: string;
    talkList: Array<any> = [];
    mensagem: string;
    id: string;
    userInfo;
    chosenFile: File;

    groupMsg: AngularFirestoreCollection;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        _db: AngularFirestore,
        private storage: AngularFireStorage
    ) {
        this.userInfo = this.navParams.get('userInfo');
        const info = this.navParams.get('info');
        this.title = info.nome;
        this.id = info.id;

        this.groupMsg = _db.collection(`grupos/${this.id}/msg`, ref =>
            ref.orderBy('data', 'asc')
        );

        this.groupMsg.valueChanges().subscribe(item => {
            this.talkList = item.map((msg: any) => {
                msg.formatData = this.formatData(msg.data.seconds);
                return msg;
            });
        });
    }

    openTalkDetail() {
        this.navCtrl.push(TalkDetailPage, {
            info: this.navParams.get('info'),
            userInfo: this.userInfo
        });
    }

    showData(data) {
        const min = this.zeroFillData(data.minutes);
        const hours = this.zeroFillData(data.hours);

        return `${hours}:${min}`;
    }

    private formatData(value?: number) {
        const data = !!value ? new Date(value * 1000) : new Date();
        return {
            day: data.getDate(),
            month: data.getMonth() + 1,
            year: data.getFullYear(),
            hours: data.getHours(),
            minutes: data.getMinutes(),
            seconds: data.getSeconds()
        };
    }

    private zeroFillData(value) {
        return value.toString().length === 2 ? value : `0${value}`;
    }

    sendMsg() {
        this.groupMsg.add({
            autor: this.userInfo.displayName,
            texto: this.mensagem,
            data: new Date(),
            autorId: this.userInfo.uid,
            upload: false
        });

        this.mensagem = '';
    }

    sentByLogged(item): boolean {
        return this.userInfo.uid === item.autorId;
    }

    uploadFile() {
        this.upload._native.nativeElement.click();
    }

    changeUploadFile(e) {
        this.chosenFile = e.target.files[0];
        const fileName = new Date();
        this.sendUpload(fileName);

        this.groupMsg.add({
            autor: this.userInfo.displayName,
            texto: this.chosenFile.name,
            data: new Date(),
            autorId: this.userInfo.uid,
            upload: true,
            path: `${this.id}/${fileName.getTime()}`
        });
    }

    sendUpload(fileName?: Date) {
        fileName = fileName || new Date();
        if (this.chosenFile) {
            let put = this.storage.ref(`${this.id}/${fileName.getTime()}`);
            put.put(this.chosenFile);
            return;
        }
    }

    downloadFile(file) {
        this.storage
            .ref(file.path)
            .getDownloadURL()
            .subscribe(url => {
                // TODO: implementar download file
                window.open(url);
            });
    }
}
