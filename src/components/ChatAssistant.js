import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Avatar,
  Fab,
  Collapse,
  Zoom,
  Divider,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  AccountCircle as UserIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Autorenew as LoadingIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import chatService from '../services/chat.service';

/**
 * A chat assistant component that provides a chat interface for users
 * to interact with a rule-based finance assistant.
 */
const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi! I\'m your finance assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const endOfMessagesRef = useRef(null);
  const theme = useTheme();

  // Sample help suggestions
  const helpSuggestions = [
    "How much money is in my savings account?",
    "How much did I spend on food this month?",
    "Create a transaction: $50 for groceries today"
  ];

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the backend service
      const response = await chatService.sendMessage(inputValue.trim());
      
      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: response.data.message,
        data: response.data.data || {},
        type: response.data.type || 'text',
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const toggleChat = () => {
    setIsOpen(prevState => !prevState);
  };

  const formatTimeStamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Fab Button */}
      <Zoom in={!isOpen}>
        <Fab 
          color="primary" 
          aria-label="chat"
          onClick={toggleChat}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <ChatIcon />
        </Fab>
      </Zoom>

      {/* Chat Panel */}
      <Collapse 
        in={isOpen} 
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          maxWidth: 380,
          width: '100%',
          boxShadow: 4,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Paper 
          elevation={3}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          {/* Chat Header */}
          <Box 
            sx={{ 
              backgroundColor: 'primary.main', 
              color: 'primary.contrastText',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BotIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Finance Assistant</Typography>
            </Box>
            <IconButton 
              color="inherit" 
              onClick={toggleChat}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Box 
            sx={{ 
              height: 350, 
              overflowY: 'auto',
              bgcolor: 'background.default',
              p: 2
            }}
          >
            <List sx={{ width: '100%', p: 0 }}>
              {messages.map((message) => (
                <ListItem 
                  key={message.id} 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    p: 0,
                    mb: 2
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                        width: 32,
                        height: 32,
                        ml: message.sender === 'user' ? 1 : 0,
                        mr: message.sender === 'bot' ? 1 : 0
                      }}
                    >
                      {message.sender === 'user' ? <UserIcon fontSize="small" /> : <BotIcon fontSize="small" />}
                    </Avatar>
                    <Box>
                      <Paper 
                        variant="outlined"
                        sx={{ 
                          p: 1.5,
                          maxWidth: 250,
                          borderRadius: 2,
                          bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                          color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                          wordBreak: 'break-word'
                        }}
                      >
                        <Typography variant="body2">{message.text}</Typography>
                      </Paper>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: 'block',
                          mt: 0.5,
                          ml: message.sender === 'bot' ? 1 : 0,
                          mr: message.sender === 'user' ? 1 : 0,
                          textAlign: message.sender === 'user' ? 'right' : 'left'
                        }}
                      >
                        {formatTimeStamp(message.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))}
              {isLoading && (
                <ListItem 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 0,
                    mb: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'secondary.main',
                        width: 32,
                        height: 32,
                        mr: 1
                      }}
                    >
                      <BotIcon fontSize="small" />
                    </Avatar>
                    <CircularProgress size={20} />
                  </Box>
                </ListItem>
              )}
              <div ref={endOfMessagesRef} />
            </List>
          </Box>

          {/* Help Suggestions */}
          <Box sx={{ px: 2, py: 1, bgcolor: 'background.paper', borderTop: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HelpIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary">Try asking:</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {helpSuggestions.map((suggestion, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  component="span"
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    bgcolor: 'action.hover',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  {suggestion}
                </Typography>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Chat Input */}
          <Box 
            sx={{ 
              p: 2, 
              display: 'flex',
              bgcolor: 'background.paper'
            }}
          >
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={isLoading || inputValue.trim() === ''}
                    edge="end"
                  >
                    {isLoading ? <LoadingIcon /> : <SendIcon />}
                  </IconButton>
                )
              }}
            />
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default ChatAssistant;
