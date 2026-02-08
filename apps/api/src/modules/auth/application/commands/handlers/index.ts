import { LoginHandler } from './login.handler';
import { RegisterHandler } from './register.handler';
import { VerifyOTPHandler } from './verify-otp.handler';
import { RequestOTPHandler } from './request-otp.handler';
import { RefreshTokenHandler } from './refresh-token.handler';
import { LoginWithGoogleHandler } from './login-with-google.handler';

export class CommandHandlers {
  static handlers = [
    RegisterHandler,
    LoginHandler,
    LoginWithGoogleHandler,
    RequestOTPHandler,
    VerifyOTPHandler,
    RefreshTokenHandler,
  ];
}
