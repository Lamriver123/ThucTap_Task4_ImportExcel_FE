import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product.model';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { ProductTableComponent } from '../../../shared/components/product-table/product-table.component';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ProductTableComponent, // Import trực tiếp
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private dialog: MatDialog, private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log("🏠 HomeComponent initialized");
    this.loadProducts(); 
  }

  loadProducts() {
  this.productService.getProducts().subscribe((data) => {
    this.products = data;
    this.cdr.markForCheck();
  });
}

  
  openImportDialog() {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '90vw',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
        this.loadProducts();
    });
  }


  exportExcel() {
    
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '90vw',
      disableClose: true,
      data: { products: this.products },
    });

    dialogRef.afterClosed().subscribe((selected: Product[] | undefined) => {
      if (selected && selected.length) {
        console.log('Export selected products:', selected);
      }
    });
  }
  exportAllExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    // Tạo blob Excel
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Tạo link tải
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_all.xlsx'; // tên mặc định (người dùng có thể đổi trong Save As)
    a.click();

    // Dọn dẹp URL blob
    window.URL.revokeObjectURL(url);
  }
}
