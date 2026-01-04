export interface Agent {
  id: number;
  email: string;
  password?: string; // Optionnel ici car le serveur ne renvoie souvent pas le mot de passe
  firstName: string;
  lastName: string;
  role: 'admin' | 'livreur' | 'finance';
  avatar?: string;
}

export interface User {
  token: string;
  agent: Agent;
}