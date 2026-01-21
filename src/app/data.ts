import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Produit } from './Models/produit';
import { PRODUITS } from './Db/produits-data';
import { User } from './Models/agent';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {
  createDb() {

    const produits: Produit[] = PRODUITS;
    return { produits};
  }
}