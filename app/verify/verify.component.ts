import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OTPService } from '../services/otp.service';
import { UserInfo } from '../Models/models';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  userInfo: UserInfo = {
    panNumber: '',
    city: '',
    fullname: '',
    email: '',
    mobile: '',
  };

  otp: string = '';
  showOTPField: boolean = true;
  disableResendOTP: boolean = true;

  secs = 0;
  fmins: any = 0;
  fsecs: any = 0;
  stopClockInterval;
  resendOTPClicked: number = 0;
  showErrorMsg: boolean = false;
  OTPSent: boolean = false;

  constructor(private otpService: OTPService, private router: Router) {}

  ngOnInit(): void {}

  onMobile() {
    let isCharacter: boolean = false;
    if (!this.userInfo.mobile.match(/^[0-9]+$/)) isCharacter = true;
    if (
      isCharacter == false &&
      this.userInfo.mobile.length == 10 &&
      this.OTPSent == false
    ) {
      this.otpService.getOTP(this.userInfo).subscribe((data) => {
        if (data.status == 'Success' && data.statusCode == 200) {
          this.OTPSent = true;
          this.showOTPField = false;
          this.countTime();
        }
      });
    }
  }

  countTime() {
    this.secs = 180;
    this.stopClockInterval = setInterval((_) => this.startTimer(), 1000);
  }

  startTimer() {
    this.secs--;
    this.fmins = Math.floor(this.secs / 60);
    this.fsecs = Math.floor(this.secs % 60);
    if (this.fmins <= 9) {
      this.fmins = '0' + this.fmins;
    }
    if (this.fsecs <= 9) {
      this.fsecs = '0' + this.fsecs;
    }
    if (this.secs >= 0) {
      document.getElementById('timer').innerHTML =
        this.fmins + ':' + this.fsecs;
    }
    if (this.fmins == 0 && this.fsecs == 0) {
      this.disableResendOTP = false;
      clearTimeout(this.stopClockInterval);
    }
  }

  onResendClick() {
    this.resendOTPClicked++;
    this.otp = '';
    if (this.resendOTPClicked > 2) {
      this.showErrorMsg = true;
    } else {
      this.disableResendOTP = true;
      this.otpService.getOTP(this.userInfo).subscribe((data) => {
        if (data.status == 'Success' && data.statusCode == 200) {
          this.showOTPField = false;
          this.countTime();
        }
      });
    }
  }

  onOTP() {
    let isCharacter: boolean = false;
    if (!this.otp.match(/^[0-9]+$/)) isCharacter = true;
    if (isCharacter == false && this.otp.length == 4) {
      this.otpService
        .verifyOTP(this.userInfo.mobile, this.otp)
        .subscribe((data: any) => {
          if (data.status == 'Success' && data.statusCode == 200) {
            this.router.navigate(['/success', this.userInfo.fullname]);
            clearTimeout(this.stopClockInterval);
          }
        });
    }
  }
}
