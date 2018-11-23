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
import { Push } from '@ionic-native/push';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { GooglePlus } from '@ionic-native/google-plus';
import { IonicStorageModule } from '@ionic/storage';
import { FIREBASE } from '../environments/firebase';

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
        IonicStorageModule.forRoot(),
        AngularFireModule.initializeApp(FIREBASE),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFireMessagingModule
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
        Push,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        UserProvider,
        GooglePlus
    ]
})
export class AppModule {}
