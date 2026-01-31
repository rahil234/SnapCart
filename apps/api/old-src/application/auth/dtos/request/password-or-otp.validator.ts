import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { AuthMethod } from '@/domain/auth/enums';

@ValidatorConstraint({ name: 'PasswordOrOtp', async: false })
export class PasswordOrOtpConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as {
      method: AuthMethod;
      password: string;
      otp: string;
    };
    return obj.method === AuthMethod.OTP
      ? Boolean(obj.otp)
      : Boolean(obj.password);
  }

  defaultMessage() {
    return 'Either password or otp must be provided';
  }
}
