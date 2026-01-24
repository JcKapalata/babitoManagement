export interface Agent {
  id: string;          // UID Firebase
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; // Ajouté pour être raccord avec le back
  role: 'admin' | 'vendeur' | 'finance';
  status: 'active' | 'banned';
  avatar?: string;     // Base64 ou URL
  password?: string;   // Optionnel (utilisé seulement pour l'envoi)
  createdAt?: string;
}

export interface User {
  token: string;
  agent: Agent;
}