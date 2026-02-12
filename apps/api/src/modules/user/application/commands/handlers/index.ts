import { CreateUserHandler } from './create-user.handler';
import { UpdateUserHandler } from './update-user.handler';
import { UpdateUserStatusHandler } from './update-user-status.handler';
import { CreateAddressHandler } from './create-address.handler';
import { UpdateAddressHandler } from './update-address.handler';
import { DeleteAddressHandler } from './delete-address.handler';
import { UpgradeToSellerHandler } from './upgrade-to-seller.handler';
import { GenerateProfilePictureUploadUrlHandler } from './generate-profile-picture-upload-url.handler';
import { SaveProfilePictureHandler } from './save-profile-picture.handler';

export class CommandHandlers {
  static handlers = [
    CreateUserHandler,
    UpdateUserHandler,
    UpdateUserStatusHandler,
    CreateAddressHandler,
    UpdateAddressHandler,
    DeleteAddressHandler,
    UpgradeToSellerHandler,
    GenerateProfilePictureUploadUrlHandler,
    SaveProfilePictureHandler,
  ];
}
