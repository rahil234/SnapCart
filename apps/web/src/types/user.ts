export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  addresses: any[]; // Replace 'any' with a more specific type if you have one for Address
}
