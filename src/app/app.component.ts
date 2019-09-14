import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public push: Push,
    public alertCtrl: AlertController,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPushNotification();
    });
  }

  async initPushNotification(){

    const options: PushOptions = {
      android: {
        senderID: environment.projectId,
        //forceShow: true,
        vibrate: true
      }
    };
  
    const pushObject: PushObject = this.push.init(options);
  
      pushObject.on('registration').subscribe(async (data: any) => {
        console.log("device token:", data.registrationId);
  
        let alert = await this.alertCtrl.create({
          header: 'device token',
          subHeader: data.registrationId,
          buttons: ['OK']
        });
        await alert.present();
  
      });
  
      pushObject.on('notification').subscribe(async (data: any) => {
        console.log(data);
        console.log('message', data.message);
        if (data.additionalData.foreground) {
          let confirmAlert = await this.alertCtrl.create({
            header: 'New Notification',
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'View',
              handler: () => {
                //TODO: Your logic here
              }
            }]
          });
          confirmAlert.present();
        } 
        else {
          console.log('not inside app')
          this.router.navigateByUrl('/home');
          console.log("Push notification clicked");
        }
     });
  
    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }
}
