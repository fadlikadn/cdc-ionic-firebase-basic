import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Preloader provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Preloader {

  private loading: any;

  constructor(public http: Http,
    public loadingCtrl: LoadingController)
  {
    console.log('Hello Preloader Provider');
  }

  displayPreloader(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }

  hidePreloader(): void {
    this.loading.dismiss();
  }

}
