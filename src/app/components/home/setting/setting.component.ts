declare var window: any;

import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  public appVersion: string = environment.version;

  constructor(private location: Location, public router: Router, private userService: UserService) {}

  ngOnInit() {}

  public back(): void {
    this.location.back();
  }

  public openIntercom(): void {
    let hash = window.sha3_256(this.userService.getAccountNumber());
    let icUserID = `Autonomy_pwa_${hash}`;
    window.Intercom('boot', {
      app_id: window.intercomSettings.app_id,
      user_id: icUserID,
      hide_default_launcher: true
    });
    window.Intercom('show');
  }

  public openFeedback() {
    EventEmitterService.getEventEmitter(EventEmitterService.Events.FeedbackDialogShown).emit({ fromQ1: true })
  }

}
