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
 * Types de rôles autorisés pour le personnel (Exclut 'client')
 */
export type StaffRole = 'admin' | 'vendeur' | 'finance';

export interface OrderAgentAssignment {
    agentId: string;
    agentName: string;
    agentPhone: string;
    role: StaffRole; 
    assignedAt: string;
    updatedAt: string;
}

export interface OrderAdmin {
    id: string;
    orderNumber: string;
    userId?: string;
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
    assignedAgent?: OrderAgentAssignment;
    paymentMethod: 'stripe' | 'paypal' | 'mobile_money' | 'cash';
    paymentIntentId?: string;
    createdAt: string; // ISO String ou Date
    updatedAt: string;
}

export interface OrderLogisticsHistory {
    agent: string;
    role: StaffRole;
    date: string;
    action: string;
}

export interface OrderLogistics {
    orderId: string;
    internalNotes: string;
    agentIds: string[];
    lastAgentId: string;
    updatedAt: string;
    history: OrderLogisticsHistory[];
}

/**
 * Réponse standardisée pour l'API Express
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}