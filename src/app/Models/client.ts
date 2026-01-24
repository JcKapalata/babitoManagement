export interface AddressData {
    id: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

/**
 * Modèle pour les clients finaux (Babito Clients)
 */
export interface UserClient {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    status: 'active' | 'banned';
    avatar?: string;
    adressesLivraison: AddressData[];
    createdAt?: string;
}

/**
 * Si ton API de login client renvoie un token spécifique
 */
export interface AuthClientResponse {
    token: string;
    client: UserClient;
}