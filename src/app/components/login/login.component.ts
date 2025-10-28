import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { constants } from 'src/app/utils/constants';
import Parse from 'parse';
import { UtilsService } from 'src/app/utils/utils.service';
//import { SocialLogin } from '@capgo/capacitor-social-login';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {
  emailForm: any = { email: '', valid: false }
  codeForm: any = { code: '', count: 0 }
  step: number = 0;
  countDown: any = { count: 0 };
  isLoading: boolean = false;

  constructor(public modalCtrl: ModalController, private utils: UtilsService) { }

  ngOnInit() { }

  emailChange(email: string) {
    this.emailForm.email = email
  }
  emailValidityChange(isValid: boolean) {
    this.emailForm.valid = isValid && this.emailForm.email !== "";
  }

  async sendOTPCode() {
    this.isLoading = true;
    let result = await Parse.Cloud.run(constants.methods.sendOTPCode, { email: this.emailForm.email });
    if (result.success) {
      this.step = 1;
      this.startCount()
    } else {
      this.utils.showAlert("No pudimos enviarte el correo, intenta nuevamente mas tarde")
    }
    this.isLoading = false;
  }

  codeChange(code: string) {
    this.codeForm.code = code;
  }

  async validateOTP() {
    this.isLoading = true;
    try {
      await Parse.User.logIn(this.emailForm.email, this.codeForm.code);
      this.modalCtrl.dismiss()
    } catch (e) {
      this.utils.showAlert('Código invalido')
    }
    this.isLoading = false;
  }

  startCount() {
    this.codeForm.count++;
    let count = this.codeForm.count * 60;
    this.countDown.count = count;
    this.countDown.timer = setInterval(() => {
      this.countDown.count--;
      if (this.countDown.count === 0 || this.step === 0) {
        clearInterval(this.countDown.timer)
      }
    }, 1000)
  }
  async loginGoogle() {
    /*const res: any = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      },
    });
    if (res) {
      this.handleLogin(res)
      SocialLogin.logout({ provider: 'google' })
      this.modalCtrl.dismiss()
    }*/
  }

  async handleLogin(response: any) {
    const { provider, result } = response;
    const { accessToken, idToken, profile, responseType } = result;
    const id = profile[provider === 'google' ? 'id' : 'user'];
    const authData: any = { id: id }
    const token = provider === 'google' ? 'id_token' : 'token';
    authData[token] = idToken
    try {
      const user = await Parse.User.logInWith(provider, { authData });
      if (new Date().getTime() - user.get('createdAt').getTime() < 60 * 1000) {
        user.set('username', profile.email)
        user.set('email', profile.email);
        user.set('name', `${profile.givenName} ${profile.familyName}`)
        user.set('avatar', profile.imageUrl)
        await user.save();
      }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
    return { success: true }
  }
}
