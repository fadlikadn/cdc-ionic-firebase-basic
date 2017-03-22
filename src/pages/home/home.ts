import { Component } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import 'rxjs/add/operator/map';
import { ModalsPage } from '../../pages/modals/modals';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public movies: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
              private angFire: AngularFire,
              private modalCtrl: ModalController,
              private platform: Platform) {
    
  }

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
