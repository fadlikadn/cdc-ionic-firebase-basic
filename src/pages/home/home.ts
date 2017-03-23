import { Component } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import 'rxjs/add/operator/map';
import { ModalsPage } from '../../pages/modals/modals';
import { Image } from '../../providers/image';
import { Preloader } from '../../providers/preloader';
import { Database } from '../../providers/database';
import * as firebase from 'firebase';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public movies: FirebaseListObservable<any[]>;
  public movies2: any;
  private auth: any;
  private email: string = 'fadlikadn@gmail.com';
  private pass: string = 'fadlikadn';

  constructor(public navCtrl: NavController,
              private angFire: AngularFire,
              private modalCtrl: ModalController,
              private platform: Platform,
              private _IMG: Image,
              private _LOADER: Preloader,
              private _DB: Database) {
    
  }

  ionViewDidEnter() {
    this._LOADER.displayPreloader();
    this.platform.ready().then(() => {
      firebase.auth().signInWithEmailAndPassword(this.email, this.pass).then((credentials) => {
        this.loadAndParseMovies();
      })
      .catch((err: Error) => {
        console.log(err.message);
      });
    });
  }

  loadAndParseMovies() {
    this.movies2 = this._DB.renderMovies();
    this._LOADER.hidePreloader();
  }

  addRecord2() {
    let modal = this.modalCtrl.create(ModalsPage);
    modal.onDidDismiss((data) => {
      if (data) {
        this._LOADER.displayPreloader();
        this.loadAndParseMovies();
      }
    });
    modal.present();
  }

  editMovie2(movie) {
    let params = { movie: movie, isEdited: true };
    let modal = this.modalCtrl.create(ModalsPage, params);

    modal.onDidDismiss((data) => {
      if (data) {
        this._LOADER.displayPreloader();
        this.loadAndParseMovies();
      }
    });
    modal.present();
  }

  deleteMovie2(movie) {
    console.log(movie);
    this._LOADER.displayPreloader();

    if(movie.pathImage) {
      this._DB.deleteImage(movie).then((data) => {
        console.log(data);
      });
    }

    this._DB.deleteMovie(movie.id).then((data) => {
      this.loadAndParseMovies();
    })
  }


  /**
   * Use AngularFire 2
   */
  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.movies = this.angFire.database.list('/films');
    });
  }

  addRecord() {
    let modal = this.modalCtrl.create(ModalsPage);
    modal.present();
  }

  editMovie(movie) {
    let params = { movie: movie, isEdited: true };
    let modal = this.modalCtrl.create(ModalsPage, params);

    modal.present();
  }

  deleteMovie(movie: any) {
    this.movies.remove(movie);
  }

}
