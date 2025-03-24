import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  CircularProgress
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  InsertDriveFile as ExcelIcon,
  Print as PrintIcon,
  ArrowDropDown as ArrowIcon
} from '@mui/icons-material';
import ExportPdfDialog from './ExportPdfDialog';

/**
 * Export Reports Toolbar Component
 * 
 * This component provides a unified interface for exporting reports in different formats.
 * 
 * @param {Object} props
 * @param {Function} props.onExportPdf - Function to handle PDF export
 * @param {Function} props.onExportCsv - Function to handle CSV export
 * @param {Function} props.onExportExcel - Function to handle Excel export
 * @param {Function} props.onPrint - Function to handle print
 * @param {Object} props.defaultValues - Default values for export dialog
 * @param {Array} props.categories - Categories for filtering
 * @param {Object} props.filters - Current filters applied
 * @param {Object} props.report - The report to be exported (optional)
 */
const ExportReportsToolbar = ({ 
  onExportPdf,
  onExportCsv,
  onExportExcel,
  onPrint,
  defaultValues = {},
  categories = [],
  filters = {},
  report = null
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [currentExportType, setCurrentExportType] = useState(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleExportSelect = (type) => {
    handleClose();
    
    switch (type) {
      case 'pdf':
        setPdfDialogOpen(true);
        break;
      case 'csv':
        handleExportCsv();
        break;
      case 'excel':
        handleExportExcel();
        break;
      case 'print':
        handlePrint();
        break;
      default:
        break;
    }
  };
  
  const handlePdfDialogClose = () => {
    setPdfDialogOpen(false);
  };
  
  const handlePdfExport = async (exportOptions) => {
    setExportLoading(true);
    setCurrentExportType('pdf');
    
    try {
      await onExportPdf(exportOptions);
    } catch (error) {
      console.error('PDF export error:', error);
    } finally {
      setExportLoading(false);
      setPdfDialogOpen(false);
    }
  };
  
  const handleExportCsv = async () => {
    setExportLoading(true);
    setCurrentExportType('csv');
    
    try {
      await onExportCsv();
    } catch (error) {
      console.error('CSV export error:', error);
    } finally {
      setExportLoading(false);
    }
  };
  
  const handleExportExcel = async () => {
    setExportLoading(true);
    setCurrentExportType('excel');
    
    try {
      await onExportExcel();
    } catch (error) {
      console.error('Excel export error:', error);
    } finally {
      setExportLoading(false);
    }
  };
  
  const handlePrint = async () => {
    setExportLoading(true);
    setCurrentExportType('print');
    
    try {
      await onPrint();
    } catch (error) {
      console.error('Print error:', error);
    } finally {
      setExportLoading(false);
    }
  };
  
  // Create loading state for the export button
  const getExportLoadingState = () => {
    if (!exportLoading) return false;
    
    return (
      <CircularProgress 
        size={24} 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-12px',
          marginLeft: '-12px',
        }} 
      />
    );
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ButtonGroup variant="outlined">
          <Button
            onClick={() => handleExportSelect('pdf')}
            startIcon={<PdfIcon />}
            disabled={exportLoading}
          >
            Export PDF
          </Button>
          <Button
            size="small"
            onClick={handleClick}
            aria-label="select export format"
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            sx={{ borderLeft: 1, borderColor: 'divider' }}
          >
            <ArrowIcon />
          </Button>
        </ButtonGroup>
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleExportSelect('pdf')}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExportSelect('csv')}>
          <ListItemIcon>
            <CsvIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExportSelect('excel')}>
          <ListItemIcon>
            <ExcelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExportSelect('print')}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print Report</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* PDF Export Dialog */}
      <ExportPdfDialog
        open={pdfDialogOpen}
        onClose={handlePdfDialogClose}
        onExport={handlePdfExport}
        defaultValues={{
          title: report ? report.title : defaultValues.title || 'Financial Report',
          subtitle: report ? 
            `${report.type} Report` : 
            defaultValues.subtitle || 'Financial Summary'
        }}
        categories={categories}
        filters={{
          startDate: report ? report.fromDate : filters.startDate,
          endDate: report ? report.toDate : filters.endDate
        }}
      />
      
      {/* Loading Overlay */}
      <Dialog
        open={exportLoading}
        aria-labelledby="export-loading-dialog"
        PaperProps={{
          sx: { backgroundColor: 'transparent', boxShadow: 'none' }
        }}
      >
        <CircularProgress />
      </Dialog>
    </>
  );
};

export default ExportReportsToolbar;
