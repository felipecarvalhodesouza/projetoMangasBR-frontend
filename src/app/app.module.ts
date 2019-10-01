import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ErrorInterceptorProvider } from '../interceptors/error-interceptor';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import { CollectionService } from '../services/domain/collection.service';
import { UserService } from '../services/domain/user.service';
import { AuthInterceptorProvider } from '../interceptors/auth-interceptor';
import { TitleService } from '../services/domain/title.service';
import { PasswordCheckService } from '../services/password.check.service';
import { LoadingService } from '../services/loading.service';
import { DatePipe } from '@angular/common';
import { InsertReviewPage } from '../pages/insert-review/insert-review';
import { ImageUtilService } from '../services/image-util.service';
import { ReviewService } from '../services/domain/review.service';
import { PublisherService } from '../services/domain/publisher.service';
import { PublisherInformationPage } from '../pages/publisher-information/publisher-information';
import { InsertVolumePage } from '../pages/insert-volume/insert-volume';
import { VolumeService } from '../services/domain/volume.service';
import { Camera } from '@ionic-native/camera';
import { InsertTitlePage } from '../pages/insert-title/insert-title';
import { ProfilePictureModalPage } from '../pages/profile-picture-modal/profile-picture-modal';

@NgModule({
  declarations: [
    MyApp,
    InsertReviewPage,
    InsertVolumePage,
    PublisherInformationPage,
    InsertTitlePage,
    ProfilePictureModalPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InsertReviewPage,
    InsertVolumePage,
    PublisherInformationPage,
    InsertTitlePage,
    ProfilePictureModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ErrorInterceptorProvider,
    AuthInterceptorProvider,
    AuthService,
    StorageService,
    CollectionService,
    UserService,
    TitleService,
    PasswordCheckService,
    LoadingService,
    DatePipe,
    ImageUtilService,
    ReviewService,
    PublisherService,
    VolumeService,
    Camera
  ]
})
export class AppModule {}
