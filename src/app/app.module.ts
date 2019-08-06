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
import { CollectionService } from '../services/collection.service';
import { UserService } from '../services/domain/user.service';
import { AuthInterceptorProvider } from '../interceptors/auth-interceptor';
import { TitleService } from '../services/title.service';
import { PasswordCheckService } from '../services/password.check.service';
import { LoadingService } from '../services/loading.service';
import { DatePipe } from '@angular/common';
import { InsertReviewPage } from '../pages/insert-review/insert-review';
import { ImageUtilService } from '../services/image-util.service';
import { ReviewService } from '../services/domain/review.service';

@NgModule({
  declarations: [
    MyApp,
    InsertReviewPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InsertReviewPage
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
    ReviewService
  ]
})
export class AppModule {}
