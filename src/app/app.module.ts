import { ErrorHandler, NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NewGroupPage } from '../pages/new-group/new-group';
import { NewTalkPage } from '../pages/new-talk/new-talk';
import { TalkDetailPage } from '../pages/talk-detail/talk-detail';
import { TalkPage } from '../pages/talk/talk';
import { UserProvider } from '../providers/user/user';
import { MyApp } from './app.component';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        NewGroupPage,
        NewTalkPage,
        TalkPage,
        TalkDetailPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp({
            apiKey: 'AIzaSyAp-qZFzwlqnpyHtptCV2P80fc5flThwS0',
            authDomain: 'chat-prof.firebaseapp.com',
            databaseURL: 'https://chat-prof.firebaseio.com',
            projectId: 'chat-prof',
            storageBucket: 'chat-prof.appspot.com',
            messagingSenderId: '512390234652'
        }),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        NewGroupPage,
        NewTalkPage,
        TalkPage,
        TalkDetailPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        UserProvider
    ]
})
export class AppModule {}
