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

  private estimatePrice(text: string){
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const base = 300;
    const perWord = 1.2;
    return Math.max(base, Math.round(words * perWord));
  }

  private buildMilestones(price: number){
    const first = Math.round(price * 0.4);
    const second = Math.round(price * 0.4);
    const last = price - first - second;
    return [
      { title: 'Kickoff / Approval', amount: first },
      { title: 'Development Phase', amount: second },
      { title: 'Delivery & Deployment', amount: last }
    ];
  }

  async generate(){
    const text = this.projectRef?.nativeElement.value || 'No description provided.';
    const currency = this.currencyRef?.nativeElement.value || '€';
    const price = this.estimatePrice(text);
    const milestones = this.buildMilestones(price);

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
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Primary color
    doc.text('Billable', 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);

    doc.setDrawColor(229, 231, 235);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Project Scope:', 14, 42);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const split = doc.splitTextToSize(text, 180);
    doc.text(split, 14, 48);

    let y = 48 + (split.length * 5) + 10;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Payment Schedule:', 14, y);
    y += 8;
    
    milestones.forEach((m: any) => {
      doc.setFontSize(10);
      doc.setTextColor(60);
      doc.text(`• ${m.title}`, 18, y);
      doc.text(`${m.amount} ${currency}`, 180, y, { align: 'right' });
      y += 7;
    });

    y += 5;
    doc.setDrawColor(229, 231, 235);
    doc.line(14, y, 196, y);
    y += 10;

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Total Estimate:', 14, y);
    doc.setFontSize(16);
    doc.setTextColor(79, 70, 229);
    doc.text(`${price} ${currency}`, 180, y, { align: 'right' });

    doc.save('billable-quote.pdf');
  }
}
