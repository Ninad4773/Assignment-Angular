import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OTPService } from '../services/otp.service';
import { UserInfo } from '../Models/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  fmins: any;
  fsecs: any;
  stopClockInterval;
  resendOTPClicked: number = 0;
  showErrorMsg: boolean = false;
  OTPSent: boolean = false;
  validControls: number = 0;

  registrationForm: FormGroup;

  validationMessages = {
    city: {
      required: 'Enter city name',
    },
    panNo: {
      required: 'Enter pan card number',
      pattern: 'Enter valid pan card number',
    },
    fullName: {
      required: 'Enter full name',
    },
    email: {
      required: 'Enter emailId',
      pattern: 'Enter valid emialId',
    },
    mobileNo: {
      required: 'Enter mobile number',
      pattern: 'Enter valid mobile number',
    },
    otp: {
      required: 'Enter OTP',
      pattern: ' OTP must contains only digits.',
    },
  };

  formErrors = {
    city: '',
    panNo: '',
    fullName: '',
    email: '',
    mobileNo: '',
    otp: '',
  };

  constructor(
    private otpService: OTPService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      panNo: [
        '',
        [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]')],
      ],
      city: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      mobileNo: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      otp: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
    });

    this.registrationForm.valueChanges.subscribe((_) => {
      this.logValidationErrors(this.registrationForm);
    });

    this.registrationForm.get('mobileNo').valueChanges.subscribe((_) => {
      if (this.registrationForm.get('mobileNo').errors == null) {
        this.userInfo = {
          panNumber: this.registrationForm.get('panNo').value,
          city: this.registrationForm.get('city').value,
          fullname: this.registrationForm.get('fullName').value,
          email: this.registrationForm.get('email').value,
          mobile: this.registrationForm.get('mobileNo').value,
        };
        this.onMobile();
      }
    });

    this.registrationForm.get('otp').valueChanges.subscribe((_) => {
      if (this.registrationForm.get('otp').errors == null) {
        this.onOTP();
      }
    });
  }

  logValidationErrors(group: FormGroup = this.registrationForm) {
    Object.keys(group.controls).forEach((key) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        const messages = this.validationMessages[key];
        for (const errorkey in abstractControl.errors) {
          if (errorkey) {
            this.formErrors[key] += messages[errorkey] + ' ';
          }
        }
      }
    });
  }

  onMobile() {
    if (this.OTPSent == false) {
      this.otpService.getOTP(this.userInfo).subscribe((data) => {
        if (data.status == 'Success' && data.statusCode == 200) {
          this.OTPSent = true;
          this.showOTPField = false;
          this.countTime();
        } else if (data.status == 'Missing Params' && data.statusCode == 500) {
          this.registrationForm.patchValue({ mobileNo: '' });
          this.showAlert('Fill the complete form');
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

    if (this.fmins == 0 && this.fsecs == 0) {
      this.disableResendOTP = false;
      clearTimeout(this.stopClockInterval);
    }
  }

  onResendClick() {
    this.resendOTPClicked++;
    this.registrationForm.patchValue({
      otp: '',
    });
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
    this.validControls = 0;
    Object.keys(this.registrationForm.controls).forEach((key) => {
      if (key != 'otp') {
        const controls = this.registrationForm.get(key);
        // console.log(controls.errors)
        if(controls.errors) {
          this.validControls -= 1;
        } else {
          this.validControls +=  1;
        }
      }
    });
    if(this.validControls == 5) {
    this.otpService
      .verifyOTP(this.userInfo.mobile, this.registrationForm.get('otp').value)
      .subscribe((data: any) => {
        if (data.status == 'Success' && data.statusCode == 200) {
          this.router.navigate(['/success', this.userInfo.fullname]);
          clearTimeout(this.stopClockInterval);
        }
      });
  } else {
    this.showAlert('Please fill form correctly');
    this.registrationForm.patchValue({
      otp: '',
    });
  }
}

  showAlert(message) {
    alert(message);
  }
}
