import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OTPService {
  constructor(private http: HttpClient) {}

  getOTP(userInfo): Observable<any> {
    return this.http.post(
      'http://lab.thinkoverit.com/api/getOTP.php',
      JSON.stringify(userInfo)
    );
  }

  verifyOTP(mobile, otp) {
    let obj = {
      mobile: mobile,
      otp: otp,
    };
    return this.http.post(
      'http://lab.thinkoverit.com/api/verifyOTP.php',
      JSON.stringify(obj)
    );
  }
}
