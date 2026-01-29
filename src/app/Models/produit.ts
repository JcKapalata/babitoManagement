export interface Produit{
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
    dateAjout: Date;
    dateModification: Date;
    
    // On intègre ici le détail par taille (correspond au backend: tailles)
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