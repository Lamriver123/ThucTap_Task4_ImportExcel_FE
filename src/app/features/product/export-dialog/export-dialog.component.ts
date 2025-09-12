import { Component, Inject, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';

import { Product } from '../../../models/product.model';
import { SelectProductTableComponent } from '../../../shared/components/select-product-table/select-product-table.component';
import { ProductTableComponent } from '../../../shared/components/product-table/product-table.component';

@Component({
  selector: 'app-export-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    SelectProductTableComponent,
    ProductTableComponent
  ],
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css'],
})
export class ExportDialogComponent {
  products: Product[] = [];
  selectedProducts: Product[] = [];

  constructor(
    private dialogRef: MatDialogRef<ExportDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { products: Product[] }
  ) {
    this.products = data.products; 
  }

  onSelectedProductsChange(selected: Product[]) {
    setTimeout(() => {
      this.selectedProducts = [...selected];
      this.cdr.detectChanges();
    });
  }

  confirmExport() {
    if (!this.selectedProducts.length) return;

    const worksheet = XLSX.utils.json_to_sheet(this.selectedProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    XLSX.writeFile(workbook, 'selected-products.xlsx'); // tải file
    this.dialogRef.close(this.selectedProducts); // trả về list chọn
  }

  cancel() {
    this.dialogRef.close();
  }
}
