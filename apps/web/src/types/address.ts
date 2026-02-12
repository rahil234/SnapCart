export interface Address {
  id: string;
  customerId: string;
  isPrimary: boolean;
  houseNo?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}
