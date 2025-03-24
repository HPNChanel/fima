import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
  Slide,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  alpha,
  Card,
  CardContent
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  SentimentSatisfiedAlt as HappyIcon,
  SentimentNeutral as NeutralIcon,
  SentimentVeryDissatisfied as SadIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  DeleteOutline as DeleteIcon,
  MoreHoriz as MoreIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isToday, parseISO } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';
import TransactionService from '../services/transaction.service';
import JournalService from '../services/journal.service';

const JournalEntryForm = () => {
  const [noteDate, setNoteDate] = useState(new Date());
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(null);
  const [existingNote, setExistingNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // Check for selected date from URL params or state
  useEffect(() => {
    if (location.state) {
      if (location.state.selectedDate) {
        setNoteDate(new Date(location.state.selectedDate));
      }
    }
    
    // Clear the location state to prevent re-triggering this effect
    navigate(location.pathname, { replace: true, state: {} });
  }, [location, navigate]);

  // Load note and transactions for the selected date
  useEffect(() => {
    loadNoteData();
  }, [noteDate]);

  // Update word count
  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [content]);

  const loadNoteData = async () => {
    try {
      setLoading(true);
      setError('');

      // Format date as ISO string (YYYY-MM-DD)
      const formattedDate = format(noteDate, 'yyyy-MM-dd');
      
      // Fetch note data - replace DailyNoteService with JournalService
      try {
        const noteResponse = await JournalService.getJournalEntryByDate(formattedDate);
        
        if (noteResponse.data && noteResponse.data.id) {
          setExistingNote(noteResponse.data);
          setContent(noteResponse.data.content);
          setMood(noteResponse.data.mood);
        } else {
          setExistingNote(null);
          setContent('');
          setMood(null);
        }
      } catch (error) {
        // If there's no entry for this date, handle the 404
        setExistingNote(null);
        setContent('');
        setMood(null);
      }
      
      // Fetch transactions for the selected date
      const transactionResponse = await TransactionService.getTransactionsByDate(formattedDate);
      setTransactions(transactionResponse.data || []);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading note data:', err);
      setLoading(false);
      setError('Failed to load note. Please try again.');
    }
  };

  const handleMoodChange = (event, newMood) => {
    setMood(newMood);
  };

  const handleDateChange = (newDate) => {
    setNoteDate(newDate);
  };

  const handleSaveNote = async () => {
    if (!content.trim()) {
      setError('Please enter some content for your note');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      const noteData = {
        title: 'Journal Entry ' + format(noteDate, 'yyyy-MM-dd'), // Add a title field
        content: content.trim(),
        mood: mood,
        entryDate: format(noteDate, 'yyyy-MM-dd'),
        tags: '' // Add empty tags field
      };
      
      if (existingNote && existingNote.id) {
        await JournalService.updateJournalEntry(existingNote.id, noteData);
      } else {
        await JournalService.createJournalEntry(noteData);
      }
      
      setSuccess('Note saved successfully!');
      
      // Go back after successful save
      setTimeout(() => {
        if (location.state && location.state.fromHistory) {
          navigate('/journal-history');
        } else {
          navigate('/diary');
        }
      }, 1500);
      
      setSaving(false);
    } catch (err) {
      console.error('Error saving note:', err);
      setSaving(false);
      setError('Failed to save note. Please try again.');
    }
  };

  const handleDeleteNote = async () => {
    if (!existingNote || !existingNote.id) return;

    try {
      setSaving(true);
      await JournalService.deleteJournalEntry(existingNote.id);
      setDeleteConfirmOpen(false);
      setSuccess('Note deleted successfully!');
      
      // Go back after successful delete
      setTimeout(() => {
        if (location.state && location.state.fromHistory) {
          navigate('/journal-history');
        } else {
          navigate('/diary');
        }
      }, 1500);
      
      setSaving(false);
    } catch (err) {
      console.error('Error deleting note:', err);
      setSaving(false);
      setDeleteConfirmOpen(false);
      setError('Failed to delete note. Please try again.');
    }
  };

  const renderMoodIcon = (selectedMood, size = 'medium') => {
    switch (selectedMood) {
      case 'HAPPY':
        return <HappyIcon fontSize={size} sx={{ color: 'success.main' }} />;
      case 'NEUTRAL':
        return <NeutralIcon fontSize={size} sx={{ color: 'info.main' }} />;
      case 'SAD':
        return <SadIcon fontSize={size} sx={{ color: 'error.main' }} />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'medium' }}>
          {existingNote ? 'Edit Journal Entry' : 'New Journal Entry'}
        </Typography>
        <Box sx={{ width: { xs: 40, sm: 80 } }} /> {/* Spacer for balance */}
      </Box>

      {(error || success) && (
        <Slide direction="down" in={!!(error || success)} mountOnEnter unmountOnExit>
          <Box sx={{ mb: 3 }}>
            {error && (
              <Alert 
                severity="error" 
                onClose={() => setError('')}
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert 
                severity="success" 
                onClose={() => setSuccess('')}
              >
                {success}
              </Alert>
            )}
          </Box>
        </Slide>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Main content area */}
          <Box sx={{ flex: 3 }}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                mb: 3,
                backgroundColor: theme.palette.background.default
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <DatePicker
                      label="Entry Date"
                      value={noteDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                      maxDate={new Date()}
                    />
                    {isToday(noteDate) && (
                      <Chip
                        size="small"
                        label="Today"
                        color="primary"
                        icon={<TodayIcon />}
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </LocalizationProvider>
                
                {existingNote && (
                  <Tooltip title="Delete this entry">
                    <IconButton 
                      color="error" 
                      onClick={() => setDeleteConfirmOpen(true)}
                      disabled={saving}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                Reflect on your financial decisions, habits, goals, or emotions for this day.
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={12}
                placeholder="Today, I..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                variant="outlined"
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    '&:hover': {
                      backgroundColor: theme.palette.background.paper,
                    },
                    '&.Mui-focused': {
                      backgroundColor: theme.palette.background.paper,
                    }
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  How do you feel about your finances today?
                </Typography>
                <Chip 
                  size="small" 
                  label={`${wordCount} words`} 
                  color={wordCount > 0 ? 'primary' : 'default'} 
                  variant="outlined" 
                />
              </Box>
              
              <ToggleButtonGroup
                value={mood}
                exclusive
                onChange={handleMoodChange}
                aria-label="mood selection"
                fullWidth
                sx={{ mb: 3 }}
              >
                <ToggleButton 
                  value="HAPPY" 
                  aria-label="happy"
                  sx={{ 
                    py: 1.5,
                    borderColor: 'success.light',
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      borderColor: 'success.main',
                      color: 'success.main'
                    }
                  }}
                >
                  <HappyIcon sx={{ color: 'success.main', mr: 1 }} />
                  Optimistic
                </ToggleButton>
                <ToggleButton 
                  value="NEUTRAL" 
                  aria-label="neutral"
                  sx={{ 
                    py: 1.5,
                    borderColor: 'info.light',
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      borderColor: 'info.main',
                      color: 'info.main'
                    }
                  }}
                >
                  <NeutralIcon sx={{ color: 'info.main', mr: 1 }} />
                  Neutral
                </ToggleButton>
                <ToggleButton 
                  value="SAD" 
                  aria-label="sad"
                  sx={{ 
                    py: 1.5,
                    borderColor: 'error.light',
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      borderColor: 'error.main',
                      color: 'error.main'
                    }
                  }}
                >
                  <SadIcon sx={{ color: 'error.main', mr: 1 }} />
                  Concerned
                </ToggleButton>
              </ToggleButtonGroup>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveNote}
                  disabled={saving || !content.trim()}
                  sx={{ 
                    px: 4, 
                    py: 1,
                    borderRadius: 5,
                    minWidth: 150
                  }}
                >
                  {saving ? <CircularProgress size={24} /> : 'Save Entry'}
                </Button>
              </Box>
            </Paper>
          </Box>
          
          {/* Sidebar with date's transactions */}
          <Box sx={{ flex: 1 }}>
            <Card 
              elevation={3} 
              sx={{ 
                p: 0, 
                borderRadius: 2,
                height: 'fit-content',
                bgcolor: alpha(theme.palette.primary.main, 0.03)
              }}
            >
              <Box sx={{ 
                p: 2, 
                backgroundColor: alpha(theme.palette.primary.main, 0.1), 
                display: 'flex', 
                alignItems: 'center' 
              }}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Transactions on this day
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 2 }}>
                {transactions.length === 0 ? (
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No transactions recorded for this day.
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                      </Typography>
                      <Chip 
                        label={formatCurrency(transactions.reduce((sum, t) => 
                          sum + (t.type === 'INCOME' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0))} 
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    {transactions.map((transaction) => (
                      <Box 
                        key={transaction.id}
                        sx={{ 
                          py: 1.5,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {transaction.description}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color={transaction.type === 'INCOME' ? 'success.main' : 'error.main'}
                          >
                            {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip
                            label={transaction.category}
                            size="small"
                            color={transaction.type === 'INCOME' ? 'success' : 'error'}
                            variant="outlined"
                            sx={{ height: 20 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {format(parseISO(transaction.date), 'h:mm a')}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ minWidth: { xs: '280px', sm: '400px' }, pt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Delete this journal entry?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. The entry will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)} 
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteNote} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
            disabled={saving}
            autoFocus
          >
            {saving ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JournalEntryForm;
