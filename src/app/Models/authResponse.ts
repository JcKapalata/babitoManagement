import { Agent } from "./agent";

export interface AuthResponse {
    success: boolean;
    message: string;
    agent?: Agent;   // Le backend renvoie l'objet Agent
    token?: string; // Le JWT
}