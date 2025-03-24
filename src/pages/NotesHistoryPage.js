import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Tag as TagIcon,
  Mood as MoodIcon,
  SentimentSatisfied as HappyIcon,
  SentimentDissatisfied as SadIcon,
  SentimentVeryDissatisfied as AngryIcon,
  SentimentNeutral as NeutralIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import JournalService from '../services/journal.service';
import JournalEntryForm from '../components/JournalEntryForm';

const NotesHistoryPage = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEntryForm, setOpenEntryForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const entriesPerPage = 5;
  
  useEffect(() => {
    fetchJournalEntries();
    fetchStats();
  }, [page, searchTerm, selectedTag, selectedMood, startDate, endDate]);
  
  const fetchJournalEntries = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedTag) params.tag = selectedTag;
      if (selectedMood) params.mood = selectedMood;
      if (startDate && endDate) {
        params.startDate = format(startDate, 'yyyy-MM-dd');
        params.endDate = format(endDate, 'yyyy-MM-dd');
      }
      
      const response = await JournalService.getAllJournalEntries(params);
      const entries = response.data;
      
      // Implement client-side pagination
      setTotalPages(Math.ceil(entries.length / entriesPerPage));
      const startIndex = (page - 1) * entriesPerPage;
      const paginatedEntries = entries.slice(startIndex, startIndex + entriesPerPage);
      
      setJournalEntries(paginatedEntries);
      setError(null);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError('Failed to load your journal entries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStats = async () => {
    try {
      const response = await JournalService.getJournalStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching journal stats:', err);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchJournalEntries();
  };
  
  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setPage(1);
  };
  
  const handleMoodChange = (event) => {
    setSelectedMood(event.target.value);
    setPage(1);
  };
  
  const handleDateRangeChange = () => {
    if (startDate && endDate) {
      setPage(1);
      fetchJournalEntries();
    }
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setSelectedMood('');
    setStartDate(null);
    setEndDate(null);
    setPage(1);
    fetchJournalEntries();
  };
  
  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setOpenEntryForm(true);
  };
  
  const handleDeleteEntry = (entry) => {
    setSelectedEntry(entry);
    setOpenDeleteDialog(true);
  };
  
  const confirmDeleteEntry = async () => {
    try {
      await JournalService.deleteJournalEntry(selectedEntry.id);
      setOpenDeleteDialog(false);
      fetchJournalEntries();
      fetchStats();
    } catch (err) {
      console.error('Error deleting journal entry:', err);
    }
  };
  
  const handleEntryFormClose = (refreshData = false) => {
    setOpenEntryForm(false);
    setSelectedEntry(null);
    if (refreshData) {
      fetchJournalEntries();
      fetchStats();
    }
  };
  
  const getMoodIcon = (mood) => {
    switch(mood?.toLowerCase()) {
      case 'happy':
        return <HappyIcon color="success" />;
      case 'sad':
        return <SadIcon color="info" />;
      case 'angry':
        return <AngryIcon color="error" />;
      default:
        return <NeutralIcon color="action" />;
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Journal History
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenEntryForm(true)}
          >
            New Entry
          </Button>
        </Box>
        
        {/* Stats Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Entries
                  </Typography>
                  <Typography variant="h4">{stats.total}</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Current Streak
                  </Typography>
                  <Typography variant="h4">{stats.currentStreak} days</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Latest Entry
                  </Typography>
                  <Typography variant="h6">
                    {stats.lastEntryDate ? format(new Date(stats.lastEntryDate), 'MMM d, yyyy') : 'None'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Most Common Mood
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {Object.entries(stats.moods || {}).length > 0 ? (
                      <>
                        {getMoodIcon(Object.entries(stats.moods).sort((a, b) => b[1] - a[1])[0][0])}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {Object.entries(stats.moods).sort((a, b) => b[1] - a[1])[0][0]}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h6">None</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <form onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" edge="end">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </form>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="mood-filter-label">Filter by Mood</InputLabel>
                <Select
                  labelId="mood-filter-label"
                  value={selectedMood}
                  onChange={handleMoodChange}
                  label="Filter by Mood"
                >
                  <MenuItem value="">All Moods</MenuItem>
                  <MenuItem value="Happy">Happy</MenuItem>
                  <MenuItem value="Sad">Sad</MenuItem>
                  <MenuItem value="Angry">Angry</MenuItem>
                  <MenuItem value="Neutral">Neutral</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    renderInput={(params) => (
                      <TextField {...params} size="small" sx={{ width: '100%' }} />
                    )}
                  />
                  
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(date) => {
                      setEndDate(date);
                      if (startDate && date) {
                        handleDateRangeChange();
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} size="small" sx={{ width: '100%' }} />
                    )}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Grid>
            
            {(selectedTag || selectedMood) && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Active Filters:</Typography>
                  {selectedTag && (
                    <Chip 
                      label={selectedTag} 
                      onDelete={() => setSelectedTag('')}
                      size="small"
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                  )}
                  {selectedMood && (
                    <Chip 
                      icon={getMoodIcon(selectedMood)}
                      label={selectedMood} 
                      onDelete={() => setSelectedMood('')}
                      size="small"
                      color="secondary"
                    />
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
        
        {/* Journal Entries List */}
        <Paper sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : journalEntries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No journal entries found.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setOpenEntryForm(true)}
                sx={{ mt: 2 }}
              >
                Create Your First Entry
              </Button>
            </Box>
          ) : (
            <>
              <List>
                {journalEntries.map((entry, index) => (
                  <React.Fragment key={entry.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        flexDirection: 'column',
                        py: 2
                      }}
                    >
                      <Box sx={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 1
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon fontSize="small" color="primary" />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {format(new Date(entry.entryDate), 'MMMM d, yyyy')}
                          </Typography>
                          
                          {entry.mood && (
                            <Chip 
                              icon={getMoodIcon(entry.mood)}
                              label={entry.mood}
                              size="small"
                              color="secondary"
                            />
                          )}
                        </Box>
                        
                        <Box>
                          <IconButton size="small" onClick={() => handleEditEntry(entry)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteEntry(entry)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        {entry.title}
                      </Typography>
                      
                      {entry.tags && entry.tags.length > 0 && (
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                          flexWrap: 'wrap'
                        }}>
                          {entry.tags.map(tag => (
                            <Chip 
                              key={tag}
                              icon={<TagIcon />}
                              label={tag}
                              size="small"
                              onClick={() => handleTagClick(tag)}
                              sx={{ mr: 1, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}
                      
                      <Typography variant="body1" sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3
                      }}>
                        {entry.content}
                      </Typography>
                    </ListItem>
                    {index < journalEntries.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              {/* Pagination */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mt: 3 
              }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Paper>
      </Box>
      
      {/* Journal Entry Form Dialog */}
      <Dialog 
        open={openEntryForm} 
        onClose={() => handleEntryFormClose(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedEntry ? 'Edit Journal Entry' : 'Create New Journal Entry'}
        </DialogTitle>
        <DialogContent>
          <JournalEntryForm 
            entry={selectedEntry}
            onSuccess={() => handleEntryFormClose(true)}
            onCancel={() => handleEntryFormClose(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this journal entry? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteEntry} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NotesHistoryPage;
