export interface Produit{
    id: number;
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
    
    // On intègre ici le détail par taille
    taille: {
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