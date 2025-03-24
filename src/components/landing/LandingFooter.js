import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  alpha,
  List,
  ListItem,
  Button
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const LandingFooter = ({ language }) => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  // Footer navigation links
  const footerLinks = {
    product: [
      { name: language === 'vi' ? 'Tính Năng' : 'Features', href: '#features' },
      { name: language === 'vi' ? 'Bảng Giá' : 'Pricing', href: '#pricing' },
      { name: language === 'vi' ? 'Khách Hàng' : 'Customers', href: '#testimonials' },
      { name: language === 'vi' ? 'Hỗ Trợ' : 'Support', href: '#support' }
    ],
    company: [
      { name: language === 'vi' ? 'Giới Thiệu' : 'About Us', href: '/about' },
      { name: language === 'vi' ? 'Đội Ngũ' : 'Team', href: '#team' },
      { name: language === 'vi' ? 'Tuyển Dụng' : 'Careers', href: '/careers' },
      { name: language === 'vi' ? 'Liên Hệ' : 'Contact', href: '/contact' }
    ],
    legal: [
      { name: language === 'vi' ? 'Điều Khoản' : 'Terms', href: '/terms' },
      { name: language === 'vi' ? 'Chính Sách' : 'Privacy', href: '/privacy' },
      { name: language === 'vi' ? 'Bảo Mật' : 'Security', href: '/security' },
      { name: language === 'vi' ? 'Cookie' : 'Cookies', href: '/cookies' }
    ]
  };

  // Social media links
  const socialLinks = [
    { icon: <FacebookIcon />, name: 'Facebook', href: 'https://facebook.com' },
    { icon: <TwitterIcon />, name: 'Twitter', href: 'https://twitter.com' },
    { icon: <InstagramIcon />, name: 'Instagram', href: 'https://instagram.com' },
    { icon: <LinkedInIcon />, name: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: <GitHubIcon />, name: 'GitHub', href: 'https://github.com' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.2)
          : alpha(theme.palette.primary.main, 0.03),
        color: 'text.primary',
        pt: 8,
        pb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%)`,
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%)`,
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Company info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'primary.main',
                textDecoration: 'none',
                display: 'block',
                mb: 2
              }}
            >
              FINANCE APP
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
              {language === 'vi'
                ? 'Ứng dụng tài chính toàn diện giúp bạn quản lý chi tiêu, thiết lập mục tiêu tiết kiệm và theo dõi tài sản của mình.'
                : 'A comprehensive finance app that helps you manage expenses, set savings goals, and track your assets.'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {socialLinks.map((link) => (
                <IconButton
                  key={link.name}
                  component="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  aria-label={link.name}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
          
          {/* Product links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
              {language === 'vi' ? 'Sản Phẩm' : 'Product'}
            </Typography>
            <List dense disablePadding>
              {footerLinks.product.map((link) => (
                <ListItem key={link.name} disablePadding sx={{ mb: 0.5 }}>
                  <Link
                    href={link.href}
                    underline="none"
                    color="text.secondary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <KeyboardArrowRightIcon fontSize="small" sx={{ opacity: 0.6, mr: 0.5 }} />
                    {link.name}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Company links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
              {language === 'vi' ? 'Công Ty' : 'Company'}
            </Typography>
            <List dense disablePadding>
              {footerLinks.company.map((link) => (
                <ListItem key={link.name} disablePadding sx={{ mb: 0.5 }}>
                  <Link
                    href={link.href}
                    underline="none"
                    color="text.secondary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <KeyboardArrowRightIcon fontSize="small" sx={{ opacity: 0.6, mr: 0.5 }} />
                    {link.name}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Legal links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
              {language === 'vi' ? 'Pháp Lý' : 'Legal'}
            </Typography>
            <List dense disablePadding>
              {footerLinks.legal.map((link) => (
                <ListItem key={link.name} disablePadding sx={{ mb: 0.5 }}>
                  <Link
                    href={link.href}
                    underline="none"
                    color="text.secondary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <KeyboardArrowRightIcon fontSize="small" sx={{ opacity: 0.6, mr: 0.5 }} />
                    {link.name}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Newsletter subscription */}
          <Grid item xs={12} sm={8} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
              {language === 'vi' ? 'Đăng Ký Bản Tin' : 'Newsletter'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {language === 'vi' 
                ? 'Đăng ký để nhận tin tức và cập nhật mới nhất' 
                : 'Subscribe to receive the latest news and updates'}
            </Typography>
            <Box component="form" sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  py: 1
                }}
              >
                {language === 'vi' ? 'Đăng Ký' : 'Subscribe'}
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Bottom footer with copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            © {currentYear} Finance App. {language === 'vi' ? 'Đã đăng ký Bản quyền.' : 'All rights reserved.'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              {language === 'vi' ? 'Trợ Giúp' : 'Help Center'}
            </Link>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              {language === 'vi' ? 'Trạng Thái' : 'Status'}
            </Link>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              {language === 'vi' ? 'Nhà Phát Triển' : 'Developers'}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingFooter;
