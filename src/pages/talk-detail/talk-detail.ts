import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    AlertController
} from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, combineLatest } from 'rxjs';
import { TalkPage } from '../talk/talk';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
    selector: 'page-talk-detail',
    templateUrl: 'talk-detail.html'
})
export class TalkDetailPage {
    titulo: string;
    descricao: string;
    membrosList: Array<any> = [];
    infoGrupo: any;

    private membrosSubs: Subscription;

    /**
     * Busca usuarios presentes no grupo
     */
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        private _db: AngularFirestore,
        private _userProvider: UserProvider
    ) {
        const userInfo = this.navParams.get('userInfo');
        this.infoGrupo = this.navParams.get('info');
        this.titulo = !!this.infoGrupo.grupo
            ? this.infoGrupo.nome
            : this.infoGrupo.nome[userInfo.uid];
        this.descricao = this.infoGrupo.descricao;

        const querys$ = [];
        this.infoGrupo.membros.forEach(id => {
            querys$.push(
                _db
                    .collection(`usuarios`, ref => ref.where('uid', '==', id))
                    .valueChanges()
            );
        });

        this.membrosList = [];
        this.membrosSubs = combineLatest(querys$).subscribe(usuarios => {
            usuarios.forEach(usu => {
                this.membrosList.push(usu[0]);
            });
        });
    }

    /**
     * Remove observador das alterações de detalhes
     */
    ionViewWillLeave() {
        this.membrosSubs.unsubscribe();
    }

    /**
     * Deixar grupo ou apaga a conversa
     */
    sair() {
        const msgTitle = !!this.infoGrupo.grupo
            ? 'Deseja sair do grupo?'
            : 'Deseja apagar a conversa?';
        this.alertCtrl
            .create({
                title: msgTitle,
                buttons: [
                    {
                        text: 'Cancelar'
                    },
                    {
                        text: 'Confirmar',
                        handler: () => {
                            if (this.infoGrupo.grupo) {
                                this._removeUserFromGroup();
                            } else {
                                this._apagarConversa();
                            }
                            this._userProvider.removeUserToTopic(
                                this.infoGrupo.channel
                            );
                        }
                    }
                ]
            })
            .present();
    }

    /**
     * Intiva a conversa
     */
    private _apagarConversa() {
        this._db.doc(`conversas/${this.infoGrupo.id}`).update({ ativo: false });
        this.navCtrl.popToRoot();
    }

    /**
     * Remove usuario do grupo
     */
    private _removeUserFromGroup() {
        const userInfo = this.navParams.get('userInfo');
        const idx = this.infoGrupo.membros.indexOf(userInfo.uid);
        this.infoGrupo.membros.splice(idx, 1);

        this._db
            .doc(`conversas/${this.infoGrupo.id}`)
            .update({ membros: this.infoGrupo.membros })
            .then(() => {
                this.navCtrl.popToRoot();
            });
    }

    /**
     * Validação da chamada do usuario para conversar no privado
     */
    conversaParticular(usu) {
        const userInfo = this.navParams.get('userInfo');
        if (usu.uid === userInfo.uid) {
            return;
        }

        let createTalk$ = this._db
            .collection('conversas', ref =>
                ref
                    .where('membros', 'array-contains', userInfo.uid)
                    .where('grupo', '==', false)
            )
            .snapshotChanges()
            .subscribe((cvs: any) => {
                const conversa = cvs.find(cv => {
                    const detalhe = cv.payload.doc.data();
                    return detalhe.membros.indexOf(usu.uid) > -1;
                });

                if (!conversa) {
                    this._criaConversaPrivada(usu, userInfo);
                } else {
                    const detalheConversa = conversa.payload.doc.data();
                    const idConversa = conversa.payload.doc.id;

                    detalheConversa.ativo = true;
                    const infoGrupo = { ...detalheConversa, id: idConversa };

                    this._db
                        .doc(`conversas/${idConversa}`)
                        .update({ ativo: true });
                    this._abrirConversaPrivada(infoGrupo, userInfo);
                }
                createTalk$.unsubscribe();
            });
    }

    /**
     * Salva a conversa privada
     */
    private _criaConversaPrivada(usu, userInfo) {
        const data = {
            ativo: true,
            nome: {
                [usu.uid]: userInfo.displayName,
                [userInfo.uid]: usu.displayName
            },
            membros: [userInfo.uid, usu.uid],
            grupo: false,
            channel: `CH_${usu.uid}_${userInfo.uid}`
        };
        this._userProvider.addUserToTopic(data.channel);
        this._db.doc(`conversas/${this._db.createId()}`).set(data);
        this._abrirConversaPrivada(data, userInfo);
    }

    /**
     * Abre conversa privada
     */
    private _abrirConversaPrivada(infoConversa, userInfo) {
        this.navCtrl.popToRoot();
        this.navCtrl.push(TalkPage, { info: infoConversa, userInfo });
    }
}
