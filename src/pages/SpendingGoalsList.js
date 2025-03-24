import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon } from '@mui/icons-material';
import SpendingGoalService from '../services/spending-goal.service';
import SpendingGoalCard from '../components/SpendingGoalCard';
import SpendingGoalForm from '../components/SpendingGoalForm';

const SpendingGoalsList = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  useEffect(() => {
    fetchSpendingGoals();
  }, []);
  
  const fetchSpendingGoals = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await SpendingGoalService.getSpendingGoals();
      setGoals(response.data);
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch spending goals. Please try again later.');
      console.error('Error fetching spending goals:', err);
    }
  };
  
  const handleOpenForm = () => {
    setOpenForm(true);
  };
  
  const handleCloseForm = () => {
    setOpenForm(false);
  };
  
  const handleSaveGoal = (newGoal) => {
    fetchSpendingGoals(); // Refresh the list after adding a new goal
  };
  
  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, id: null });
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      
      await SpendingGoalService.deleteSpendingGoal(deleteDialog.id);
      
      setDeleteDialog({ open: false, id: null });
      fetchSpendingGoals(); // Refresh the list
    } catch (err) {
      setLoading(false);
      setError('Failed to delete spending goal. Please try again.');
      console.error('Error deleting spending goal:', err);
      setDeleteDialog({ open: false, id: null });
    }
  };
  
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          mb: 3,
          mt: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ fontSize: isMobile ? '1.75rem' : '2.125rem' }}
        >
          Spending Goals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
          sx={{ mt: isMobile ? 2 : 0 }}
        >
          Add Goal
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Set and track your spending limits by category
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading && goals.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : goals.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          You don't have any spending goals yet. Click "Add Goal" to create one.
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {goals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={goal.id}>
              <SpendingGoalCard
                goal={goal}
                onDelete={handleDeleteClick}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      <SpendingGoalForm
        open={openForm}
        onClose={handleCloseForm}
        onSave={handleSaveGoal}
      />
      
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this spending goal? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SpendingGoalsList;
