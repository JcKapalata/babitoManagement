export interface Produit {
    id: number;
    codeFournisseur: string;
    codeProduit: string;
    nom: string;
    prix: { [taille: string]: number };
    devise: 'USD' | 'CDF';
    region: string;
    classement: string;
    categorie: string;
    quantiteTotal: { [couleur: string]: number };
    type: string;
    taille: string[];
    couleur: string[];
    description: string;
    imagesParCouleur: { [couleur: string]: string };
    dateAjout: Date;
    dateModification: Date;
    rowCount?: number;
}

export interface ProduitRow extends Produit {
  couleurSpecifique: string;
  quantiteSpecifique: number;
  isFirstRow: boolean; // Pour savoir si on affiche les colonnes fusionnées
}