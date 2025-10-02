// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   CardMedia,
//   Button,
//   Chip,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Tabs,
//   Tab,
//   IconButton,
//   InputAdornment,
//   Pagination,
//   LinearProgress 
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   VideoLibrary as VideoIcon,
//   PictureAsPdf as PdfIcon,
//   Book as BookIcon,
//   Audiotrack as AudioIcon,
//   Apps as OtherIcon,
//   PlayArrow as PlayIcon,
//   Download as DownloadIcon,
//   Add as AddIcon,
//   Close as CloseIcon 
// } from '@mui/icons-material';
// import { useAuth } from '../../contexts/AuthContext';
// import ApiService from '../../api';

// function TabPanel({ children, value, index, ...other }) {
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`library-tabpanel-${index}`}
//       aria-labelledby={`library-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   value: PropTypes.number.isRequired,
//   index: PropTypes.number.isRequired,
// };

// TabPanel.defaultProps = {
//   children: null,
// };

// function ContentCard({ content, onView, onDownload }) {
//   const getContentIcon = (type) => {
//     switch (type) {
//       case 'video': return <VideoIcon />;
//       case 'pdf': return <PdfIcon />;
//       case 'ebook': return <BookIcon />;
//       case 'audio': return <AudioIcon />;
//       default: return <OtherIcon />;
//     }
//   };

//   const getContentTypeLabel = (type) => {
//     switch (type) {
//       case 'video': return 'Video';
//       case 'pdf': return 'PDF';
//       case 'ebook': return 'E-Book';
//       case 'audio': return 'Audio';
//       default: return 'Other';
//     }
//   };

//   return (
//     <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       {content.thumbnail_url && (
//         <CardMedia
//           component="img"
//           height="140"
//           image={content.thumbnail_url}
//           alt={content.title}
//         />
//       )}
      
//       <CardContent sx={{ flexGrow: 1 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           {getContentIcon(content.content_type)}
//           <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
//             {content.title}
//           </Typography>
//         </Box>

//         <Typography variant="body2" color="textSecondary" paragraph>
//           {content.description}
//         </Typography>

//         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
//           <Chip
//             label={getContentTypeLabel(content.content_type)}
//             size="small"
//             color="primary"
//             variant="outlined"
//           />
//           {content.is_paid && (
//             <Chip
//               label={`$${content.price}`}
//               size="small"
//               color="secondary"
//             />
//           )}
//           {!content.is_paid && (
//             <Chip
//               label="Free"
//               size="small"
//               color="success"
//             />
//           )}
//           {content.duration && (
//             <Chip
//               label={`${Math.floor(content.duration / 60)}m ${content.duration % 60}s`}
//               size="small"
//               variant="outlined"
//             />
//           )}
//         </Box>

//         <Typography variant="caption" color="textSecondary">
//           Uploaded by {content.User?.first_name} {content.User?.last_name}
//         </Typography>
//       </CardContent>

//       <CardActions>
//         <Button
//           size="small"
//           startIcon={<PlayIcon />}
//           onClick={() => onView(content)}
//         >
//           View
//         </Button>
//         <Button
//           size="small"
//           startIcon={<DownloadIcon />}
//           onClick={() => onDownload(content)}
//         >
//           Download
//         </Button>
//       </CardActions>
//     </Card>
//   );
// }

// ContentCard.propTypes = {
//   content: PropTypes.shape({
//     content_id: PropTypes.number.isRequired,
//     title: PropTypes.string.isRequired,
//     description: PropTypes.string,
//     content_type: PropTypes.string.isRequired,
//     file_url: PropTypes.string.isRequired,
//     thumbnail_url: PropTypes.string,
//     is_paid: PropTypes.bool.isRequired,
//     price: PropTypes.number,
//     duration: PropTypes.number,
//     User: PropTypes.shape({
//       first_name: PropTypes.string,
//       last_name: PropTypes.string,
//     }),
//   }).isRequired,
//   onView: PropTypes.func.isRequired,
//   onDownload: PropTypes.func.isRequired,
// };

// function LibraryPage() {
//   const [content, setContent] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [openDialog, setOpenDialog] = useState(false);
//   const [tabValue, setTabValue] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('');
//   const [filterType, setFilterType] = useState('');
//   const [filterPrice, setFilterPrice] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 9;

//   // New state for upload loading
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const { user } = useAuth();

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     content_type: '',
//     file: null,
//     is_paid: false,
//     price: 0,
//     categories: [],
//     duration: 0
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const [contentData, categoriesData] = await Promise.all([
//         ApiService.getLibraryContent(),
//         ApiService.getContentCategories()
//       ]);
      
//       // Ensure content has proper structure
//       const formattedContent = contentData.map(item => ({
//         ...item,
//         type: item.content_type || 'other',
//         category: item.categories?.[0]?.name || 'Uncategorized'
//       }));
      
//       setContent(formattedContent);
//       setCategories(categoriesData);
//     } catch (err) {
//       console.error('Error fetching library data:', err);
//       setError('Failed to load library content. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//     setCurrentPage(1);
//   };

//   const handleFilterChange = (filterType, value) => {
//     switch (filterType) {
//       case 'category':
//         setFilterCategory(value);
//         break;
//       case 'type':
//         setFilterType(value);
//         break;
//       case 'price':
//         setFilterPrice(value);
//         break;
//       default:
//         break;
//     }
//     setCurrentPage(1);
//   };

//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     // Don't allow closing dialog during upload
//     if (uploadLoading) return;
    
//     setOpenDialog(false);
//     setFormData({
//       title: '',
//       description: '',
//       content_type: '',
//       file: null,
//       is_paid: false,
//       price: 0,
//       categories: [],
//       duration: 0
//     });
//     setUploadProgress(0);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, files } = e.target;
    
//     if (type === 'file') {
//       setFormData(prev => ({
//         ...prev,
//         file: files[0]
//       }));
//     } else if (type === 'checkbox') {
//       setFormData(prev => ({
//         ...prev,
//         [name]: e.target.checked
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleSubmitContent = async (e) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!formData.file) {
//       setError('Please select a file to upload');
//       return;
//     }
    
//     try {
//       setUploadLoading(true);
//       setUploadProgress(0);
      
//       // Create a progress callback for the upload
//       const onUploadProgress = (progressEvent) => {
//         const percentCompleted = Math.round(
//           (progressEvent.loaded * 100) / progressEvent.total
//         );
//         setUploadProgress(percentCompleted);
//       };
      
//       // Call the API service with progress callback
//       await ApiService.uploadContent(formData, onUploadProgress);
      
//       setSuccess('Content uploaded successfully!');
//       setOpenDialog(false);
//       fetchData(); // Refresh the content list
      
//       // Reset form
//       setFormData({
//         title: '',
//         description: '',
//         content_type: '',
//         file: null,
//         is_paid: false,
//         price: 0,
//         categories: [],
//         duration: 0
//       });
//       setUploadProgress(0);
      
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       console.error('Error uploading content:', err);
//       setError('Failed to upload content. Please try again.');
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const handleViewContent = (contentItem) => {
//     window.open(contentItem.file_url, '_blank');
//   };

//   const handleDownloadContent = (contentItem) => {
//     const link = document.createElement('a');
//     link.href = contentItem.file_url;
//     link.download = contentItem.title;
//     link.target = '_blank';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handlePurchaseContent = async (contentId) => {
//     try {
//       await ApiService.purchaseContent(contentId);
//       setSuccess('Content purchased successfully!');
//       fetchData(); // Refresh to update purchase status
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       console.error('Error purchasing content:', err);
//       setError('Failed to purchase content. Please try again.');
//     }
//   };

//   // Filter and search content
//   const filteredContent = content.filter(item => {
//     const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesCategory = !filterCategory || item.categories?.includes(parseInt(filterCategory));
//     const matchesType = !filterType || item.content_type === filterType;
//     const matchesPrice = filterPrice === '' || 
//                         (filterPrice === 'free' && !item.is_paid) ||
//                         (filterPrice === 'paid' && item.is_paid);

//     return matchesSearch && matchesCategory && matchesType && matchesPrice;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
//   const paginatedContent = filteredContent.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4">Library</Typography>
//         {user?.role === 'teacher' && (
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={handleOpenDialog}
//           >
//             Upload Content
//           </Button>
//         )}
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
//           {success}
//         </Alert>
//       )}

//       {/* Search and Filters */}
//       <Paper sx={{ p: 2, mb: 3 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={4}>
//             <TextField
//               fullWidth
//               placeholder="Search content..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={2}>
//             <FormControl fullWidth>
//               <InputLabel>Category</InputLabel>
//               <Select
//                 value={filterCategory}
//                 label="Category"
//                 onChange={(e) => handleFilterChange('category', e.target.value)}
//               >
//                 <MenuItem value="">All Categories</MenuItem>
//                 {categories.map((category) => (
//                   <MenuItem key={category.category_id} value={category.category_id}>
//                     {category.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} md={2}>
//             <FormControl fullWidth>
//               <InputLabel>Type</InputLabel>
//               <Select
//                 value={filterType}
//                 label="Type"
//                 onChange={(e) => handleFilterChange('type', e.target.value)}
//               >
//                 <MenuItem value="">All Types</MenuItem>
//                 <MenuItem value="video">Video</MenuItem>
//                 <MenuItem value="pdf">PDF</MenuItem>
//                 <MenuItem value="ebook">E-Book</MenuItem>
//                 <MenuItem value="audio">Audio</MenuItem>
//                 <MenuItem value="other">Other</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} md={2}>
//             <FormControl fullWidth>
//               <InputLabel>Price</InputLabel>
//               <Select
//                 value={filterPrice}
//                 label="Price"
//                 onChange={(e) => handleFilterChange('price', e.target.value)}
//               >
//                 <MenuItem value="">All</MenuItem>
//                 <MenuItem value="free">Free</MenuItem>
//                 <MenuItem value="paid">Paid</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>
//       </Paper>

//       <Paper>
//         <Tabs value={tabValue} onChange={handleTabChange}>
//           <Tab label="All Content" />
//           <Tab label="Videos" />
//           <Tab label="Documents" />
//           <Tab label="My Content" />
//         </Tabs>

//         <TabPanel value={tabValue} index={0}>
//           <ContentGrid
//             content={paginatedContent}
//             onView={handleViewContent}
//             onDownload={handleDownloadContent}
//             onPurchase={handlePurchaseContent}
//             user={user}
//           />
//         </TabPanel>

//         <TabPanel value={tabValue} index={1}>
//           <ContentGrid
//             content={paginatedContent.filter(item => item.content_type === 'video')}
//             onView={handleViewContent}
//             onDownload={handleDownloadContent}
//             onPurchase={handlePurchaseContent}
//             user={user}
//           />
//         </TabPanel>

//         <TabPanel value={tabValue} index={2}>
//           <ContentGrid
//             content={paginatedContent.filter(item => ['pdf', 'ebook'].includes(item.content_type))}
//             onView={handleViewContent}
//             onDownload={handleDownloadContent}
//             onPurchase={handlePurchaseContent}
//             user={user}
//           />
//         </TabPanel>

//         <TabPanel value={tabValue} index={3}>
//           <ContentGrid
//             content={paginatedContent.filter(item => item.uploaded_by === user?.user_id)}
//             onView={handleViewContent}
//             onDownload={handleDownloadContent}
//             onPurchase={handlePurchaseContent}
//             user={user}
//           />
//         </TabPanel>
//       </Paper>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
//           <Pagination
//             count={totalPages}
//             page={currentPage}
//             onChange={(event, page) => setCurrentPage(page)}
//             color="primary"
//           />
//         </Box>
//       )}

//       {/* Upload Content Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
//         <DialogTitle>
//           Upload Educational Content
//           {uploadLoading && (
//             <IconButton
//               aria-label="close"
//               onClick={handleCloseDialog}
//               sx={{
//                 position: 'absolute',
//                 right: 8,
//                 top: 8,
//                 color: (theme) => theme.palette.grey[500],
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           )}
//         </DialogTitle>
        
//         {/* Upload Progress Bar */}
//         {uploadLoading && (
//           <LinearProgress 
//             variant="determinate" 
//             value={uploadProgress} 
//             sx={{ width: '100%' }}
//           />
//         )}
        
//         <form onSubmit={handleSubmitContent}>
//           <DialogContent>
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   required
//                   name="title"
//                   label="Title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   disabled={uploadLoading}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={3}
//                   name="description"
//                   label="Description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   disabled={uploadLoading}
//                 />
//               </Grid>

//               {categories.length > 0 && (
//   <Grid item xs={12} sm={6}>
//     <FormControl fullWidth disabled={uploadLoading}>
//       <InputLabel>Category</InputLabel>
//       <Select
//         name="categories"
//         value={formData.categories || ''} // Single value
//         label="Category"
//         onChange={(e) =>
//           setFormData((prev) => ({
//             ...prev,
//             categories: e.target.value, // Store only one category ID
//           }))
//         }
//       >
//         {categories.map((category) => (
//           <MenuItem key={category.category_id} value={category.category_id}>
//             {category.name}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   </Grid>
// )}


//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth required disabled={uploadLoading}>
//                   <InputLabel>Content Type</InputLabel>
//                   <Select
//                     name="content_type"
//                     value={formData.content_type}
//                     label="Content Type"
//                     onChange={handleInputChange}
//                   >
//                     <MenuItem value="video">Video</MenuItem>
//                     <MenuItem value="pdf">PDF</MenuItem>
//                     <MenuItem value="ebook">E-Book</MenuItem>
//                     <MenuItem value="audio">Audio</MenuItem>
//                     <MenuItem value="other">Other</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   type="file"
//                   name="file"
//                   onChange={handleInputChange}
//                   InputLabelProps={{ shrink: true }}
//                   disabled={uploadLoading}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth disabled={uploadLoading}>
//                   <InputLabel>Price Type</InputLabel>
//                   <Select
//                     name="is_paid"
//                     value={formData.is_paid ? 'paid' : 'free'}
//                     label="Price Type"
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       is_paid: e.target.value === 'paid',
//                       price: e.target.value === 'paid' ? prev.price : 0
//                     }))}
//                   >
//                     <MenuItem value="free">Free</MenuItem>
//                     <MenuItem value="paid">Paid</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {formData.is_paid && (
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     type="number"
//                     name="price"
//                     label="Price ($)"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     inputProps={{ min: 0, step: 0.01 }}
//                     disabled={uploadLoading}
//                   />
//                 </Grid>
//               )}

//               {formData.content_type === 'video' && (
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     type="number"
//                     name="duration"
//                     label="Duration (seconds)"
//                     value={formData.duration}
//                     onChange={handleInputChange}
//                     inputProps={{ min: 0 }}
//                     disabled={uploadLoading}
//                   />
//                 </Grid>
//               )}
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog} disabled={uploadLoading}>
//               Cancel
//             </Button>
//             <Button 
//               type="submit" 
//               variant="contained" 
//               disabled={uploadLoading || !formData.file}
//               startIcon={uploadLoading ? <CircularProgress size={20} /> : null}
//             >
//               {uploadLoading ? `Uploading... ${uploadProgress}%` : 'Upload Content'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </Box>
//   );
// }

// function ContentGrid({ content, onView, onDownload, onPurchase, user }) {
//   if (content.length === 0) {
//     return (
//       <Box sx={{ p: 3, textAlign: 'center' }}>
//         <Typography color="textSecondary">No content found</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Grid container spacing={3} sx={{ p: 3 }}>
//       {content.map((item) => (
//         <Grid item xs={12} sm={6} md={4} key={item.content_id}>
//           <ContentCard
//             content={item}
//             onView={onView}
//             onDownload={onDownload}
//           />
//         </Grid>
//       ))}
//     </Grid>
//   );
// }

// ContentGrid.propTypes = {
//   content: PropTypes.array.isRequired,
//   onView: PropTypes.func.isRequired,
//   onDownload: PropTypes.func.isRequired,
//   onPurchase: PropTypes.func.isRequired,
//   user: PropTypes.object,
// };

// export default LibraryPage;



import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Pagination,
  LinearProgress 
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  VideoLibrary as VideoIcon,
  PictureAsPdf as PdfIcon,
  Book as BookIcon,
  Audiotrack as AudioIcon,
  Apps as OtherIcon,
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Close as CloseIcon 
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`library-tabpanel-${index}`}
      aria-labelledby={`library-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

TabPanel.defaultProps = {
  children: null,
};

function ContentCard({ content, onView, onDownload }) {
  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return <VideoIcon />;
      case 'pdf': return <PdfIcon />;
      case 'ebook': return <BookIcon />;
      case 'audio': return <AudioIcon />;
      default: return <OtherIcon />;
    }
  };

  const getContentTypeLabel = (type) => {
    switch (type) {
      case 'video': return 'Video';
      case 'pdf': return 'PDF';
      case 'ebook': return 'E-Book';
      case 'audio': return 'Audio';
      default: return 'Other';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {content.thumbnail_url && (
        <CardMedia
          component="img"
          height="140"
          image={content.thumbnail_url}
          alt={content.title}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getContentIcon(content.content_type)}
          <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
            {content.title}
          </Typography>
        </Box>

        <Typography variant="body2" color="textSecondary" paragraph>
          {content.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          <Chip
            label={getContentTypeLabel(content.content_type)}
            size="small"
            color="primary"
            variant="outlined"
          />
          {content.is_paid && (
            <Chip
              label={`$${content.price}`}
              size="small"
              color="secondary"
            />
          )}
          {!content.is_paid && (
            <Chip
              label="Free"
              size="small"
              color="success"
            />
          )}
          {content.duration && (
            <Chip
              label={`${Math.floor(content.duration / 60)}m ${content.duration % 60}s`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        <Typography variant="caption" color="textSecondary">
          Uploaded by {content.User?.first_name} {content.User?.last_name}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          startIcon={<PlayIcon />}
          onClick={() => onView(content)}
        >
          View
        </Button>
        <Button
          size="small"
          startIcon={<DownloadIcon />}
          onClick={() => onDownload(content)}
        >
          Download
        </Button>
      </CardActions>
    </Card>
  );
}

ContentCard.propTypes = {
  content: PropTypes.shape({
    content_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    content_type: PropTypes.string.isRequired,
    file_url: PropTypes.string.isRequired,
    thumbnail_url: PropTypes.string,
    is_paid: PropTypes.bool.isRequired,
    price: PropTypes.number,
    duration: PropTypes.number,
    User: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

function LibraryPage() {
  const [content, setContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Upload states
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: '',
    file: null,
    is_paid: false,
    price: 0,
    categories: [],
    duration: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [contentData, categoriesData] = await Promise.all([
        ApiService.getLibraryContent(),
        ApiService.getContentCategories()
      ]);
      
      const formattedContent = contentData.map(item => ({
        ...item,
        type: item.content_type || 'other',
        category: item.categories?.[0]?.name || 'Uncategorized'
      }));
      
      setContent(formattedContent);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching library data:', err);
      setError('Failed to load library content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'category':
        setFilterCategory(value);
        break;
      case 'type':
        setFilterType(value);
        break;
      case 'price':
        setFilterPrice(value);
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (uploadLoading) return;
    
    setOpenDialog(false);
    setFormData({
      title: '',
      description: '',
      content_type: '',
      file: null,
      is_paid: false,
      price: 0,
      categories: [],
      duration: 0
    });
    setUploadProgress(0);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        file: files[0]
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitContent = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setUploadLoading(true);
      setUploadProgress(0);
      
      const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      };
      
      await ApiService.uploadContent(formData, onUploadProgress);
      
      setSuccess('Content uploaded successfully!');
      setOpenDialog(false);
      fetchData();
      
      setFormData({
        title: '',
        description: '',
        content_type: '',
        file: null,
        is_paid: false,
        price: 0,
        categories: [],
        duration: 0
      });
      setUploadProgress(0);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error uploading content:', err);
      setError('Failed to upload content. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleViewContent = (contentItem) => {
    window.open(contentItem.file_url, '_blank');
  };

  const handleDownloadContent = (contentItem) => {
    const link = document.createElement('a');
    link.href = contentItem.file_url;
    link.download = contentItem.title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and search content
  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || item.categories?.includes(parseInt(filterCategory));
    const matchesType = !filterType || item.content_type === filterType;
    const matchesPrice = filterPrice === '' || 
                        (filterPrice === 'free' && !item.is_paid) ||
                        (filterPrice === 'paid' && item.is_paid);

    return matchesSearch && matchesCategory && matchesType && matchesPrice;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Library</Typography>
        {user?.role === 'teacher' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Upload Content
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search content..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="ebook">E-Book</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Price</InputLabel>
              <Select
                value={filterPrice}
                label="Price"
                onChange={(e) => handleFilterChange('price', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Content" />
          <Tab label="Videos" />
          <Tab label="Documents" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <ContentGrid
            content={paginatedContent}
            onView={handleViewContent}
            onDownload={handleDownloadContent}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ContentGrid
            content={paginatedContent.filter(item => item.content_type === 'video')}
            onView={handleViewContent}
            onDownload={handleDownloadContent}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ContentGrid
            content={paginatedContent.filter(item => ['pdf', 'ebook'].includes(item.content_type))}
            onView={handleViewContent}
            onDownload={handleDownloadContent}
          />
        </TabPanel>
      </Paper>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}

      {/* Upload Content Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Upload Educational Content
          {uploadLoading && (
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        
        {uploadLoading && (
          <LinearProgress 
            variant="determinate" 
            value={uploadProgress} 
            sx={{ width: '100%' }}
          />
        )}
        
        <form onSubmit={handleSubmitContent}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="title"
                  label="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={uploadLoading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={uploadLoading}
                />
              </Grid>

              {categories.length > 0 && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={uploadLoading}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="categories"
                      value={formData.categories || ''}
                      label="Category"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          categories: e.target.value,
                        }))
                      }
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.category_id} value={category.category_id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={uploadLoading}>
                  <InputLabel>Content Type</InputLabel>
                  <Select
                    name="content_type"
                    value={formData.content_type}
                    label="Content Type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="ebook">E-Book</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="file"
                  name="file"
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  disabled={uploadLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={uploadLoading}>
                  <InputLabel>Price Type</InputLabel>
                  <Select
                    name="is_paid"
                    value={formData.is_paid ? 'paid' : 'free'}
                    label="Price Type"
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      is_paid: e.target.value === 'paid',
                      price: e.target.value === 'paid' ? prev.price : 0
                    }))}
                  >
                    <MenuItem value="free">Free</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formData.is_paid && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    name="price"
                    label="Price ($)"
                    value={formData.price}
                    onChange={handleInputChange}
                    inputProps={{ min: 0, step: 0.01 }}
                    disabled={uploadLoading}
                  />
                </Grid>
              )}

              {formData.content_type === 'video' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    name="duration"
                    label="Duration (seconds)"
                    value={formData.duration}
                    onChange={handleInputChange}
                    inputProps={{ min: 0 }}
                    disabled={uploadLoading}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={uploadLoading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={uploadLoading || !formData.file}
              startIcon={uploadLoading ? <CircularProgress size={20} /> : null}
            >
              {uploadLoading ? `Uploading... ${uploadProgress}%` : 'Upload Content'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

function ContentGrid({ content, onView, onDownload }) {
  if (content.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">No content found</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {content.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.content_id}>
          <ContentCard
            content={item}
            onView={onView}
            onDownload={onDownload}
          />
        </Grid>
      ))}
    </Grid>
  );
}

ContentGrid.propTypes = {
  content: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default LibraryPage;