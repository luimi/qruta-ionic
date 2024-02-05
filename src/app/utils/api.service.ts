import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from './constants';
import { lastValueFrom } from 'rxjs';
import Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public async nearRoutes(server: any, data: any) {
    return await this.request(constants.methods.nearRoutes, server, data)
  }
  public async calculate(server: any, data: any) {
    return await this.request(constants.methods.calculate, server, data)
  }
  public async getServer(city: string) {
    let server: any;
    for (let i = 0; i < 3; i++) {
      server = await Parse.Cloud.run(constants.methods.getServer, { city });
      if (server.success) break;
      await this.sleep(3000)
    }
    return server
  }
  private async request(method: string, server: any, data: any) {
    try {
      let response: any = await lastValueFrom(
        this.http.post(`${server.url}/functions/${method}`,
          data, {
          headers: { 'X-Parse-Application-Id': process.env["NG_APP_APPID"] || "" }
        })
      )
      return response.result
    } catch (e) {
      return { success: false }
    }
  }
  private async sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
