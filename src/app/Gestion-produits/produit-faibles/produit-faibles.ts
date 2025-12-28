import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MyProductDataSource } from '../product-data-source';
import { ProduitsService } from '../produits-service';

@Component({
  selector: 'app-produit-faibles',
  imports: [ScrollingModule],
  templateUrl: './produit-faibles.html',
  styleUrl: './produit-faibles.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProduitFaibles {
  dataSource: MyProductDataSource;

  constructor(private productService: ProduitsService) {
    // On passe le service à la DataSource
    this.dataSource = new MyProductDataSource(this.productService);
  }
}
