import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';


import * as XLSX from 'xlsx';

import { Product } from '../../../models/product.model';
import { ProductTableComponent } from '../../../shared/components/product-table/product-table.component';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-import-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ProductTableComponent,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    
  ],
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css'],
})
export class ImportDialogComponent {
  productsBySheet: { sheetName: string; products: Product[] }[] = [];
  activeTabIndex = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<ImportDialogComponent>,
    private productService: ProductService,
  ) {}

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      this.productsBySheet = [];

      wb.SheetNames.forEach((sheetName) => {
        const ws: XLSX.WorkSheet = wb.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          return;
        }

        // kiểm tra header excel
        const requiredCols = [
          'id',
          'name',
          'description',
          'price',
          'discount',
          'imageProduct',
          'stock',
          'status',
        ];
        const firstRow = data[0] as any;
        const missingCols = requiredCols.filter((c) => !(c in firstRow));
        if (missingCols.length > 0) {
          return;
        }

        const products: Product[] = data.map((row: any) => ({
          id: row['id'] || 0,
          name: row['name'] || '',
          description: row['description'] || '',
          price: row['price'] || 0,
          discount: row['discount'] || 0,
          imageProduct: row['imageProduct'] || '',
          stock: row['stock'] || 0,
          status: row['status'] || '',
        }));

        this.productsBySheet.push({ sheetName, products });
      });

      if (this.productsBySheet.length === 0) {
        alert('File không hợp lệ hoặc tất cả các sheet đều sai định dạng!');
        return;
      }

      this.activeTabIndex = 0;
      this.cdr.detectChanges();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  onSave() {
    if (this.productsBySheet.length === 0) {
      alert('Chưa có dữ liệu để lưu');
      return;
    }

    const currentSheet = this.productsBySheet[this.activeTabIndex];
    const currentProducts = currentSheet.products;

    this.productService.importProducts(currentProducts).subscribe({
      next: () => {
        alert(`Import sheet "${currentSheet.sheetName}" thành công!`);

        // Xoá sheet đã lưu khỏi danh sách
        this.productsBySheet.splice(this.activeTabIndex, 1);

        if (this.productsBySheet.length === 0) {
          this.dialogRef.close(true);
        } else {
          // Nếu vẫn còn sheet thì chuyển về tab đầu tiên
          this.activeTabIndex = 0;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        alert(`Import sheet "${currentSheet.sheetName}" thất bại!`);
      },
    });
  }
}
