import { Component, ElementRef, ViewChild } from '@angular/core';

/*
  Nota: Este componente intenta importar `jspdf` dinámicamente.
  - Para producción instala `jspdf` con `npm install jspdf` o
    incluye el bundle en `index.html` con un <script> que exponga `window.jspdf`.
*/

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  @ViewChild('project', { static: false }) projectRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('currency', { static: false }) currencyRef!: ElementRef<HTMLSelectElement>;

  // Form Fields
  clientName = '';
  clientEmail = '';
  projectName = '';
  projectScope = '';
  projectTasks = '';
  projectInventory = '';
  basePrice: number | null = null;
  includeVat = false;
  signature = '';
  logoDataUrl: string | null = null;

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoDataUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private estimatePrice(text: string){
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const base = 300;
    const perWord = 1.2;
    return Math.max(base, Math.round(words * perWord));
  }

  async generate(){
    // Gather Data
    const currency = this.currencyRef?.nativeElement.value || '€';
    const desc = this.projectRef?.nativeElement.value || '';
    
    // Use input price or estimate if empty
    let finalPrice = this.basePrice;
    if (finalPrice === null || finalPrice === undefined) {
      finalPrice = this.estimatePrice(desc);
    }

    let jsPDFModule: any = null;
    try{
      jsPDFModule = await import('jspdf');
    }catch(e){
      // fallback: try window.jspdf (if script included globally)
      // @ts-ignore
      jsPDFModule = (window as any).jspdf || (window as any).jsPDF;
    }

    const jsPDF = jsPDFModule && (jsPDFModule.jsPDF || jsPDFModule);
    if(!jsPDF){
      alert('jsPDF is not available. Please install `jspdf` or add the script to index.html');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let y = 20;

    // --- Header ---
    // Logo
    if (this.logoDataUrl) {
      try {
        doc.addImage(this.logoDataUrl, 'PNG', margin, y, 30, 30);
        // If logo exists, move text to the right or below. Let's move title to right.
      } catch (err) {
        console.error('Error adding logo', err);
      }
    }

    // Company / Title
    doc.setFontSize(24);
    doc.setTextColor(79, 70, 229); // Primary
    doc.text('Billable', this.logoDataUrl ? 60 : margin, y + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Professional Quote', this.logoDataUrl ? 60 : margin, y + 18);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, y + 10);
    doc.text(`Ref: EST-${Math.floor(Math.random() * 10000)}`, pageWidth - margin - 40, y + 16);

    y += 40;

    // --- Separator ---
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // --- Client & Project Info ---
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Client Details:', margin, y);
    doc.text('Project Details:', pageWidth / 2 + 10, y);
    y += 6;

    doc.setFontSize(10);
    doc.setTextColor(60);
    
    // Client Col
    doc.text(`Name: ${this.clientName || 'N/A'}`, margin, y);
    doc.text(`Email: ${this.clientEmail || 'N/A'}`, margin, y + 6);
    
    // Project Col
    doc.text(`Project: ${this.projectName || 'Untitled Project'}`, pageWidth / 2 + 10, y);
    y += 15;

    // --- Scope & Description ---
    if (this.projectScope || desc) {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Scope of Work:', margin, y);
      y += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(60);
      const scopeText = this.projectScope || desc || 'No description provided.';
      const splitScope = doc.splitTextToSize(scopeText, pageWidth - (margin * 2));
      doc.text(splitScope, margin, y);
      y += (splitScope.length * 5) + 10;
    }

    // --- Tasks / Work ---
    if (this.projectTasks) {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Tasks / Work to be done:', margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(60);
      const splitTasks = doc.splitTextToSize(this.projectTasks, pageWidth - (margin * 2));
      doc.text(splitTasks, margin, y);
      y += (splitTasks.length * 5) + 10;
    }

    // --- Inventory ---
    if (this.projectInventory) {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Inventory / Resources:', margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(60);
      const splitInv = doc.splitTextToSize(this.projectInventory, pageWidth - (margin * 2));
      doc.text(splitInv, margin, y);
      y += (splitInv.length * 5) + 10;
    }

    // --- Financials ---
    y += 5;
    doc.setDrawColor(229, 231, 235); // Light gray
    doc.setFillColor(249, 250, 251); // Very light gray
    doc.rect(margin, y, pageWidth - (margin * 2), 40, 'F');
    doc.rect(margin, y, pageWidth - (margin * 2), 40, 'S');

    let fy = y + 10;
    doc.setFontSize(11);
    doc.setTextColor(0);
    
    // Subtotal
    doc.text('Subtotal:', margin + 10, fy);
    doc.text(`${finalPrice} ${currency}`, pageWidth - margin - 10, fy, { align: 'right' });
    fy += 8;

    // VAT
    let vatAmount = 0;
    if (this.includeVat) {
      vatAmount = Math.round(finalPrice * 0.21);
      doc.text('VAT (21%):', margin + 10, fy);
      doc.text(`${vatAmount} ${currency}`, pageWidth - margin - 10, fy, { align: 'right' });
      fy += 8;
    }

    // Total
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', margin + 10, fy + 2);
    doc.text(`${finalPrice + vatAmount} ${currency}`, pageWidth - margin - 10, fy + 2, { align: 'right' });
    doc.setFont(undefined, 'normal');

    y += 50;

    // --- Footer / Signature ---
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    if (this.signature) {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Authorized Signature:', margin, y);
      y += 15;
      doc.setFont(undefined, 'italic');
      doc.text(this.signature, margin, y);
      doc.line(margin, y + 2, margin + 60, y + 2);
      doc.setFont(undefined, 'normal');
    }

    // Save
    doc.save('billable-quote.pdf');
  }
}
