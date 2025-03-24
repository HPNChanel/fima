import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

/**
 * Service for exporting data in different formats
 */
class ExportService {
  /**
   * Generate PDF from DOM element
   * 
   * @param {HTMLElement} element - DOM element to export
   * @param {Object} options - PDF options
   * @returns {jsPDF} PDF document object
   */
  async generatePDF(element, options = {}) {
    try {
      const {
        title = 'Report',
        orientation = 'portrait',
        format = 'a4',
        margin = 10,
        compress = true
      } = options;
      
      const pdf = new jsPDF(orientation, 'mm', format);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      
      if (compress) {
        pdf.compress = true;
      }
      
      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
  
  /**
   * Generate PDF with automatic pagination for long content
   * 
   * @param {HTMLElement} element - DOM element to export
   * @param {Object} options - PDF options
   * @returns {jsPDF} PDF document object
   */
  async generatePaginatedPDF(element, options = {}) {
    try {
      const {
        title = 'Report',
        orientation = 'portrait',
        format = 'a4',
        margin = 10,
        compress = true,
        headerHeight = 0,
        footerHeight = 0,
        renderHeader = null,
        renderFooter = null
      } = options;
      
      const pdf = new jsPDF(orientation, 'mm', format);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2) - headerHeight - footerHeight;
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Calculate number of pages
      const pageCount = Math.ceil(imgHeight / contentHeight);
      
      // Add image to each page
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add header if provided
        if (renderHeader) {
          renderHeader(pdf, i + 1, pageCount);
        }
        
        // Position of the image on the current page
        const srcY = contentHeight * i;
        const destY = margin + headerHeight;
        
        pdf.addImage(
          imgData,
          'PNG',
          margin,
          destY,
          imgWidth,
          imgHeight,
          `page-${i}`,
          'FAST',
          0,
          srcY,
          canvas.width,
          contentHeight * (canvas.width / imgWidth)
        );
        
        // Add footer if provided
        if (renderFooter) {
          renderFooter(pdf, i + 1, pageCount);
        }
      }
      
      if (compress) {
        pdf.compress = true;
      }
      
      return pdf;
    } catch (error) {
      console.error('Error generating paginated PDF:', error);
      throw error;
    }
  }
  
  /**
   * Export data to CSV file
   * 
   * @param {Array} data - Array of objects to export
   * @param {Array} columns - Column definitions
   * @param {string} filename - Output filename
   */
  exportToCSV(data, columns, filename = 'export.csv') {
    try {
      // Create header row
      const header = columns.map(col => `"${col.header}"`).join(',');
      
      // Create data rows
      const rows = data.map(row => {
        return columns.map(col => {
          const value = row[col.field];
          
          // Handle commas and quotes in values
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          
          return `"${value}"`;
        }).join(',');
      });
      
      // Combine header and rows
      const csv = [header, ...rows].join('\n');
      
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }
  
  /**
   * Export data to Excel file
   * 
   * @param {Array} data - Array of objects to export
   * @param {Array} columns - Column definitions
   * @param {string} filename - Output filename
   * @param {string} sheetName - Excel sheet name
   */
  exportToExcel(data, columns, filename = 'export.xlsx', sheetName = 'Sheet1') {
    try {
      // Transform data for Excel
      const excelData = data.map(row => {
        const excelRow = {};
        
        columns.forEach(col => {
          // Use header as property name
          excelRow[col.header] = row[col.field];
        });
        
        return excelRow;
      });
      
      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      
      // Generate Excel file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }
  
  /**
   * Print DOM element
   * 
   * @param {HTMLElement} element - DOM element to print
   * @param {Object} options - Print options
   */
  printElement(element, options = {}) {
    try {
      const {
        title = 'Print',
        hidePageElements = []
      } = options;
      
      // Store original display values
      const originalDisplayValues = hidePageElements.map(el => ({
        element: el,
        display: el.style.display
      }));
      
      // Hide elements that shouldn't be printed
      hidePageElements.forEach(el => {
        el.style.display = 'none';
      });
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>' + title + '</title>');
      
      // Add styles
      const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
      styles.forEach(style => {
        printWindow.document.write(style.outerHTML);
      });
      
      printWindow.document.write('</head><body>');
      printWindow.document.write(element.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      // Wait for resources to load
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
      
      // Restore original display values
      originalDisplayValues.forEach(item => {
        item.element.style.display = item.display;
      });
    } catch (error) {
      console.error('Error printing element:', error);
      throw error;
    }
  }
}

export default new ExportService();
