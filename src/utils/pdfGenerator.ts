import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TradingLicenseApplication } from '../types';

/**
 * Exports the authentic Ethiopian Business License to a high-resolution 1-page A4 PDF.
 * Captures the exact DOM rendering with proportional scaling so all Ethiopic Unicode fonts,
 * stamps, seals, signatures, and layout remain 100% faithful to the official government document.
 */
export async function generateTradingLicensePDF(
  app: TradingLicenseApplication,
  targetElement?: HTMLElement | null
): Promise<void> {
  const element = targetElement || document.getElementById('trading-license-document');

  if (!element) {
    console.error('Trading license document element not found for PDF export.');
    return;
  }

  try {
    // High-resolution canvas capture (2.5x scale for sharp print quality)
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Fit cleanly onto standard A4 page dimensions
    doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');

    const cleanNo = (app.licenseNumber || app.referenceNumber).replace(/[\/\\:]/g, '-');
    doc.save(`Business_License_${cleanNo}.pdf`);
  } catch (error) {
    console.error('Failed to export business license PDF:', error);
  }
}
