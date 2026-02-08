import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';
import {
  AddressesApi,
  CreateAddressDto,
  UpdateAddressDto,
} from '@/api/generated';

const addressApi = new AddressesApi(apiConfig, undefined, apiClient);

export const AddressService = {
  fetchMyAddresses: () =>
    handleRequest(() => addressApi.addressControllerFind()),
  addAddress: (dto: CreateAddressDto) =>
    handleRequest(() => addressApi.addressControllerCreate(dto)),
  updateAddress: (addressId: string, dto: UpdateAddressDto) =>
    handleRequest(() => addressApi.addressControllerUpdate(addressId, dto)),
  deleteAddress: (addressId: string) =>
    handleRequest(() => addressApi.addressControllerDelete(addressId)),
  setPrimaryAddress: (addressId: string) =>
    handleRequest(() =>
      addressApi.addressControllerUpdate(addressId, { isPrimary: true })
    ),
};
