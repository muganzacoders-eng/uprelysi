import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Box, Button, TextField, Typography, Container, Paper, Grid } from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('student');


const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  const result = await login({ email, password }); 
  if (!result.success) {
    setError(result.message || 'Login failed');
  }
};

   

// Update Google login handler
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    console.log("Google ID token:", credentialResponse.credential);
    const result = await login({
      // tokenId: credentialResponse.credential,
      tokenId: { credential: credentialResponse.credential },
      role: selectedRole // Pass the selected role
    }, true);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('Google authentication failed');
    }
  } catch (error) {
    setError('Google authentication failed');
  }
  console.log(credentialResponse)
};

  const handleGoogleFailure = () => {
    setError('Google authentication failed');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            </GoogleOAuthProvider>
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Don&apos;t have an account? Sign up
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;



// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { 
//   Box, 
//   Button, 
//   TextField, 
//   Typography, 
//   Container, 
//   Paper, 
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Divider,
//   Alert
// } from '@mui/material';

// function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');h
//   const [error, setError] = useState('');
//   const [selectedRole, setSelectedRole] = useState('stude                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             nt');
//   const [showRoleSelector, setShowRoleSelector] = useState(false);
//   const [pendingGoogleCredential, setPendingGoogleCredential] = useState(null);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     const result = await login({ email, password });
//     if (!result.success) {
//       setError(result.message || 'Login failed');
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       console.log("Google ID token:", credentialResponse.credential);
      
//       // Show role selector for Google login
//       setPendingGoogleCredential(credentialResponse.credential);
//       setShowRoleSelector(true);
      
//     } catch (error) {
//       setError('Google authentication failed');
//     }
//   };

//   const handleRoleConfirmation = async () => {
//     try {
//       const result = await login({
//         tokenId: { credential: pendingGoogleCredential },
//         role: selectedRole
//       }, true);
      
//       if (result.success) {
//         navigate('/dashboard');
//       } else {
//         setError('Google authentication failed');
//       }
//     } catch (error) {
//       setError('Google authentication failed');
//     } finally {
//       setShowRoleSelector(false);
//       setPendingGoogleCredential(null);
//     }
//   };

//   const handleGoogleFailure = () => {
//     setError('Google authentication failed');
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 8 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom align="center">
//           Login
//         </Typography>
        
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {/* Role Selection Dialog for Google Login */}
//         {showRoleSelector && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             <Typography variant="subtitle1" gutterBottom>
//               Please select your role to complete Google sign-in:
//             </Typography>
//             <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
//               <InputLabel>Select Your Role</InputLabel>
//               <Select
//                 value={selectedRole}
//                 label="Select Your Role"
//                 onChange={(e) => setSelectedRole(e.target.value)}
//               >
//                 <MenuItem value="student">Student</MenuItem>
//                 <MenuItem value="teacher">Teacher</MenuItem>
//                 <MenuItem value="expert">Counseling Expert</MenuItem>
//                 <MenuItem value="parent">Parent</MenuItem>
//                 <MenuItem value="admin">Administrator</MenuItem>
//               </Select>
//             </FormControl>
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <Button 
//                 variant="contained" 
//                 onClick={handleRoleConfirmation}
//                 size="small"
//               >
//                 Continue
//               </Button>
//               <Button 
//                 variant="outlined" 
//                 onClick={() => setShowRoleSelector(false)}
//                 size="small"
//               >
//                 Cancel
//               </Button>
//             </Box>
//           </Alert>
//         )}

//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type="password"
//             id="password"
//             autoComplete="current-password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//             disabled={showRoleSelector}
//           >
//             Sign In
//           </Button>

//           <Divider sx={{ my: 2 }}>OR</Divider>

//           <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//             <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
//               <GoogleLogin
//                 onSuccess={handleGoogleSuccess}
//                 onError={handleGoogleFailure}
//                 text="signin_with"
//                 shape="rectangular"
//                 theme="outline"
//                 size="large"
//                 width="100%"
//               />
//             </GoogleOAuthProvider>
//           </Box>

//           <Grid container justifyContent="flex-end">
//             <Grid item>
//               <Link to="/register" style={{ textDecoration: 'none' }}>
//                 <Typography variant="body2" color="primary">
//                   Don't have an account? Sign up
//                 </Typography>
//               </Link>
//             </Grid>
//           </Grid>
//         </Box>
//       </Paper>
//     </Container>
//   );
// }

// export default LoginPage;