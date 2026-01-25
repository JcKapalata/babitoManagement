import { Agent } from "./agent";

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: Agent;   // Le backend renvoie l'objet user (mappé à Agent)
    agent?: Agent;  // Compatibilité rétroactive
    token?: string; // Le JWT
}