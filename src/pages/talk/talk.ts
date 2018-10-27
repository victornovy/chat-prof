import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TalkDetailPage } from '../talk-detail/talk-detail';
import { AngularFirestore } from '@angular/fire/firestore';
import { Timestamp } from 'rxjs';

@IonicPage()
@Component({
    selector: 'page-talk',
    templateUrl: 'talk.html'
})
export class TalkPage {
    title: string;
    talkList: Array<any> = [];
    mensagem: string;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        _db: AngularFirestore
    ) {
        const info = this.navParams.get('info');
        this.title = info.nome;

        _db.collection(`grupos/${info.id}/msg`, ref =>
            ref.orderBy('data', 'asc')
        )
            .valueChanges()
            .subscribe(item => {
                this.talkList = item.map((item: any) => {
                    item.formatData = this.formatData(item.data.seconds);
                    return item;
                });
            });
    }

    openTalkDetail() {
        this.navCtrl.push(TalkDetailPage, {
            info: this.navParams.get('info')
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
        this.talkList.push({
            autor: 'batata',
            texto: this.mensagem,
            formatData: this.formatData()
        });
        this.mensagem = '';
    }
}
