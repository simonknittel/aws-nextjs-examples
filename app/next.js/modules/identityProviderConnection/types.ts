import { User } from "../user/types";

export interface IdentityProviderConnection {
  userId: User['id'];
  provider: string;
  providerId: string;
  providerEmail?: string;
}

export interface CreateItem {
  userId: IdentityProviderConnection['userId'];
  provider: IdentityProviderConnection['provider'];
  providerId: IdentityProviderConnection['providerId'];
  providerEmail?: IdentityProviderConnection['providerEmail'];
}

export interface FindByProviderIdItem {
  provider: IdentityProviderConnection['provider'];
  providerId: IdentityProviderConnection['providerId'];
}

export interface DeleteItem {
  provider: IdentityProviderConnection['provider'];
  providerId: IdentityProviderConnection['providerId'];
}

export interface IdentityProviderConnectionServiceInterface {
  create(items: CreateItem[]): Promise<void>;
  findByProviderId(items: FindByProviderIdItem[]): Promise<IdentityProviderConnection[]>
  delete(items: DeleteItem[]): Promise<void>;
}