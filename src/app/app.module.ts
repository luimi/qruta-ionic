import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppConfig } from './utils/appConfig';
import { UtilsService } from './utils/utils.service';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot({swipeBackEnabled: false}), AppRoutingModule, HttpClientModule],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: AppConfig,
    deps: [UtilsService],
    multi: true
   },{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: []
})
export class AppModule {}
