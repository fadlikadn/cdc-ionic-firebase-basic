import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ModalsPage } from '../pages/modals/modals';

import { AngularFireModule } from 'angularfire2';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export const firebaseConfig = {
    apiKey: "AIzaSyA3_niQfuGzCG_PdPX3v-rYkIQuFRlBwTY",
    authDomain: "movie-ionic-2-firebase.firebaseapp.com",
    databaseURL: "https://movie-ionic-2-firebase.firebaseio.com",
    storageBucket: "movie-ionic-2-firebase.appspot.com",
    messagingSenderId: "921599744923"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ModalsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ModalsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
