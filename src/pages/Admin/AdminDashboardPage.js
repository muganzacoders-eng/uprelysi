// frontend/src/pages/Admin/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Add this import
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  Pagination,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon,
  Campaign as CampaignIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Add PropTypes validation for TabPanel
TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

function AdminDashboardPage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [legalDocuments, setLegalDocuments] = useState([]);
  const [analytics, setAnalytics] = useState({});

  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [legalDialogOpen, setLegalDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Pagination
  const [userPage, setUserPage] = useState(1);
  const [contentPage, setContentPage] = useState(1);
  const [adPage, setAdPage] = useState(1);

  // Form data
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    link_url: '',
    ad_type: 'banner',
    target_audience: 'all',
    position: 'sidebar_right',
    start_date: '',
    end_date: '',
    priority: 1,
    is_active: true
  });
  const [legalForm, setLegalForm] = useState({
    document_type: 'privacy_policy',
    title: '',
    content: '',
    version: '1.0'
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, analyticsData] = await Promise.all([
        ApiService.getAdminStats(),
        ApiService.getAnalyticsOverview()
      ]);
      
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page = 1) => {
    try {
      const data = await ApiService.getAllUsers({ page, limit: 10 });
      setUsers(data.users || []);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const fetchContent = async (page = 1) => {
    try {
      const data = await ApiService.getAdminContent({ page, limit: 10 });
      setContent(data.content || []);
    } catch (err) {
      setError('Failed to load content');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await ApiService.getAdminCategories();
      setCategories(data || []);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const fetchAdvertisements = async (page = 1) => {
    try {
      const data = await ApiService.getAdminAds({ page, limit: 10 });
      setAdvertisements(data.advertisements || []);
    } catch (err) {
      setError('Failed to load advertisements');
    }
  };

  const fetchLegalDocuments = async () => {
    try {
      const data = await ApiService.getAdminLegalDocuments();
      setLegalDocuments(data || []);
    } catch (err) {
      setError('Failed to load legal documents');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Clear previous errors and success messages
    setError('');
    setSuccess('');
    
    // Load data for the selected tab
    switch (newValue) {
      case 1:
        fetchUsers();
        break;
      case 2:
        fetchContent();
        break;
      case 3:
        fetchCategories();
        break;
      case 4:
        fetchAdvertisements();
        break;
      case 5:
        fetchLegalDocuments();
        break;
      default:
        break;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await ApiService.deleteUser(userId);
        setSuccess('User deleted successfully');
        fetchUsers(userPage);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete user');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await ApiService.deleteAdminContent(contentId);
        setSuccess('Content deleted successfully');
        fetchContent(contentPage);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete content');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      await ApiService.createCategory(categoryForm);
      setSuccess('Category created successfully');
      setCategoryDialogOpen(false);
      setCategoryForm({ name: '', description: '' });
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create category');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await ApiService.deleteCategory(categoryId);
        setSuccess('Category deleted successfully');
        fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete category');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleCreateAd = async () => {
    if (!adForm.title.trim()) {
      setError('Advertisement title is required');
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(adForm).forEach(key => {
        formData.append(key, adForm[key]);
      });

      await ApiService.createAd(formData);
      setSuccess('Advertisement created successfully');
      setAdDialogOpen(false);
      setAdForm({
        title: '',
        description: '',
        link_url: '',
        ad_type: 'banner',
        target_audience: 'all',
        position: 'sidebar_right',
        start_date: '',
        end_date: '',
        priority: 1,
        is_active: true
      });
      fetchAdvertisements();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create advertisement');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await ApiService.deleteAd(adId);
        setSuccess('Advertisement deleted successfully');
        fetchAdvertisements(adPage);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete advertisement');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleCreateLegalDocument = async () => {
    if (!legalForm.title.trim() || !legalForm.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      await ApiService.createLegalDocument(legalForm);
      setSuccess('Legal document created successfully');
      setLegalDialogOpen(false);
      setLegalForm({
        document_type: 'privacy_policy',
        title: '',
        content: '',
        version: '1.0'
      });
      fetchLegalDocuments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create legal document');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Users" />
        <Tab label="Content" />
        <Tab label="Categories" />
        <Tab label="Advertisements" />
        <Tab label="Legal" />
        <Tab label="Settings" />
      </Tabs>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.users?.total || 0}</Typography>
                    <Typography color="textSecondary">Total Users</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VideoIcon color="secondary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.content?.total || 0}</Typography>
                    <Typography color="textSecondary">Content Items</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.classrooms?.total || 0}</Typography>
                    <Typography color="textSecondary">Classrooms</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CampaignIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.advertisements?.active || 0}</Typography>
                    <Typography color="textSecondary">Active Ads</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Analytics Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Growth
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.userGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Content Uploads
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.contentUploads || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Users Tab */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? users.map((userItem) => (
                <TableRow key={userItem.user_id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={userItem.profile_picture_url} sx={{ mr: 2 }}>
                        {userItem.first_name?.[0] || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {userItem.first_name} {userItem.last_name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={userItem.role}
                      size="small"
                      color={userItem.role === 'admin' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{userItem.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={userItem.is_verified ? 'Verified' : 'Unverified'}
                      size="small"
                      color={userItem.is_verified ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(userItem.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteUser(userItem.user_id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Content Tab */}
      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Uploader</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.length > 0 ? content.map((item) => (
                <TableRow key={item.content_id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <Chip label={item.content_type} size="small" />
                  </TableCell>
                  <TableCell>
                    {item.uploader?.first_name} {item.uploader?.last_name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.is_paid ? 'Paid' : 'Free'}
                      size="small"
                      color={item.is_paid ? 'primary' : 'success'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => window.open(item.file_url, '_blank')}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteContent(item.content_id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No content found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Categories Tab */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setCategoryDialogOpen(true)}
          >
            Add Category
          </Button>
        </Box>

        <Grid container spacing={2}>
          {categories.length > 0 ? categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.category_id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{category.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {category.description}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {category.content_count || 0} content items
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCategory(category.category_id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" align="center">
                No categories found. Create your first category!
              </Typography>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Advertisements Tab */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setAdDialogOpen(true)}
          >
            Create Advertisement
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Views</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {advertisements.length > 0 ? advertisements.map((ad) => (
                <TableRow key={ad.ad_id}>
                  <TableCell>{ad.title}</TableCell>
                  <TableCell>
                    <Chip label={ad.ad_type} size="small" />
                  </TableCell>
                  <TableCell>{ad.position}</TableCell>
                  <TableCell>{ad.target_audience}</TableCell>
                  <TableCell>
                    <Chip
                      label={ad.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={ad.is_active ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{ad.view_count || 0}</TableCell>
                  <TableCell>{ad.click_count || 0}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAd(ad.ad_id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No advertisements found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Legal Documents Tab */}
      <TabPanel value={tabValue} index={5}>
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setLegalDialogOpen(true)}
          >
            Create Legal Document
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {legalDocuments.length > 0 ? legalDocuments.map((doc) => (
                <TableRow key={doc.document_id}>
                  <TableCell>
                    <Chip label={doc.document_type} size="small" />
                  </TableCell>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.version}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={doc.is_active ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(doc.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No legal documents found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={6}>
        <Typography variant="h6" gutterBottom>
          System Settings
        </Typography>
        <Typography color="textSecondary">
          System settings management will be implemented here.
        </Typography>
      </TabPanel>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)}>
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
            sx={{ mb: 2, mt: 1 }}
            required
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={categoryForm.description}
            onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCategory} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Advertisement Dialog */}
      <Dialog open={adDialogOpen} onClose={() => setAdDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Advertisement</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={adForm.title}
                onChange={(e) => setAdForm({...adForm, title: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={adForm.description}
                onChange={(e) => setAdForm({...adForm, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Link URL"
                value={adForm.link_url}
                onChange={(e) => setAdForm({...adForm, link_url: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Ad Type</InputLabel>
                <Select
                  value={adForm.ad_type}
                  label="Ad Type"
                  onChange={(e) => setAdForm({...adForm, ad_type: e.target.value})}
                >
                  <MenuItem value="banner">Banner</MenuItem>
                  <MenuItem value="sidebar">Sidebar</MenuItem>
                  <MenuItem value="popup">Popup</MenuItem>
                  <MenuItem value="interstitial">Interstitial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={adForm.target_audience}
                  label="Target Audience"
                  onChange={(e) => setAdForm({...adForm, target_audience: e.target.value})}
                >
                  <MenuItem value="all">All Users</MenuItem>
                  <MenuItem value="students">Students</MenuItem>
                  <MenuItem value="teachers">Teachers</MenuItem>
                  <MenuItem value="parents">Parents</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateAd} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Legal Document Dialog */}
      <Dialog open={legalDialogOpen} onClose={() => setLegalDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Legal Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={legalForm.document_type}
                  label="Document Type"
                  onChange={(e) => setLegalForm({...legalForm, document_type: e.target.value})}
                >
                  <MenuItem value="privacy_policy">Privacy Policy</MenuItem>
                  <MenuItem value="terms_of_service">Terms of Service</MenuItem>
                  <MenuItem value="cookie_policy">Cookie Policy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Version"
                value={legalForm.version}
                onChange={(e) => setLegalForm({...legalForm, version: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={legalForm.title}
                onChange={(e) => setLegalForm({...legalForm, title: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={8}
                value={legalForm.content}
                onChange={(e) => setLegalForm({...legalForm, content: e.target.value})}
                placeholder="Enter the legal document content here..."
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLegalDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateLegalDocument} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboardPage;