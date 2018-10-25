import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewTalkPage } from './new-talk';

@NgModule({
  declarations: [
    NewTalkPage,
  ],
  imports: [
    IonicPageModule.forChild(NewTalkPage),
  ],
})
export class NewTalkPageModule {}
