import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StoryComponent } from './story.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
    declarations: [StoryComponent],
    exports: [StoryComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StoryModule { }
