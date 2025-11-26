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
      { title: 'Inicio / Aprobación', amount: first },
      { title: 'Desarrollo', amount: second },
      { title: 'Entrega / Puesta en producción', amount: last }
    ];
  }

  async generate(){
    const text = this.projectRef?.nativeElement.value || 'Descripción no proporcionada.';
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
      alert('jsPDF no está disponible. Instala `jspdf` o añade su script en index.html');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Presupuesto - Presu.ai', 14, 20);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 28);

    doc.setFontSize(12);
    doc.text('Resumen del proyecto:', 14, 40);
    doc.setFontSize(10);
    const split = doc.splitTextToSize(text, 180);
    doc.text(split, 14, 46);

    doc.setFontSize(12);
    doc.text('Precio total:', 14, 110);
    doc.setFontSize(14);
    doc.text(`${currency} ${price}`, 50, 110);

    doc.setFontSize(12);
    doc.text('Hitos de pago:', 14, 126);
    let y = 134;
    milestones.forEach((m: any) => {
      doc.setFontSize(10);
      doc.text(`• ${m.title} — ${currency} ${m.amount}`, 18, y);
      y += 8;
    });

    doc.setFontSize(12);
    doc.text('Alcance (resumen):', 14, y+6);
    doc.setFontSize(10);
    doc.text('Entregables: Diseño, Desarrollo, Pruebas, Documentación. Cambios fuera de alcance se presupuestan aparte.', 14, y+14);

    doc.save('presupuesto_presuai.pdf');
  }
}
