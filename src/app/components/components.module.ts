import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { InputComponent } from './input/input.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, ],
    declarations: [ProfileComponent, LoginComponent, InputComponent],
    exports: [ProfileComponent, LoginComponent, InputComponent]
})
export class ComponentsModule { }
