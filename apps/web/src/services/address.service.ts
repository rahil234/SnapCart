import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';
import {
  CreateAddressDto,
  UpdateAddressDto,
  AddressesApi,
} from '@/api/generated';

const addressApi = new AddressesApi(apiConfig, undefined, apiClient);

export const AddressService = {
  addAddress: (dto: CreateAddressDto) =>
    handleRequest(() => addressApi.addressControllerCreate(dto)),
  updateAddress: (addressId: string, dto: UpdateAddressDto) =>
    addressApi.addressControllerUpdate(addressId, dto),
  deleteAddress: (addressId: string) =>
    handleRequest(() => addressApi.addressControllerDelete(addressId)),
  setPrimaryAddress: (addressId: string) =>
    addressApi.addressControllerUpdate(addressId, { isPrimary: true }),
};
