import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TalkDetailPage } from './talk-detail';

@NgModule({
  declarations: [
    TalkDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TalkDetailPage),
  ],
})
export class TalkDetailPageModule {}
