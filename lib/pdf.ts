import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export async function downloadElementAsPDF(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

  // If content exceeds one page, add more pages
  const pageHeight = 297; // A4 height in mm
  if (imgHeight > pageHeight) {
    let heightLeft = imgHeight - pageHeight;
    let position = -pageHeight;
    while (heightLeft > 0) {
      pdf.addPage();
      position -= pageHeight;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
  }

  pdf.save(filename);
}
