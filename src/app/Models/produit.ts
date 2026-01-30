export interface Produit {
    id: string;
    codeFournisseur: string;
    codeProduit: string;
    nom: string;
    devise: 'USD' | 'CDF';
    region: string;
    classement: string;
    categorie: string;
    type: string;
    description: string;

    // Utilisation de string pour la compatibilité JSON/Firebase (ISO String)
    // ou number si tu utilises Date.now()
    createdAt: string | any; 
    updatedAt: string | any;

    tailles: {
        [taille: string]: {
            prix: number;
            couleurs: {
                nom: string;
                image: string;
                stock: number;
            }[];
        };
    };
}
export interface ProduitRow extends Produit {
  couleurSpecifique: string;
  quantiteSpecifique: number;
  isFirstRow: boolean; // Pour savoir si on affiche les colonnes fusionnées
}

export interface ApiProductResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}