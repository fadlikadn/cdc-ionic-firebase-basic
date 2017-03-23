import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Camera } from 'ionic-native';

/*
  Generated class for the Image provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Image {

  public cameraImage: String;

  constructor(public http: Http) {
    console.log('Hello Image Provider');
  }

  selectImage(): Promise<any> {
    return new Promise(resolve => {
      let cameraOptions = {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.DATA_URL,
        quality: 100,
        targetWidth: 320,
        targetHeight: 240,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true
      };

      Camera.getPicture(cameraOptions).then((data) => {
        this.cameraImage = "data:image/jpeg;base64," + data;
        resolve(this.cameraImage);
      });
    });
  }

}
