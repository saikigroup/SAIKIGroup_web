import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export async function downloadElementAsPDF(element: HTMLElement, filename: string) {
  // Save original styles
  const origStyle = {
    width: element.style.width,
    height: element.style.height,
    minHeight: element.style.minHeight,
    overflow: element.style.overflow,
  };

  // Force exact pixel dimensions for consistent capture
  element.style.width = `${A4_WIDTH_PX}px`;
  element.style.height = `${A4_HEIGHT_PX}px`;
  element.style.minHeight = 'unset';
  element.style.overflow = 'hidden';

  try {
    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    pdf.save(filename);
  } finally {
    // Always restore original styles
    element.style.width = origStyle.width;
    element.style.height = origStyle.height;
    element.style.minHeight = origStyle.minHeight;
    element.style.overflow = origStyle.overflow;
  }
}
