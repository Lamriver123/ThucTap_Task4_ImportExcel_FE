import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import * as XLSX from 'xlsx';

import { Product } from '../../../models/product.model';
import { ProductTableComponent } from '../../../shared/components/product-table/product-table.component';

@Component({
  selector: 'app-import-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    ProductTableComponent,
  ],
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css'],
})
export class ImportDialogComponent {
  productsBySheet: { sheetName: string; products: Product[] }[] = [];
  activeTabIndex = 0;

  constructor(private cdr: ChangeDetectorRef, private dialogRef: MatDialogRef<ImportDialogComponent>) {}

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      alert('Vui lòng chọn 1 file Excel');
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

        if (!data || data.length === 0) return;

        // kiểm tra header có hợp lệ không
        const requiredCols = ['id', 'name', 'description', 'price', 'discount', 'imageProduct', 'stock', 'status'];
        const firstRow = data[0] as any;
        const missingCols = requiredCols.filter((c) => !(c in firstRow));
        if (missingCols.length > 0) {
          alert(`Sheet "${sheetName}" không hợp lệ`);
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

      this.activeTabIndex = 0; // reset về tab đầu tiên
      this.cdr.detectChanges();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  onSave() {
    if (this.productsBySheet.length === 0) {
      alert('Chưa có dữ liệu để lưu');
      return;
    }
    const currentProducts = this.productsBySheet[this.activeTabIndex].products;
    this.dialogRef.close(currentProducts);
  }
}
