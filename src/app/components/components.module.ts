import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { InputComponent } from './input/input.component';
import { TranslateModule } from '@ngx-translate/core';
import { RemoveadvertiseComponent } from './removeadvertise/removeadvertise.component';
import { AdvertiseComponent } from './advertise/advertise.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
    declarations: [ProfileComponent, LoginComponent, InputComponent, RemoveadvertiseComponent, AdvertiseComponent],
    exports: [ProfileComponent, LoginComponent, InputComponent, RemoveadvertiseComponent, AdvertiseComponent]
})
export class ComponentsModule { }
