import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

/**
 * Service for generating PDF reports
 */
class PDFService {
  /**
   * Generate a PDF from a DOM element
   * 
   * @param {HTMLElement} element DOM element to capture
   * @param {Object} options PDF generation options
   * @returns {jsPDF} PDF document
   */
  async generatePDF(element, options = {}) {
    try {
      const {
        title = 'Financial Report',
        orientation = 'portrait',
        format = 'a4',
        margin = 10,
        companyInfo = null,
        dateRange = '',
        footerText = ''
      } = options;
      
      console.log('Generating PDF with options:', options);
      
      // Create PDF with specified orientation and format
      const pdf = new jsPDF(orientation, 'mm', format);
      
      // Calculate page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Get content element scale values
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Calculate dimensions for the image in the PDF
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Handle multi-page PDFs
      let heightLeft = imgHeight;
      let position = margin;
      
      // Add the canvas to the PDF (first page)
      pdf.addImage(
        canvas.toDataURL('image/png', 1.0),
        'PNG',
        margin,
        position,
        imgWidth,
        imgHeight,
        null,
        'FAST'
      );
      heightLeft -= (pageHeight - margin * 2);
      
      // Add additional pages if content is too long
      while (heightLeft > 0) {
        position = margin - (pageHeight - margin * 2);
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png', 1.0),
          'PNG',
          margin,
          position,
          imgWidth,
          imgHeight,
          null,
          'FAST'
        );
        
        heightLeft -= (pageHeight - margin * 2);
        
        // Add page number
        const currentPage = pdf.internal.getNumberOfPages();
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Page ${currentPage}`,
          pageWidth - 20,
          pageHeight - 10
        );
      }
      
      // Add metadata to the PDF
      pdf.setProperties({
        title: title,
        subject: `Financial Report - ${dateRange}`,
        author: 'Financial Management App',
        keywords: 'finance, report, transactions',
        creator: 'Financial Management App',
        producer: 'Financial Management App',
        creationDate: new Date()
      });
      
      // Set PDF to compress the content
      pdf.compress = true;
      
      return pdf;
    } catch (error) {
      console.error('Error in PDF generation:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }
  
  /**
   * Generate a multi-page PDF with header and footer
   * 
   * @param {HTMLElement[]} elements Array of DOM elements to capture, one per page
   * @param {Object} options PDF generation options
   * @returns {jsPDF} PDF document
   */
  async generateMultiPagePDF(elements, options = {}) {
    try {
      const {
        title = 'Financial Report',
        orientation = 'portrait',
        format = 'a4',
        margin = 10,
        headerHeight = 30,
        footerHeight = 20,
        companyInfo = null,
        dateRange = '',
        footerText = ''
      } = options;
      
      // Create PDF with specified orientation and format
      const pdf = new jsPDF(orientation, 'mm', format);
      
      // Calculate page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Process each element as a separate page
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        
        if (i > 0) {
          pdf.addPage();
        }
        
        // Render header
        if (options.renderHeader) {
          options.renderHeader(pdf, i + 1, elements.length);
        } else {
          this._renderDefaultHeader(pdf, {
            title,
            dateRange,
            pageNumber: i + 1,
            totalPages: elements.length,
            companyInfo
          });
        }
        
        // Get content element as canvas
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        // Calculate dimensions for the image in the PDF
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2) - headerHeight - footerHeight;
        const imgWidth = contentWidth;
        const imgHeight = Math.min((canvas.height * imgWidth) / canvas.width, contentHeight);
        
        // Add the canvas to the PDF
        pdf.addImage(
          canvas.toDataURL('image/png', 1.0),
          'PNG',
          margin,
          margin + headerHeight,
          imgWidth,
          imgHeight,
          null,
          'FAST'
        );
        
        // Render footer
        if (options.renderFooter) {
          options.renderFooter(pdf, i + 1, elements.length);
        } else {
          this._renderDefaultFooter(pdf, {
            pageNumber: i + 1,
            totalPages: elements.length,
            footerText: footerText || `Generated on ${format(new Date(), 'MM/dd/yyyy, h:mm a')}`
          });
        }
      }
      
      // Add metadata to the PDF
      pdf.setProperties({
        title: title,
        subject: `Financial Report - ${dateRange}`,
        author: 'Financial Management App',
        keywords: 'finance, report, transactions',
        creator: 'Financial Management App',
        producer: 'Financial Management App',
        creationDate: new Date()
      });
      
      // Set PDF to compress the content
      pdf.compress = true;
      
      return pdf;
    } catch (error) {
      console.error('Error in multi-page PDF generation:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }
  
  /**
   * Render a default header for the PDF
   * 
   * @param {jsPDF} pdf PDF document
   * @param {Object} options Header options
   * @private
   */
  _renderDefaultHeader(pdf, options) {
    const {
      title,
      dateRange,
      pageNumber,
      totalPages,
      companyInfo
    } = options;
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(title, 10, 15);
    
    // Date range
    if (dateRange) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Period: ${dateRange}`, 10, 22);
    }
    
    // Company info
    if (companyInfo && companyInfo.name) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(companyInfo.name, pageWidth - 10, 15, { align: 'right' });
    }
    
    // Page number
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 10, 22, { align: 'right' });
    
    // Divider line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(10, 25, pageWidth - 10, 25);
  }
  
  /**
   * Render a default footer for the PDF
   * 
   * @param {jsPDF} pdf PDF document
   * @param {Object} options Footer options
   * @private
   */
  _renderDefaultFooter(pdf, options) {
    const {
      pageNumber,
      totalPages,
      footerText
    } = options;
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Divider line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
    
    // Footer text
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(footerText, 10, pageHeight - 10);
    
    // Page number
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Page ${pageNumber} of ${totalPages}`,
      pageWidth - 10,
      pageHeight - 10,
      { align: 'right' }
    );
  }
}

export default new PDFService();
