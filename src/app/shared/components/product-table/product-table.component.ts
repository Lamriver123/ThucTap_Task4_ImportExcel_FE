// src/app/shared/components/product-table/product-table.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
})
export class ProductTableComponent {
  @Input() products: Product[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'discount',
    'imageProduct',
    'stock',
    'status',
  ];
}
