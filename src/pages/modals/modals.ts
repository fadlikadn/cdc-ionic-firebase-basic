import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Image } from '../../providers/image';
import { Preloader } from '../../providers/preloader';
import { Database } from '../../providers/database';
import * as firebase from 'firebase';

/*
  Generated class for the Modals page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modals',
  templateUrl: 'modals.html'
})
export class ModalsPage {

  public form: any;
  public filmImage: any;
  public movies: FirebaseListObservable<any[]>;
  public movies2: any;
  public movieName: any = '';
  public movieImage: any = '';
  public movieGenres: any = [];
  public movieDuration: any = '';
  public movieSummary: any = '';
  public movieActors: any = [];
  public movieYear: any = '';
  public movieRating: any = '';
  public movieId: string = '';
  public title;

  public isEditable: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public params: NavParams,
    private _FB: FormBuilder,
    private _FIRE: AngularFire,
    public viewCtrl: ViewController,
    private _IMG: Image,
    private _LOADER: Preloader,
    private _DB: Database)
  {
    this.form = _FB.group({
      'summary': ['', Validators.minLength(10)],
      'year': ['', Validators.maxLength(4)],
      'name': ['', Validators.required],
      'duration': ['', Validators.required],
      'rating': ['', Validators.required],
      'genres': ['', Validators.required],
      'actors': ['', Validators.required],
      'image': ['', Validators.required],
    });

    this.movies = this._FIRE.database.list('/films');
    this.movies2 = firebase.database().ref('films/');

    if(params.get('isEdited')) {
      let movie = params.get('movie');
      let k;
      console.log(movie);
      this.movieName = movie.title;
      this.movieDuration = movie.duration;
      this.movieSummary = movie.summary;
      this.movieRating = movie.rating;
      this.movieYear = movie.year;
      this.movieId = movie.$key;
      console.log(movie);
      this.movieImage = movie.image;
      this.filmImage = movie.image;

      for (k in movie.genres) {
        this.movieGenres.push(movie.genres[k].name);
      }

      for (k in movie.actors) {
        this.movieActors.push(movie.actors[k].name);
      }

      this.isEditable = true;
      this.title = movie.title;
    } else {
      this.title = 'Add new movie';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalsPage');
  }

  saveMovie(val) {
    console.log(val);
    console.log(this.form.controls);
    let title: string = this.form.controls["name"].value;
    let summary: string = this.form.controls["summary"].value;
    let rating: number = this.form.controls["rating"].value;
    let genres: any = this.form.controls["genres"].value;
    let actors: any = this.form.controls["actors"].value;
    let duration: string = this.form.controls["duration"].value;
    let year: string = this.form.controls["year"].value;
    let types: any = [];
    let people: any = [];
    let k: any;

    for (k in genres) {
      types.push({
        "name": genres[k]
      });
    }

    for (k in actors) {
      people.push({
        "name": actors[k]
      });
    }

    if (this.isEditable) {
      this.movies.update(this.movieId, {
        title: title,
        summary: summary,
        rating: rating,
        duration: duration,
        genres: types,
        actors: people,
        year: year
      });
    } else {
      this.movies.push({
        title: title,
        summary: summary,
        rating: rating,
        duration: duration,
        genres: types,
        actors: people,
        year: year
      });
    }

    this.closeModal();
  }

  saveMovie2(val) {
    this._LOADER.displayPreloader();

    console.log(val);
    console.log(this.form.controls);
    let title: string = this.form.controls["name"].value;
    let summary: string = this.form.controls["summary"].value;
    let rating: number = this.form.controls["rating"].value;
    let genres: any = this.form.controls["genres"].value;
    let actors: any = this.form.controls["actors"].value;
    let duration: string = this.form.controls["duration"].value;
    let year: string = this.form.controls["year"].value;
    let image: string = this.filmImage;
    let types: any = [];
    let people: any = [];
    let k: any;

    for (k in genres) {
      types.push({
        "name": genres[k]
      });
    }

    for (k in actors) {
      people.push({
        "name": actors[k]
      });
    }

    if (this.isEditable) {
      // Edit
      if(image !== this.movieImage) {
        this._DB.uploadImage(image).then((snapshot: any) => {
          
          let uploadedImage: any = snapshot.downloadURL;

          this._DB.updateDatabase(this.movieId, {
            title: title,
            summary: summary,
            rating: rating,
            duration: duration,
            image: uploadedImage,
            genres: types,
            actors: people,
            year: year
          }).then((data) => {
            this._LOADER.hidePreloader();
          });
        })
      } else {
        this._DB.updateDatabase(this.movieId, {
          title: title,
          summary: summary,
          rating: rating,
          duration: duration,
          genres: types,
          actors: people,
          year: year
        }).then((data) => {
          this._LOADER.hidePreloader();
        });
      }
    } else {
      // Add
      this._DB.uploadImage(image).then((snapshot: any) => {
        console.log(snapshot);
        let pathImage: any = snapshot.a.fullPath;
        let nameImage: any = snapshot.a.name;
        let uploadedImage: any = snapshot.downloadURL;

        this._DB.addToDatabase({
          title: title,
          pathImage: pathImage,
          nameImage: nameImage,
          image: uploadedImage,
          summary: summary,
          rating: rating,
          duration: duration,
          genres: types,
          actors: people,
          year: year
        }).then((data) => {
          this._LOADER.hidePreloader();
        });
      });
    }

    this.closeModal(true);
  }

  closeModal(val = null) {
    this.viewCtrl.dismiss(val);
  }

  selectImage() {
    this._IMG.selectImage().then((data) => {
      this.filmImage = data;
    })
  }

}
