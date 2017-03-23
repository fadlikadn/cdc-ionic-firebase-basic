import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

/*
  Generated class for the Database provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.

  This provider hel manage all database interactions and upload to Firebase Storage
  (technically we should put into its own service for better modularity but I'll leave that as an exercise for the reader to undertake)
*/
@Injectable()
export class Database {

  constructor(public http: Http) {
    console.log('Hello Database Provider');
  }

  renderMovies(): Observable<any> {
    try {
      return new Observable(observer => {
        let films: any = [];
        firebase.database().ref('films').orderByKey().once('value', (items: any) =>  {
          items.forEach((item) => {
            films.push(item.val());
          });

          observer.next(films);
          observer.complete();
        },
        (error) => {
          console.log("Observer error: ", error);
          console.dir(error);
          observer.error(error)
        });
      });
    } catch (error) {
      console.log('Observable for retrieving films fails');
      console.dir(error);
    }
  }

  deleteMovie(id): Promise<any> {
    return new Promise((resolve) => {
      let ref = firebase.database().ref('films').child(id);
      ref.remove();
      resolve(true);
    });
  }

  addToDatabase(movieObj): Promise<any> {
    return new Promise((resolve) => {
      let addRef = firebase.database().ref('films');
      addRef.push(movieObj);
      resolve(true);
    });
  }

  updateDatabase(id, moviesObj): Promise<any> {
    return new Promise((resolve) => {
      var updateRef = firebase.database().ref('films').child(id);
      updateRef.update(moviesObj);
      resolve(true);
    });
  }

  uploadImage(imageString): Promise<any> {
    let image: string = 'movie-' + new Date().getTime() + '.jpg';
    let storageRef: any;
    let parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref('posters/' + image);
      parseUpload = storageRef.putString(imageString, 'data_url');

      parseUpload.on('state_changed', (_snapshot) => {
        // We could log the progress here IF necessary
        console.log('snapshot progress ' +  _snapshot);
      },
      (_err) => {
        reject(_err);
      }, 
      (success) => {
        resolve(parseUpload.snapshot);
      });
    });
  }

  deleteImage(movie): Promise<any> {
    let storageRef: any;
    let parseDelete: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref(movie.pathImage);

      parseDelete = storageRef.delete();
      parseDelete.on('state_change', (_snapshot) => {
        console.log('delete snapshot progress ' + _snapshot);
      },
      (_err) => {
        reject(_err);
      },
      (succcess) => {
        resolve(parseDelete.snapshot);
      });
      // storageRef.delete().then(function() {
      //   resolve(true);
      // }).catch(function(error) {
      //   // reject(error);
      // });
    });
  }

}
