import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfo } from 'firebase';
import { AlertController, NavController, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import { NewGroupPage } from '../new-group/new-group';
import { TalkPage } from '../talk/talk';

/**
 * Classe home | Principal
 */
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    listaGrupos: Array<any> = [];
    userInfo: UserInfo;
    private conversasDb$: Subscription;

    /**
     * Valida usuario logado
     */
    constructor(
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private _db: AngularFirestore,
        private _toastCtrl: ToastController,
        private _afAuth: AngularFireAuth,
        private _userProvider: UserProvider
    ) {}

    ionViewDidLoad() {
        this._userProvider.getUser().then(user => {
            if (!user) {
                this.navCtrl.setRoot(LoginPage);
                return;
            }

            this.userInfo = user;
            this.conversasDb$ = this._getConversas(ref =>
                ref
                    .where('membros', 'array-contains', this.userInfo.uid)
                    .where('ativo', '==', true)
            ).subscribe(i => {
                this.listaGrupos = i.map(item => {
                    const data = item.payload.doc.data();
                    const id = item.payload.doc.id;
                    return { id, ...data };
                });
                this.listaGrupos.forEach(cv => {
                    console.log(cv);
                    this._userProvider.addUserToTopic(cv.channel);
                });
            });
        });
    }

    ionViewWillUnload() {
        this.conversasDb$ && this.conversasDb$.unsubscribe();
    }

    /**
     * Busca conversas
     */
    private _getConversas(query?) {
        return this._db.collection('conversas', query).snapshotChanges();
    }

    /**
     * Abre tela para cadastro de novo grupo
     */
    createGroup() {
        this.navCtrl.push(NewGroupPage);
    }

    /**
     * Abre modal pedindo o usuario do grupo que quer entrar
     */
    enterTalk() {
        const prompt = this.alertCtrl.create({
            title: 'Nova conversa',
            inputs: [
                {
                    name: 'codigo',
                    placeholder: 'Código do grupo'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirmar',
                    handler: data => {
                        this.confirmaAddGrupo(data.codigo);
                    }
                }
            ]
        });

        prompt.present();
    }

    /**
     * Valida codigo para entrar no grupo
     */
    confirmaAddGrupo(codigo) {
        const query = ref => ref.where('chave', '==', +codigo).limit(1);
        this._getConversas(query).subscribe(grupos => {
            if (grupos.length === 0) {
                const toast = this._toastCtrl.create({
                    message: 'Grupo não encontrado',
                    duration: 4000
                });
                toast.present();
                return;
            }

            const data: any = grupos[0].payload.doc.data();
            const id = grupos[0].payload.doc.id;

            if (!data.membros.some(m => m === this.userInfo.uid)) {
                data.membros.push(this.userInfo.uid);
                grupos[0].payload.doc.ref.update({ membros: data.membros });
                this._userProvider.addUserToTopic(codigo);
                return;
            }

            const infoGrupo = {
                id,
                ...data
            };
            this.openTalk(infoGrupo);
        });
    }

    /**
     * Abre pagina da conversa
     */
    openTalk(talk) {
        this.navCtrl.push(TalkPage, { info: talk, userInfo: this.userInfo });
    }

    /**
     * Sair
     */
    logout() {
        this._userProvider.crearStorage();
        this._afAuth.auth.signOut();
        this.navCtrl.setRoot(LoginPage);
    }

    /**
     * Retorna nome do header em caso de conversa particular
     */
    getNomeConversa(conversa) {
        return conversa.nome[this.userInfo.uid];
    }
}
