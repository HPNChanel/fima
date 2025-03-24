import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  alpha,
  Chip,
  Grid,
  Button,
  Avatar,
  AvatarGroup,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Stack,
  Tooltip,
  useMediaQuery,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Check as CheckIcon,
  Pending as PendingIcon,
  HourglassTop as InProgressIcon,
  FilterList as FilterListIcon,
  CalendarMonth as CalendarIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  GridView as GridViewIcon,
  ViewTimeline as ViewTimelineIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const ProductRoadmapSection = ({ language }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  // Set initial view based on screen size
  const [view, setView] = useState(() => isMobile ? 'grid' : 'timeline');
  const [filter, setFilter] = useState('all');
  const [expandedItems, setExpandedItems] = useState({});
  const [visibleMonths, setVisibleMonths] = useState(['Jan', 'Feb', 'Mar']);
  const [key, setKey] = useState(0); // Key for forcing re-render

  // Update view if screen size changes
  useEffect(() => {
    // Only auto-switch to grid on initial mobile view or when explicitly going to mobile from desktop
    if (isMobile && view === 'timeline') {
      setView('grid');
    }
  }, [isMobile]);

  // Team member data
  const teamMembers = [
    {
      id: 'phuctam',
      name: 'Phuc Tam Ho',
      avatar: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t1.15752-9/484551030_1673939883247728_8768509888435194846_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHKrThPePQP179rUb-NxP67z-fMk2si5Q7P58yTayLlDoeqGwOoHGIFNV3zLDdoYnAuRjbVqEPzT45hpMzfAs_6&_nc_ohc=dquzeIGCjQ0Q7kNvgFo2L-B&_nc_oc=AdnnWKBy7jsHJXOEPE10Eya-t0xcbM_vlsiNQkfSH8jHkr-PL36LLHgqhcXFmwuG6bU&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&oh=03_Q7cD1wHyNBGavAOrXTMlhfhr9dBODDA-8ZB1CCFCCF2wmiUJCA&oe=6806016E',
      color: theme.palette.primary.main
    },
    {
      id: 'vantinh',
      name: 'Van Tinh Nguyen',
      avatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/484400207_2461043850910766_3722109055110484329_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEJviIuL7p6oPOgNh9tEFhBoEM85PYkojegQzzk9iSiN49cgTALp5zvTH5OyXT8sI30UxNZIH5bC-uKU1-vRw1O&_nc_ohc=DZfc9qmIcyQQ7kNvgGOcvOQ&_nc_oc=AdkUFs_IXc7tOnhsSa9qUAOTTjmTOUiejLplrbYea56cG2VlmKndNqaz--iCDg1QNJQ&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=3RN5If7dhsq42shMow0PXg&oh=00_AYFP2aqYuw_nNqrVsq_5TLiTGuVd7sanhyAUl3dbzQ7ArQ&oe=67E434B9',
      color: theme.palette.success.main
    },
    {
      id: 'phucnguyen',
      name: 'Phuc Nguyen Huynh',
      avatar: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/480427196_1360063718326695_479625262547442940_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH6yCHlr4Dk7Vz7bRk4ZpUo8jT_-be9kS_yNP_5t72RL2aZfN1P8neEfVGTcQd2fNVzkxt4W5LaP0c1busxyhm3&_nc_ohc=AuTPPuQKDegQ7kNvgHFNDCJ&_nc_oc=AdlKzcGzqqoxEOhSQ6vQHodsXn5mBU0BkrbuTRwCxnP5rxVbWarqQHsLDnjf4cl2rfE&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=IrPeGa3pYUfe8cORzrTDng&oh=00_AYHzBaCO_YWo_VqtwMMJf237tJMBeTVrqVjphgyanVQM3Q&oe=67E45E35',
      color: theme.palette.warning.main
    }
  ];

  // Roadmap data structured by timeline
  const roadmapData = [
    // Week 1-2 (Jan 1-14)
    {
      timeframe: 'Jan 1-14',
      title: language === 'vi' ? 'Tuần 1-2: Thiết lập & Nền tảng' : 'Week 1-2: Setup & Foundation',
      month: 'Jan',
      items: [
        {
          id: 'setup-project',
          title: language === 'vi' ? 'Thiết lập dự án & cấu trúc' : 'Project setup & structure',
          assignee: 'phucnguyen',
          status: 'done',
          details: language === 'vi' 
            ? 'Khởi tạo dự án, cấu hình môi trường, thiết lập CI/CD, và lập kế hoạch sprint.' 
            : 'Initialize project, configure environments, set up CI/CD, and sprint planning.',
          tags: ['core', 'frontend', 'backend']
        },
        {
          id: 'ui-design',
          title: language === 'vi' ? 'Thiết kế giao diện & mẫu' : 'UI design & prototyping',
          assignee: 'phucnguyen',
          status: 'done',
          details: language === 'vi'
            ? 'Thiết kế giao diện người dùng, xây dựng hệ thống component, và tạo nguyên mẫu chức năng.'
            : 'Design user interfaces, build component systems, and create functional prototypes.',
          tags: ['core', 'frontend']
        },
        {
          id: 'db-schema',
          title: language === 'vi' ? 'Thiết kế cơ sở dữ liệu' : 'Database schema design',
          assignee: 'phuctam',
          status: 'done',
          details: language === 'vi'
            ? 'Thiết kế schema cơ sở dữ liệu và các mối quan hệ, chuẩn bị migrations.'
            : 'Design database schema and relationships, prepare migrations.',
          tags: ['core', 'backend']
        }
      ]
    },
    // Week 3-4 (Jan 15-31)
    {
      timeframe: 'Jan 15-31',
      title: language === 'vi' ? 'Tuần 3-4: Phát triển Core & Đăng nhập' : 'Week 3-4: Core Development & Authentication',
      month: 'Jan',
      items: [
        {
          id: 'auth-system',
          title: language === 'vi' ? 'Hệ thống xác thực người dùng' : 'User authentication system',
          assignee: 'phucnguyen',
          status: 'done',
          details: language === 'vi'
            ? 'Xây dựng hệ thống đăng nhập, đăng ký, quên mật khẩu và quản lý phiên.'
            : 'Build login, registration, forgot password, and session management.',
          tags: ['core', 'frontend', 'backend']
        },
        {
          id: 'accounts-module',
          title: language === 'vi' ? 'Module tài khoản (cơ bản)' : 'Accounts module (basic)',
          assignee: 'phuctam',
          status: 'done',
          details: language === 'vi'
            ? 'Phát triển chức năng quản lý tài khoản cá nhân với CRUD cơ bản.'
            : 'Develop account management functionality with basic CRUD.',
          tags: ['core', 'frontend', 'backend']
        },
        {
          id: 'user-profiles',
          title: language === 'vi' ? 'Hồ sơ người dùng' : 'User profiles',
          assignee: 'vantinh',
          status: 'done',
          details: language === 'vi'
            ? 'Xây dựng hồ sơ người dùng với thông tin cá nhân và cài đặt.'
            : 'Build user profiles with personal information and settings.',
          tags: ['frontend', 'backend']
        }
      ]
    },
    // Week 5-6 (Feb 1-14)
    {
      timeframe: 'Feb 1-14',
      title: language === 'vi' ? 'Tuần 5-6: Tính năng giao dịch & nhật ký' : 'Week 5-6: Transaction & Journal Features',
      month: 'Feb',
      items: [
        {
          id: 'transactions',
          title: language === 'vi' ? 'Module giao dịch' : 'Transactions module',
          assignee: 'phuctam',
          status: 'inProgress',
          details: language === 'vi'
            ? 'Phát triển chức năng thêm, sửa, xóa và lọc giao dịch với các danh mục.'
            : 'Develop transaction add, edit, delete, and filtering with categories.',
          tags: ['core', 'frontend', 'backend']
        },
        {
          id: 'transaction-calendar',
          title: language === 'vi' ? 'Lịch giao dịch' : 'Transaction calendar',
          assignee: 'phuctam',
          status: 'inProgress',
          details: language === 'vi'
            ? 'Hiển thị giao dịch theo dạng lịch với các chức năng lọc và tìm kiếm.'
            : 'Display transactions in calendar view with filtering and search.',
          tags: ['enhancement', 'frontend']
        },
        {
          id: 'journal-history',
          title: language === 'vi' ? 'Lịch sử hoạt động' : 'Journal history',
          assignee: 'vantinh',
          status: 'inProgress',
          details: language === 'vi'
            ? 'Xây dựng dòng thời gian hoạt động người dùng với lọc và tùy chỉnh.'
            : 'Build user activity timeline with filtering and customization.',
          tags: ['frontend', 'backend']
        },
        {
          id: 'basic-dashboard',
          title: language === 'vi' ? 'Bảng điều khiển cơ bản' : 'Basic dashboard',
          assignee: 'phucnguyen',
          status: 'inProgress',
          details: language === 'vi'
            ? 'Tạo bảng điều khiển với widgets hiển thị thông tin tài chính cốt lõi.'
            : 'Create dashboard with widgets displaying core financial information.',
          tags: ['core', 'frontend']
        }
      ]
    },
    // Week 7-8 (Feb 15-29)
    {
      timeframe: 'Feb 15-29',
      title: language === 'vi' ? 'Tuần 7-8: Trực quan hóa & Mục tiêu' : 'Week 7-8: Visualizations & Goals',
      month: 'Feb',
      items: [
        {
          id: 'account-details',
          title: language === 'vi' ? 'Chi tiết tài khoản & chuyển khoản' : 'Account details & transfers',
          assignee: 'phuctam',
          status: 'todo',
          details: language === 'vi'
            ? 'Phát triển giao diện chi tiết tài khoản và tính năng chuyển khoản giữa các tài khoản.'
            : 'Develop account details interface and transfer functionality between accounts.',
          tags: ['frontend', 'backend']
        },
        {
          id: 'financial-diary',
          title: language === 'vi' ? 'Nhật ký tài chính' : 'Financial diary',
          assignee: 'vantinh',
          status: 'todo',
          details: language === 'vi'
            ? 'Xây dựng nhật ký tài chính để người dùng ghi chú về các giao dịch và quyết định tài chính.'
            : 'Build financial diary for users to note transactions and financial decisions.',
          tags: ['enhancement', 'frontend', 'backend']
        },
        {
          id: 'spending-goals',
          title: language === 'vi' ? 'Mục tiêu chi tiêu' : 'Spending goals',
          assignee: 'vantinh',
          status: 'todo',
          details: language === 'vi'
            ? 'Phát triển chức năng thiết lập và theo dõi mục tiêu chi tiêu với cảnh báo.'
            : 'Develop functionality to set and track spending goals with alerts.',
          tags: ['frontend', 'backend']
        },
        {
          id: 'dashboard-charts',
          title: language === 'vi' ? 'Biểu đồ bảng điều khiển' : 'Dashboard charts',
          assignee: 'phucnguyen',
          status: 'todo',
          details: language === 'vi'
            ? 'Thêm các biểu đồ trực quan vào bảng điều khiển để hiển thị xu hướng tài chính.'
            : 'Add visual charts to dashboard to display financial trends.',
          tags: ['enhancement', 'frontend']
        }
      ]
    },
    // Week 9-10 (Mar 1-14)
    {
      timeframe: 'Mar 1-14',
      title: language === 'vi' ? 'Tuần 9-10: Báo cáo & Tiết kiệm' : 'Week 9-10: Reports & Savings',
      month: 'Mar',
      items: [
        {
          id: 'account-visualizations',
          title: language === 'vi' ? 'Trực quan hóa tài khoản' : 'Account visualizations',
          assignee: 'phuctam',
          status: 'todo',
          details: language === 'vi'
            ? 'Thêm biểu đồ và trực quan hóa cho chi tiết tài khoản và lịch sử giao dịch.'
            : 'Add charts and visualizations for account details and transaction history.',
          tags: ['enhancement', 'frontend']
        },
        {
          id: 'reports-module',
          title: language === 'vi' ? 'Module báo cáo' : 'Reports module',
          assignee: 'phucnguyen',
          status: 'todo',
          details: language === 'vi'
            ? 'Phát triển chức năng tạo và xuất báo cáo tài chính với nhiều định dạng.'
            : 'Develop functionality to generate and export financial reports in multiple formats.',
          tags: ['core', 'frontend', 'backend']
        },
        {
          id: 'savings-simulation',
          title: language === 'vi' ? 'Mô phỏng tiết kiệm' : 'Savings simulation',
          assignee: 'phucnguyen',
          status: 'todo',
          details: language === 'vi'
            ? 'Xây dựng công cụ mô phỏng để lập kế hoạch tiết kiệm và đầu tư.'
            : 'Build simulation tools for savings and investment planning.',
          tags: ['enhancement', 'frontend']
        },
        {
          id: 'goal-progress',
          title: language === 'vi' ? 'Theo dõi mục tiêu & cảnh báo' : 'Goal progress tracking & alerts',
          assignee: 'vantinh',
          status: 'todo',
          details: language === 'vi'
            ? 'Cải thiện chức năng theo dõi mục tiêu với cảnh báo và thông báo khi gần đạt mục tiêu.'
            : 'Enhance goal tracking with warnings and notifications when approaching targets.',
          tags: ['enhancement', 'frontend', 'backend']
        }
      ]
    },
    // Week 11-12 (Mar 15-31)
    {
      timeframe: 'Mar 15-31',
      title: language === 'vi' ? 'Tuần 11-12: Hoàn thiện & Triển khai' : 'Week 11-12: Finalization & Deployment',
      month: 'Mar',
      items: [
        {
          id: 'loan-simulation',
          title: language === 'vi' ? 'Mô phỏng khoản vay' : 'Loan simulation',
          assignee: 'phucnguyen',
          status: 'todo',
          details: language === 'vi'
            ? 'Phát triển công cụ mô phỏng khoản vay với các tùy chọn lãi suất và thời hạn khác nhau.'
            : 'Develop loan simulation tool with different interest rates and term options.',
          tags: ['enhancement', 'frontend']
        },
        {
          id: 'advanced-transfers',
          title: language === 'vi' ? 'Chuyển khoản nâng cao' : 'Advanced transfers',
          assignee: 'phuctam',
          status: 'todo',
          details: language === 'vi'
            ? 'Thêm tính năng chuyển khoản theo lịch, chuyển khoản định kỳ và mẫu chuyển khoản.'
            : 'Add scheduled transfers, recurring transfers, and transfer templates.',
          tags: ['enhancement', 'frontend', 'backend']
        },
        {
          id: 'testing-qa',
          title: language === 'vi' ? 'Kiểm thử & QA' : 'Testing & QA',
          assignee: 'all',
          status: 'todo',
          details: language === 'vi'
            ? 'Thực hiện kiểm thử tổng thể, sửa lỗi và tối ưu hóa hiệu suất.'
            : 'Perform comprehensive testing, bug fixes, and performance optimization.',
          tags: ['core', 'frontend', 'backend']
        },
        {
          id: 'deployment',
          title: language === 'vi' ? 'Triển khai & Tài liệu' : 'Deployment & Documentation',
          assignee: 'phucnguyen',
          status: 'todo',
          details: language === 'vi'
            ? 'Triển khai ứng dụng lên môi trường sản xuất và hoàn thiện tài liệu hướng dẫn sử dụng.'
            : 'Deploy the application to production and finalize user documentation.',
          tags: ['core', 'deployment']
        }
      ]
    }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'done':
        return {
          icon: <CheckIcon />,
          color: theme.palette.success.main,
          label: language === 'vi' ? 'Hoàn thành' : 'Done'
        };
      case 'inProgress':
        return {
          icon: <InProgressIcon />,
          color: theme.palette.primary.main,
          label: language === 'vi' ? 'Đang thực hiện' : 'In Progress'
        };
      case 'todo':
        return {
          icon: <PendingIcon />,
          color: theme.palette.text.secondary,
          label: language === 'vi' ? 'Chưa bắt đầu' : 'To Do'
        };
      default:
        return {
          icon: <PendingIcon />,
          color: theme.palette.text.secondary,
          label: language === 'vi' ? 'Chưa bắt đầu' : 'To Do'
        };
    }
  };

  const getTagInfo = (tag) => {
    switch (tag) {
      case 'core':
        return {
          label: language === 'vi' ? 'Cốt lõi' : 'Core',
          color: theme.palette.error.main,
          icon: <StarIcon fontSize="small" />
        };
      case 'enhancement':
        return {
          label: language === 'vi' ? 'Nâng cao' : 'Enhancement',
          color: theme.palette.info.main,
          icon: null
        };
      case 'frontend':
        return {
          label: language === 'vi' ? 'Frontend' : 'Frontend',
          color: theme.palette.primary.main,
          icon: <CodeIcon fontSize="small" />
        };
      case 'backend':
        return {
          label: language === 'vi' ? 'Backend' : 'Backend',
          color: theme.palette.secondary.main,
          icon: <StorageIcon fontSize="small" />
        };
      case 'deployment':
        return {
          label: language === 'vi' ? 'Triển khai' : 'Deployment',
          color: theme.palette.warning.main,
          icon: null
        };
      default:
        return {
          label: tag,
          color: theme.palette.grey[500],
          icon: null
        };
    }
  };

  const getAssignee = (assigneeId) => {
    if (assigneeId === 'all') {
      return {
        all: true,
        members: teamMembers
      };
    }

    return {
      all: false,
      member: teamMembers.find(member => member.id === assigneeId)
    };
  };

  // Filter the roadmap data based on selected filters
  const filteredRoadmap = roadmapData
    .filter(timeframe => visibleMonths.includes(timeframe.month))
    .map(timeframe => {
      // Apply person filter to items
      const filteredItems = timeframe.items.filter(item => {
        if (filter === 'all') return true;
        if (item.assignee === 'all') return true;
        return item.assignee === filter;
      });

      return {
        ...timeframe,
        items: filteredItems
      };
    })
    .filter(timeframe => timeframe.items.length > 0);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
      // Force re-render with new key when view changes
      setKey(prevKey => prevKey + 1);
    }
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleMonthToggle = (month) => {
    let newMonths;
    if (visibleMonths.includes(month)) {
      if (visibleMonths.length > 1) {
        newMonths = visibleMonths.filter(m => m !== month);
      } else {
        // Don't allow removing the last month
        newMonths = visibleMonths;
      }
    } else {
      newMonths = [...visibleMonths, month];
    }
    setVisibleMonths(newMonths);
  };

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Simple fade animation for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Animation for individual items with reduced complexity
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Box
      id="roadmap"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.default, 0.5)
          : alpha(theme.palette.background.default, 0.7)
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h6"
            component="p"
            color="primary"
            fontWeight="medium"
            sx={{ mb: 2 }}
          >
            {language === 'vi' ? 'Lộ Trình Dự Án' : 'Project Roadmap'}
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 2
            }}
          >
            {language === 'vi' ? 'Kế Hoạch Phát Triển Chi Tiết' : 'Detailed Development Plan'}
          </Typography>

          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: 'auto'
            }}
          >
            {language === 'vi'
              ? 'Theo dõi tiến độ phát triển và các tính năng sắp ra mắt của ứng dụng quản lý tài chính của chúng tôi'
              : 'Track the development progress and upcoming features of our finance management application'}
          </Typography>
        </Box>

        {/* Controls and filters */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 1 }}>
              <FilterListIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              {language === 'vi' ? 'Lọc theo:' : 'Filter by:'}
            </Typography>
            
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleFilterChange}
              aria-label="Member filter"
              size="small"
              sx={{ flexWrap: 'wrap' }}
            >
              <ToggleButton value="all" aria-label="All members">
                {language === 'vi' ? 'Tất cả' : 'All'}
              </ToggleButton>
              {teamMembers.map(member => (
                <ToggleButton 
                  key={member.id} 
                  value={member.id} 
                  aria-label={member.name}
                >
                  <Avatar 
                    src={member.avatar} 
                    alt={member.name} 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      mr: 0.5,
                      border: filter === member.id ? `2px solid ${member.color}` : 'none' 
                    }} 
                  />
                  {!isSmall && member.name.split(' ').pop()}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="subtitle2" color="text.secondary">
                {language === 'vi' ? 'Tháng:' : 'Months:'}
              </Typography>
              {['Jan', 'Feb', 'Mar'].map(month => (
                <Chip
                  key={month}
                  label={month}
                  size="small"
                  clickable
                  color={visibleMonths.includes(month) ? 'primary' : 'default'}
                  variant={visibleMonths.includes(month) ? 'filled' : 'outlined'}
                  onClick={() => handleMonthToggle(month)}
                />
              ))}
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="timeline" aria-label="timeline view">
                <ViewTimelineIcon fontSize="small" />
                {!isSmall && <Box component="span" sx={{ ml: 1 }}>Timeline</Box>}
              </ToggleButton>
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewIcon fontSize="small" />
                {!isSmall && <Box component="span" sx={{ ml: 1 }}>Grid</Box>}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Paper>

        {/* Use AnimatePresence to handle view transitions */}
        <AnimatePresence mode="wait">
          <MotionBox
            key={`view-${view}-${key}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            {view === 'timeline' ? (
              /* Timeline View */
              <Timeline position={isMobile ? "right" : "alternate"} sx={{ px: { xs: 0, sm: 2 } }}>
                {filteredRoadmap.map((timeframe, timeframeIndex) => (
                  <React.Fragment key={timeframeIndex}>
                    <TimelineItem>
                      <TimelineOppositeContent
                        sx={{ m: 'auto 0', display: { xs: 'none', md: 'block' } }}
                        align="right"
                        variant="h6"
                        color="text.secondary"
                      >
                        {timeframe.timeframe}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector sx={{ bgcolor: 'primary.main', opacity: 0.2 }} />
                        <TimelineDot 
                          color="primary" 
                          variant="outlined"
                          sx={{ 
                            p: 1.5,
                            borderWidth: 3, 
                            boxShadow: 'none' 
                          }}
                        >
                          <CalendarIcon />
                        </TimelineDot>
                        <TimelineConnector sx={{ bgcolor: 'primary.main', opacity: 0.2 }} />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {timeframe.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ display: { xs: 'block', md: 'none' }, mb: 1 }}
                        >
                          {timeframe.timeframe}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>

                    {timeframe.items.map((item) => {
                      const statusInfo = getStatusInfo(item.status);
                      const assigneeInfo = getAssignee(item.assignee);
                      const isExpanded = expandedItems[item.id] || false;

                      return (
                        <TimelineItem key={item.id}>
                          <TimelineOppositeContent
                            sx={{ m: 'auto 0', display: { xs: 'none', md: 'block' } }}
                            color="text.secondary"
                          >
                            {assigneeInfo.all ? (
                              <AvatarGroup max={3} sx={{ justifyContent: 'flex-end' }}>
                                {assigneeInfo.members.map(member => (
                                  <Tooltip key={member.id} title={member.name}>
                                    <Avatar 
                                      alt={member.name} 
                                      src={member.avatar} 
                                      sx={{ 
                                        width: 32, 
                                        height: 32,
                                        border: `2px solid ${member.color}`,
                                      }} 
                                    />
                                  </Tooltip>
                                ))}
                              </AvatarGroup>
                            ) : (
                              <Tooltip title={assigneeInfo.member.name}>
                                <Avatar 
                                  alt={assigneeInfo.member.name} 
                                  src={assigneeInfo.member.avatar} 
                                  sx={{ 
                                    width: 36, 
                                    height: 36,
                                    ml: 'auto',
                                    border: `2px solid ${assigneeInfo.member.color}`,
                                  }} 
                                />
                              </Tooltip>
                            )}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineConnector sx={{ bgcolor: 'primary.main', opacity: 0.2 }} />
                            <TimelineDot sx={{ 
                              bgcolor: statusInfo.color,
                              boxShadow: 'none'
                            }}>
                              {statusInfo.icon}
                            </TimelineDot>
                            <TimelineConnector sx={{ bgcolor: 'primary.main', opacity: 0.2 }} />
                          </TimelineSeparator>
                          <TimelineContent sx={{ py: '12px', px: 2 }}>
                            <MotionPaper
                              variants={itemVariants}
                              sx={{
                                p: 2,
                                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                backdropFilter: 'blur(10px)',
                                borderLeft: `4px solid ${statusInfo.color}`,
                                borderRadius: 2,
                                '&:hover': {
                                  boxShadow: 3,
                                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                },
                                transition: 'all 0.2s'
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {item.title}
                                  </Typography>
                                  
                                  {/* Mobile assignee */}
                                  <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', mb: 1, mt: 0.5 }}>
                                    {assigneeInfo.all ? (
                                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                                        {assigneeInfo.members.map(member => (
                                          <Avatar 
                                            key={member.id}
                                            alt={member.name} 
                                            src={member.avatar} 
                                          />
                                        ))}
                                      </AvatarGroup>
                                    ) : (
                                      <Avatar 
                                        alt={assigneeInfo.member.name} 
                                        src={assigneeInfo.member.avatar} 
                                        sx={{ width: 24, height: 24 }} 
                                      />
                                    )}
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                      {assigneeInfo.all 
                                        ? (language === 'vi' ? 'Toàn nhóm' : 'All team') 
                                        : assigneeInfo.member.name}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Chip 
                                  size="small"
                                  label={statusInfo.label}
                                  sx={{ 
                                    bgcolor: alpha(statusInfo.color, 0.1),
                                    color: statusInfo.color,
                                    fontWeight: 'medium',
                                    borderRadius: 1
                                  }}
                                />
                              </Box>
                              
                              <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                                {item.tags.map(tag => {
                                  const tagInfo = getTagInfo(tag);
                                  return (
                                    <Chip
                                      key={tag}
                                      size="small"
                                      label={tagInfo.label}
                                      icon={tagInfo.icon}
                                      sx={{ 
                                        bgcolor: alpha(tagInfo.color, 0.1),
                                        color: tagInfo.color,
                                        borderRadius: 1,
                                        '& .MuiChip-icon': {
                                          color: tagInfo.color
                                        }
                                      }}
                                    />
                                  );
                                })}
                              </Stack>
                              
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                      {item.details}
                                    </Typography>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              <Button 
                                size="small" 
                                color="inherit"
                                onClick={() => toggleItemExpansion(item.id)}
                                endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                sx={{ mt: 1, textTransform: 'none' }}
                              >
                                {isExpanded 
                                  ? (language === 'vi' ? 'Thu gọn' : 'Collapse') 
                                  : (language === 'vi' ? 'Chi tiết' : 'Details')}
                              </Button>
                            </MotionPaper>
                          </TimelineContent>
                        </TimelineItem>
                      );
                    })}
                  </React.Fragment>
                ))}
              </Timeline>
            ) : (
              /* Grid View */
              <Box>
                {filteredRoadmap.map((timeframe) => (
                  <Box key={timeframe.timeframe} sx={{ mb: 6 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {timeframe.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {timeframe.timeframe}
                    </Typography>
                    <Divider sx={{ mt: 1, mb: 3 }} />
                    
                    <Grid container spacing={3}>
                      {timeframe.items.map((item) => {
                        const statusInfo = getStatusInfo(item.status);
                        const assigneeInfo = getAssignee(item.assignee);
                        const isExpanded = expandedItems[item.id] || false;
                        
                        return (
                          <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <MotionCard
                              variants={itemVariants}
                              sx={{
                                height: '100%',
                                borderTop: `4px solid ${statusInfo.color}`,
                                borderRadius: 2,
                                '&:hover': {
                                  boxShadow: 3,
                                  transform: 'translateY(-4px)',
                                },
                                transition: 'all 0.2s'
                              }}
                            >
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                  <Chip 
                                    size="small"
                                    label={statusInfo.label}
                                    icon={statusInfo.icon}
                                    sx={{ 
                                      bgcolor: alpha(statusInfo.color, 0.1),
                                      color: statusInfo.color,
                                      fontWeight: 'medium',
                                      borderRadius: 1,
                                      '& .MuiChip-icon': {
                                        color: statusInfo.color
                                      }
                                    }}
                                  />
                                  
                                  <Box>
                                    {assigneeInfo.all ? (
                                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28 } }}>
                                        {assigneeInfo.members.map(member => (
                                          <Tooltip key={member.id} title={member.name}>
                                            <Avatar 
                                              alt={member.name} 
                                              src={member.avatar} 
                                              sx={{ 
                                                border: `2px solid ${member.color}`
                                              }} 
                                            />
                                          </Tooltip>
                                        ))}
                                      </AvatarGroup>
                                    ) : (
                                      <Tooltip title={assigneeInfo.member.name}>
                                        <Avatar 
                                          alt={assigneeInfo.member.name} 
                                          src={assigneeInfo.member.avatar} 
                                          sx={{ 
                                            width: 32, 
                                            height: 32,
                                            border: `2px solid ${assigneeInfo.member.color}`
                                          }} 
                                        />
                                      </Tooltip>
                                    )}
                                  </Box>
                                </Box>
                                
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                  {item.title}
                                </Typography>
                                
                                <Stack direction="row" spacing={1} sx={{ my: 1, flexWrap: 'wrap', gap: 0.5 }}>
                                  {item.tags.map(tag => {
                                    const tagInfo = getTagInfo(tag);
                                    return (
                                      <Chip
                                        key={tag}
                                        size="small"
                                        label={tagInfo.label}
                                        icon={tagInfo.icon}
                                        sx={{ 
                                          bgcolor: alpha(tagInfo.color, 0.1),
                                          color: tagInfo.color,
                                          borderRadius: 1,
                                          '& .MuiChip-icon': {
                                            color: tagInfo.color
                                          }
                                        }}
                                      />
                                    );
                                  })}
                                </Stack>
                                
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <Typography variant="body2" sx={{ mt: 1 }}>
                                        {item.details}
                                      </Typography>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                
                                <Button 
                                  size="small" 
                                  color="inherit"
                                  onClick={() => toggleItemExpansion(item.id)}
                                  endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                  sx={{ mt: 2, textTransform: 'none' }}
                                >
                                  {isExpanded 
                                    ? (language === 'vi' ? 'Thu gọn' : 'Collapse') 
                                    : (language === 'vi' ? 'Chi tiết' : 'Details')}
                                </Button>
                              </CardContent>
                            </MotionCard>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                ))}
              </Box>
            )}
          </MotionBox>
        </AnimatePresence>

        {/* Legend */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mt: 4,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.5)
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            {language === 'vi' ? 'Chú thích:' : 'Legend:'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['done', 'inProgress', 'todo'].map(status => {
                  const info = getStatusInfo(status);
                  return (
                    <Chip
                      key={status}
                      size="small"
                      icon={info.icon}
                      label={info.label}
                      sx={{ 
                        bgcolor: alpha(info.color, 0.1),
                        color: info.color,
                        '& .MuiChip-icon': {
                          color: info.color
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['core', 'enhancement', 'frontend', 'backend', 'deployment'].map(tag => {
                  const info = getTagInfo(tag);
                  return (
                    <Chip
                      key={tag}
                      size="small"
                      icon={info.icon}
                      label={info.label}
                      sx={{ 
                        bgcolor: alpha(info.color, 0.1),
                        color: info.color,
                        '& .MuiChip-icon': {
                          color: info.color
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProductRoadmapSection;
