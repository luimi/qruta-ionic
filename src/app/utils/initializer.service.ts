import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitializerService {

  constructor() { }

  public init() {
    console.log("initialize")
    return new Promise((res,rej) => {
      setTimeout(() => {
        console.log("promise")
        res("ok")
      }, 3000);
    })
  }
}
