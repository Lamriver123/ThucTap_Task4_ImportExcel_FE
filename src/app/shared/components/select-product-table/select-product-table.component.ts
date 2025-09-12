import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-select-product-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule],
  templateUrl: './select-product-table.component.html',
  styleUrls: ['./select-product-table.component.css'],
})
export class SelectProductTableComponent {
  @Input() products: Product[] = [];
  @Output() selectedChange = new EventEmitter<Product[]>(); // emit list sản phẩm đã chọn

  selectedProducts: Product[] = [];

  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'price',
    'discount',
    'imageProduct',
    'stock',
    'status',
  ];


  toggleSelection(product: Product, checked: boolean) {
    if (checked) {
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts = this.selectedProducts.filter(p => p.id !== product.id);
    }
    this.selectedChange.emit(this.selectedProducts);
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

  toggleSelectAll(checked: boolean) {
    if (checked) {
      this.selectedProducts = [...this.products];
    } else {
      this.selectedProducts = [];
    }
    this.selectedChange.emit(this.selectedProducts);
  }

  isAllSelected(): boolean {
    return this.products.length > 0 && this.selectedProducts.length === this.products.length;
  }
}
