import { Component, ViewChild } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TalkDetailPage } from '../talk-detail/talk-detail';
import { Subscription } from 'rxjs';

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
    groupMsg$: Subscription;

    /**
     * Busca mensagens do grupo selecionado
     */
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        _db: AngularFirestore,
        private storage: AngularFireStorage
    ) {
        this.userInfo = this.navParams.get('userInfo');
        const info = this.navParams.get('info');
        this.title = !!info.grupo ? info.nome : info.nome[this.userInfo.uid];
        this.id = info.id;
        this.groupMsg = _db.collection(`conversas/${this.id}/msg`, ref =>
            ref.orderBy('data', 'asc')
        );
        this.talkList = [];

        this.groupMsg$ = this.groupMsg.valueChanges().subscribe(item => {
            this.talkList = item.map((msg: any) => {
                msg.formatData = this.formatData(msg.data.seconds);
                return msg;
            });
        });
    }

    ionViewWillLeave() {
        this.groupMsg$.unsubscribe();
    }

    /**
     * Abre pagina para visualização dos detalhes
     */
    openTalkDetail() {
        this.navCtrl.push(TalkDetailPage, {
            info: this.navParams.get('info'),
            userInfo: this.userInfo
        });
    }

    /**
     * Formada a data e hora da mensagem
     */
    showData(data) {
        const min = this.zeroFillData(data.minutes);
        const hours = this.zeroFillData(data.hours);

        return `${hours}:${min}`;
    }

    /**
     * Retorna objeto com os valores de data
     */
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

    /**
     * Adiciona zero a esquerda no valor
     */
    private zeroFillData(value) {
        return value.toString().length === 2 ? value : `0${value}`;
    }

    /**
     * Salva/envia mensagem
     */
    sendMsg() {
        const info = this.navParams.get('info');
        this.groupMsg.add({
            autor: this.userInfo.displayName,
            texto: this.mensagem,
            data: new Date(),
            autorId: this.userInfo.uid,
            upload: false,
            channel: info.chave
        });

        this.mensagem = '';
    }

    /**
     * Valida se a mensagem foi enviada pelo usuario logado
     */
    sentByLogged(item): boolean {
        return this.userInfo.uid === item.autorId;
    }

    /**
     * Abre opção para upload de arquivos
     */
    uploadFile() {
        this.upload._native.nativeElement.click();
    }

    /**
     * Realiza envio da mensagem com o documento anexado
     */
    changeUploadFile(e) {
        const info = this.navParams.get('info');
        const fileName = new Date();
        this.chosenFile = e.target.files[0];
        this.sendUpload(fileName);

        this.groupMsg.add({
            autor: this.userInfo.displayName,
            texto: this.chosenFile.name,
            data: new Date(),
            autorId: this.userInfo.uid,
            upload: true,
            path: `${this.id}/${fileName.getTime()}`,
            channel: info.chave.toString()
        });
    }

    /**
     * Salva o arquivo no servidor
     */
    sendUpload(fileName?: Date) {
        fileName = fileName || new Date();
        if (this.chosenFile) {
            let put = this.storage.ref(`${this.id}/${fileName.getTime()}`);
            put.put(this.chosenFile);
            return;
        }
    }

    /**
     * Realiza download do arquivo selecionado
     */
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
