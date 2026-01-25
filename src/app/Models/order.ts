export interface MultiCurrencyAmount {
    usd: number;
    cdf: number;
}

export interface OrderItem {
    productId: string;
    productName: string;
    productCode: string;
    selectedSize: string;
    selectedColor: string;
    selectedImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    devise: 'USD' | 'CDF';
}

export interface OrderAddress {
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

/**
 * Interface complète utilisée par l'Admin
 * Contient toutes les données sensibles et logistiques
 */
export interface OrderAdmin {
    id: string;                    // ID du document Firestore
    orderNumber: string;           // Ex: ORD-2024-0042
    userId?: string;               // Optionnel si achat invité
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: OrderAddress;
    items: OrderItem[];
    subtotal: MultiCurrencyAmount; 
    shippingCost: number;
    total: MultiCurrencyAmount;
    currency: 'USD' | 'CDF' | 'mixed';
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: 'stripe' | 'paypal' | 'mobile_money' | 'cash';
    paymentIntentId?: string;      // Référence de transaction
    createdAt: string;             // ISO Date
    updatedAt: string;             // ISO Date
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}