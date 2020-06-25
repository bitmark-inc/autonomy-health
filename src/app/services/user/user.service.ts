declare var window:any;

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Observer, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';

import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  private statusSubject = new BehaviorSubject(false);
  private user: {
    id: string,
    key: string,
    jwt: string,
    account_number: string,
    state: {
      last_active_time: string,
      location: string,
    },
    metadata: {},
    created_at: string,
    updated_at: string
  };

  constructor(protected http: HttpClient) {
    super(http);
    let localUserData = window.localStorage.getItem('user');
    if (localUserData) {
      try {
        this.user = JSON.parse(localUserData);
      } catch (err) {}
    }
    if (this.user) {
      this.authenticate().subscribe(
        () => this.statusSubject.next(true)
      );
    } else {
      this.statusSubject.next(true);
    }
  }

  public getStatus() {
    return this.statusSubject;
  }

  public getUser() {
    return this.user;
  }

  public getJWT() {
    return this.user ? this.user.jwt : null;
  }

  public getAccountNumber(): string {
    return this.user.account_number;
  }

  public register() {
    let userKey = uuidv4();
    return Observable.create(observer => {
      console.log('Got here');
      this.sendHttpRequest('post', 'api/accounts', {
        enc_pub_key: "temporary_encryption_public_key",
        metadata: {
          source: 'test-pwa'
        }
      }, {
        headers: {
          'requester': userKey
        }
      }).subscribe(
        (data: {result: any}) => {
          this.user = data.result;
          this.user.key = userKey;
          this.user.account_number = userKey;
          window.localStorage.setItem('user', JSON.stringify(this.user));
          this.authenticate().subscribe();

          observer.next(this.user);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        });
    });
  }

  public signin(key: string) {
    let userKey = key;
    return Observable.create(observer => {
      this.sendHttpRequest('get', 'api/accounts/me', {}, {
        headers: {
          'requester': key,
        }
      }).subscribe(
        (data: {result: any}) => {
          this.user = data.result;
          this.user.key = userKey;
          this.user.account_number = userKey;
          window.localStorage.setItem('user', JSON.stringify(this.user));
          this.authenticate().subscribe();

          observer.next(this.user);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public authenticate() {
    return Observable.create(observer => {
      this.user.jwt = this.user.key;
      observer.next();
      observer.complete();
    });
  }
}
