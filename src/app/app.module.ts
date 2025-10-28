import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppConfig } from './utils/appConfig';
import { UtilsService } from './utils/utils.service';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { AdvertiseComponent } from './components/advertise/advertise.component';

export function LanguageLoader(http: HttpClient) {
    //return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
    return new TranslateHttpLoader();
}

@NgModule({
    declarations: [AppComponent, AdvertiseComponent],
    bootstrap: [AppComponent],
    schemas: [],
    exports: [AdvertiseComponent], 
    imports: [
        BrowserModule, 
        IonicModule.forRoot({ mode: 'ios', hardwareBackButton: false, swipeBackEnabled: false }), 
        AppRoutingModule,
        /*TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (LanguageLoader),
                deps: [HttpClient]
            }
        })*/
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: AppConfig,
            deps: [UtilsService],
            multi: true
        }, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideHttpClient(withInterceptorsFromDi()),
        provideTranslateService({
            lang: 'en',
            fallbackLang: 'en',
            loader: provideTranslateHttpLoader({
                prefix: '/assets/i18n/',
                suffix: '.json'
            })
        }),
    ]
})
export class AppModule { }
