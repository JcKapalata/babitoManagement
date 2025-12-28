import { Produit } from "../Models/produit";

export const PRODUITS: Produit[] = [
  { 
    id: 1, 
    codeFournisseur: 'BBI',
    codeProduit: 'BBI-VET-001', 
    nom: 'Body bébé coton', 
    devise: 'USD',
    region: 'Goma',
    classement: 'Vêtements & Mode',
    categorie: 'Vêtement',
    type: 'Body',
    description: 'Body confortable 100% coton pour bébé.', 
    dateAjout: new Date('2024-01-10T10:00:00'),
    dateModification: new Date('2024-02-15T14:30:00'),
    taille: {
      '6-9 mois': {
        prix: 9.99,
        couleurs: [
          { nom: 'rose', image: 'imagesProduits/bbi-vet-001/rose.jpeg', stock: 45 },
          { nom: 'bleu', image: 'imagesProduits/bbi-vet-001/bleu.jpeg', stock: 30 }
        ]
      }
    }
  },
  { 
    id: 2, 
    codeFournisseur: 'BBI',
    codeProduit: 'BBI-VET-002', 
    nom: 'Pyjama bébé', 
    devise: 'USD',
    region: 'Beni',
    classement: 'Vêtements & Mode',
    categorie: 'Vêtement',
    type: 'Pyjama',
    description: 'Pyjama doux et chaud en velours.', 
    dateAjout: new Date('2024-01-12T09:15:00'),
    dateModification: new Date('2024-01-12T09:15:00'),
    taille: {
      '12-18 mois': {
        prix: 12.99,
        couleurs: [
          { nom: 'glauque', image: 'imagesProduits/bbi-vet-002/glauque.jpeg', stock: 12 },
          { nom: 'chocolat', image: 'imagesProduits/bbi-vet-002/chocolat.jpeg', stock: 25 }
        ]
      }
    }
  },
  { 
    id: 3, 
    codeFournisseur: 'ACC-DIST',
    codeProduit: 'BBI-ACC-003', 
    nom: 'Chaussettes', 
    devise: 'CDF',
    region: 'Butembo',
    classement: 'Vêtements & Mode',
    categorie: 'Accessoire',
    type: 'Chaussette',
    description: 'Lot de 5 paires de chaussettes en coton.', 
    dateAjout: new Date('2023-12-20T16:45:00'),
    dateModification: new Date('2024-03-01T11:20:00'),
    taille: {
      'Taille unique': {
        prix: 2000,
        couleurs: [
          { nom: 'rose', image: 'imagesProduits/bbi-acc-003/rose.jpeg', stock: 0 },
          { nom: 'multicolore', image: 'imagesProduits/bbi-acc-003/multicolore.png', stock: 40 },
          { nom: 'bleu', image: 'imagesProduits/bbi-acc-003/bleu.jpeg', stock: 30 },
          { nom: 'blanc', image: 'imagesProduits/bbi-acc-003/blanc.jpeg', stock: 100 }
        ]
      }
    }
  },
  { 
    id: 4, 
    codeFournisseur: 'TOY-WORLD',
    codeProduit: 'BBI-JOU-004', 
    nom: 'Jouet en peluche', 
    devise: 'USD',
    region: 'Goma',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Peluche',
    description: 'Peluche douce en forme d\'ours pour câlins.', 
    dateAjout: new Date('2024-02-01T08:00:00'),
    dateModification: new Date('2024-02-05T09:00:00'),
    taille: {
      '30 cm': {
        prix: 15.99,
        couleurs: [
          { nom: 'lin', image: 'imagesProduits/bbi-jou-004/lin.jpeg', stock: 15 },
          { nom: 'chocolat', image: 'imagesProduits/bbi-jou-004/chocolat.jpeg', stock: 0 }
        ]
      },
      '40 cm': {
        prix: 19.99,
        couleurs: [
          { nom: 'rose', image: 'imagesProduits/bbi-jou-004/rose.jpeg', stock: 0 }
        ]
      }
    }
  },
  { 
    id: 5, 
    codeFournisseur: 'KID-TOYS',
    codeProduit: 'BBI-JOU-005', 
    nom: 'Cube d’éveil', 
    devise: 'USD',
    region: 'Beni',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Éveil',
    description: 'Cube sensoriel avec couleurs, textures et sons.', 
    dateAjout: new Date('2024-02-10T14:00:00'),
    dateModification: new Date('2024-02-10T14:00:00'),
    taille: {
      '15 cm': {
        prix: 18.99,
        couleurs: [
          { nom: 'bois', image: 'imagesProduits/bbi-jou-005/bois.jpeg', stock: 5 },
          { nom: 'rouge', image: 'imagesProduits/bbi-jou-005/rouge.jpeg', stock: 12 }
        ]
      },
      '20 cm': {
        prix: 22.50,
        couleurs: [
          { nom: 'jaune', image: 'imagesProduits/bbi-jou-005/jaune.jpeg', stock: 10 },
          { nom: 'bleu', image: 'imagesProduits/bbi-jou-005/bleu.jpeg', stock: 15 }
        ]
      }
    }
  },
  { 
    id: 6, 
    codeFournisseur: 'KID-TOYS',
    codeProduit: 'BBI-JOU-006', 
    nom: 'Hochet', 
    devise: 'USD',
    region: 'Butembo',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Éveil',
    description: 'Hochet facile à tenir, sans BPA.', 
    dateAjout: new Date('2024-02-12T11:00:00'),
    dateModification: new Date('2024-02-12T11:00:00'),
    taille: {
      '10 cm': {
        prix: 7.99,
        couleurs: [
          { nom: 'bisque', image: 'imagesProduits/bbi-jou-006/bisque.jpeg', stock: 20 },
          { nom: 'vert', image: 'imagesProduits/bbi-jou-006/vert.jpeg', stock: 15 },
          { nom: 'bleu', image: 'imagesProduits/bbi-jou-006/bleu.jpeg', stock: 25 },
          { nom: 'rose', image: 'imagesProduits/bbi-jou-006/rose.jpeg', stock: 30 }
        ]
      }
    }
  },
  { 
    id: 7, 
    codeFournisseur: 'MODA-KID',
    codeProduit: 'BBI-VET-007', 
    nom: 'T-shirt enfant', 
    devise: 'USD',
    region: 'Goma',
    classement: 'Vêtements & Mode',
    categorie: 'Vêtement',
    type: 'T-shirt',
    description: 'T-shirt coton avec motif dinosaure fun.', 
    dateAjout: new Date('2024-03-01T09:00:00'),
    dateModification: new Date('2024-03-05T10:30:00'),
    taille: {
      '2 ans': {
        prix: 8.99,
        couleurs: [
          { nom: 'noire', image: 'imagesProduits/bbi-vet-007/noire.jpeg', stock: 40 },
          { nom: 'rose', image: 'imagesProduits/bbi-vet-007/rose.jpeg', stock: 55 },
          { nom: 'jaune', image: 'imagesProduits/bbi-vet-007/jaune.jpeg', stock: 30 },
          { nom: 'bleu', image: 'imagesProduits/bbi-vet-007/bleu.jpeg', stock: 20 }
        ]
      }
    }
  },
  { 
    id: 8, 
    codeFournisseur: 'MODA-KID',
    codeProduit: 'BBI-VET-008', 
    nom: 'Short bébé', 
    devise: 'USD',
    region: 'Beni',
    classement: 'Vêtements & Mode',
    categorie: 'Vêtement',
    type: 'Short',
    description: 'Short léger en coton idéal pour l\'été.', 
    dateAjout: new Date('2024-03-02T15:00:00'),
    dateModification: new Date('2024-03-02T15:00:00'),
    taille: {
      '6 mois': {
        prix: 6.99,
        couleurs: [
          { nom: 'gris', image: 'imagesProduits/bbi-vet-008/gris.jpeg', stock: 25 },
          { nom: 'bleu ciel', image: 'imagesProduits/bbi-vet-008/bleu-ciel.jpeg', stock: 40 },
          { nom: 'rouge', image: 'imagesProduits/bbi-vet-008/rouge.jpeg', stock: 15 }
        ]
      }
    }
  },
  { 
    id: 9, 
    codeFournisseur: 'PHARMA-BABY',
    codeProduit: 'BBI-ALI-009', 
    nom: 'Biberon', 
    devise: 'USD',
    region: 'Butembo',
    classement: 'Repas & Alimentation',
    categorie: 'Alimentation',
    type: 'Biberon',
    description: 'Biberon en plastique sans BPA, anti-colique.', 
    dateAjout: new Date('2024-03-05T10:00:00'),
    dateModification: new Date('2024-03-10T16:00:00'),
    taille: {
      '240 ml': {
        prix: 7.99,
        couleurs: [
          { nom: 'transparent', image: 'imagesProduits/bbi-ali-009/transparent.jpeg', stock: 60 }
        ]
      },
      '350 ml': {
        prix: 10.50,
        couleurs: [
          { nom: 'bleu', image: 'imagesProduits/bbi-ali-009/bleu.jpeg', stock: 30 },
          { nom: 'rose', image: 'imagesProduits/bbi-ali-009/rose.jpeg', stock: 30 }
        ]
      }
    }
  },
  { 
    id: 10, 
    codeFournisseur: 'PHARMA-BABY',
    codeProduit: 'BBI-ALI-010', 
    nom: 'Tasse apprentissage', 
    devise: 'USD',
    region: 'Goma',
    classement: 'Repas & Alimentation',
    categorie: 'Alimentation',
    type: 'Tasse',
    description: 'Tasse avec poignées pour apprendre à boire.', 
    dateAjout: new Date('2024-03-06T11:00:00'),
    dateModification: new Date('2024-03-06T11:00:00'),
    taille: {
      '150 ml': {
        prix: 4.99,
        couleurs: [
          { nom: 'rose', image: 'imagesProduits/bbi-ali-010/rose.jpeg', stock: 40 },
          { nom: 'bleu', image: 'imagesProduits/bbi-ali-010/bleu.jpeg', stock: 40 },
          { nom: 'chocolat', image: 'imagesProduits/bbi-ali-010/chocolat.jpeg', stock: 20 }
        ]
      }
    }
  },
  { 
    id: 11, 
    codeFournisseur: 'TOY-WORLD',
    codeProduit: 'BBI-JOU-011', 
    nom: 'Jouet à empiler', 
    devise: 'USD',
    region: 'Beni',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Construction',
    description: 'Anneaux colorés en plastique résistant à empiler.', 
    dateAjout: new Date('2024-03-15T09:00:00'),
    dateModification: new Date('2024-03-15T09:00:00'),
    taille: {
      '20cm': {
        prix: 9.99,
        couleurs: [
          { nom: 'multicolore', image: 'imagesProduits/bbi-jou-011/multicolore.jpeg', stock: 18 },
          { nom: 'rose', image: 'imagesProduits/bbi-jou-011/rose.jpeg', stock: 12 }
        ]
      }
    }
  },
  {
    id: 12, 
    codeFournisseur: 'WOOD-GAME',
    codeProduit: 'BBI-JOU-012', 
    nom: 'Puzzle en bois', 
    devise: 'USD',
    region: 'Butembo',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Puzzle',
    description: 'Puzzle éducatif en bois 12 pièces pour enfant.', 
    dateAjout: new Date('2024-03-18T14:20:00'),
    dateModification: new Date('2024-03-20T10:00:00'),
    taille: {
      '20x20cm': {
        prix: 14.99,
        couleurs: [
          { nom: 'bois', image: 'imagesProduits/bbi-jou-012/bois.jpeg', stock: 10 },
          { nom: 'bleu', image: 'imagesProduits/bbi-jou-012/bleu.jpeg', stock: 15 },
          { nom: 'vert', image: 'imagesProduits/bbi-jou-012/vert.jpeg', stock: 15 }
        ]
      }
    }
  },
  { 
    id: 13, 
    codeFournisseur: 'ACC-DIST',
    codeProduit: 'BBI-ACC-013', 
    nom: 'Casquette enfant', 
    devise: 'CDF',
    region: 'Goma',
    classement: 'Vêtements & Mode',
    categorie: 'Accessoire',
    type: 'Chapeau',
    description: 'Casquette légère et colorée, protection UV.', 
    dateAjout: new Date('2024-04-01T10:00:00'),
    dateModification: new Date('2024-04-01T10:00:00'),
    taille: {
      '48 cm': {
        prix: 15000,
        couleurs: [
          { nom: 'rouge', image: 'imagesProduits/bbi-acc-013/rouge.jpeg', stock: 20 },
          { nom: 'blanc', image: 'imagesProduits/bbi-acc-013/blanc.jpeg', stock: 15 },
          { nom: 'vert', image: 'imagesProduits/bbi-acc-013/vert.jpeg', stock: 10 },
          { nom: 'noire', image: 'imagesProduits/bbi-acc-013/noire.jpeg', stock: 25 }
        ]
      }
    }
  },
  { 
    id: 14, 
    codeFournisseur: 'BBI',
    codeProduit: 'BBI-VET-014', 
    nom: 'Veste bébé', 
    devise: 'USD',
    region: 'Beni',
    classement: 'Vêtements & Mode',
    categorie: 'Vêtement',
    type: 'Veste',
    description: 'Veste chaude en polaire, avec capuche.', 
    dateAjout: new Date('2024-04-05T08:30:00'),
    dateModification: new Date('2024-04-10T15:00:00'),
    taille: {
      '9-12 mois': {
        prix: 19.99,
        couleurs: [
          { nom: 'bleu fonce', image: 'imagesProduits/bbi-vet-014/bleu-fonce.jpeg', stock: 8 },
          { nom: 'blanc', image: 'imagesProduits/bbi-vet-014/blanc.jpeg', stock: 12 },
          { nom: 'rose', image: 'imagesProduits/bbi-vet-014/rose.jpeg', stock: 10 }
        ]
      }
    }
  },
  { 
    id: 15, 
    codeFournisseur: 'WOOD-GAME',
    codeProduit: 'BBI-JOU-015', 
    nom: 'Jouet musical', 
    devise: 'USD',
    region: 'Butembo',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Musical',
    description: 'Petit xylophone en bois pour débuter la musique.', 
    dateAjout: new Date('2024-04-12T13:00:00'),
    dateModification: new Date('2024-04-12T13:00:00'),
    taille: {
      'Taille unique': {
        prix: 16.99,
        couleurs: [
          { nom: 'multicolor bois', image: 'imagesProduits/bbi-jou-015/multicolor.jpeg', stock: 14 },
          { nom: 'rose', image: 'imagesProduits/bbi-jou-015/rose.jpeg', stock: 6 }
        ]
      }
    }
  },
  { 
    id: 16, 
    codeFournisseur: 'TOY-WORLD',
    codeProduit: 'BBI-JOU-016', 
    nom: 'Doudou', 
    devise: 'USD',
    region: 'Goma',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Doudou',
    description: 'Doudou plat en forme de lapin, très doux.', 
    dateAjout: new Date('2024-04-15T10:00:00'),
    dateModification: new Date('2024-04-15T10:00:00'),
    taille: {
      '25x25cm': {
        prix: 12.99,
        couleurs: [
          { nom: 'lin', image: 'imagesProduits/bbi-jou-016/lin.jpeg', stock: 25 },
          { nom: 'rose', image: 'imagesProduits/bbi-jou-016/rose.jpeg', stock: 20 },
          { nom: 'bleu', image: 'imagesProduits/bbi-jou-016/bleu.jpeg', stock: 15 }
        ]
      }
    }
  },
  { 
    id: 17, 
    codeFournisseur: 'KID-TOYS',
    codeProduit: 'BBI-JOU-017', 
    nom: 'Balle sensorielle', 
    devise: 'USD',
    region: 'Beni',
    classement: 'Jouets & Éveil',
    categorie: 'Jouet',
    type: 'Éveil',
    description: 'Balle colorée avec différentes textures pour la préhension.', 
    dateAjout: new Date('2024-04-20T11:00:00'),
    dateModification: new Date('2024-04-22T09:30:00'),
    taille: {
      '10 cm': {
        prix: 8.99,
        couleurs: [
          { nom: 'multicolor', image: 'imagesProduits/bbi-jou-017/multicolor.jpeg', stock: 30 }
        ]
      },
      '15 cm': {
        prix: 11.50,
        couleurs: [
          { nom: 'orange', image: 'imagesProduits/bbi-jou-017/orange.jpeg', stock: 20 },
          { nom: 'bleu', image: 'imagesProduits/bbi-jou-017/bleu.jpeg', stock: 25 }
        ]
      }
    }
  },
  { 
    id: 18, 
    codeFournisseur: 'DECO-BABY',
    codeProduit: 'BBI-EQP-018', 
    nom: 'Tapis d’éveil', 
    devise: 'USD',
    region: 'Butembo',
    classement: 'Chambre & Déco',
    categorie: 'Équipement',
    type: 'Tapis',
    description: 'Tapis d\'éveil rembourré avec arches et jouets amovibles.', 
    dateAjout: new Date('2024-05-01T10:00:00'),
    dateModification: new Date('2024-05-01T10:00:00'),
    taille: {
      '80x80cm': {
        prix: 24.99,
        couleurs: [
          { nom: 'motifs jungle', image: 'imagesProduits/bbi-eqp-018/motifs-jungle.jpeg', stock: 0 },
          { nom: 'rose', image: 'imagesProduits/bbi-eqp-018/rose.jpeg', stock: 0 }
        ]
      }
    }
  }
];