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
import { CollectionPage } from '../pages/collection/collection';
import { LoadingService } from '../services/loading.service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
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
    LoadingService
  ]
})
export class AppModule {}
