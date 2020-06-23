import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { UserService } from '../user/user.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends BaseService {
  constructor(protected http: HttpClient, private userService: UserService) {
    super(http);
  }

  public request(method: string, url: string, params?, options?) {
    let jwt = this.userService.getJWT();
    if (jwt) {
      options = options || {};
      options.headers = options.headers || {};
      options.headers.jwt = options.headers.jwt || jwt;
    }
    return this.sendHttpRequest(method, url, params, options);
  }
}
