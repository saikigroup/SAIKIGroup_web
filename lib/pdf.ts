import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export async function downloadElementAsPDF(element: HTMLElement, filename: string) {
  // Force exact A4 height before capture
  const origMinHeight = element.style.minHeight;
  const origHeight = element.style.height;
  element.style.minHeight = 'unset';
  element.style.height = '297mm';
  element.style.overflow = 'hidden';

  const canvas = await html2canvas(element, {
    scale: 1.5, // Good quality without huge file size
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  // Restore original styles
  element.style.minHeight = origMinHeight;
  element.style.height = origHeight;
  element.style.overflow = '';

  const imgData = canvas.toDataURL('image/jpeg', 0.92); // JPEG instead of PNG = much smaller
  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297); // Exact A4 single page
  pdf.save(filename);
}
