
// import React, { useState } from 'react';
// import { Container, Typography, TextField, Button, Box, Rating, Alert, CircularProgress, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// import { EmojiEmotions, SentimentVeryDissatisfied, SentimentNeutral, SentimentSatisfiedAlt } from '@mui/icons-material';
// import { useUser } from '../contextAPI/context';
// import Layout from '../components/Layout/Layout';

// const ReviewPage = () => {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [foodRating, setFoodRating] = useState(null);
//   const [serviceRating, setServiceRating] = useState(null);
//   const [atmosphereRating, setAtmosphereRating] = useState(null);
//   const [dateOfVisit, setDateOfVisit] = useState('');
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false); // Dialog visibility
//   const maxCommentLength = 300;
//   const { email } = useUser();

//   const handleSubmit = () => {
//     if (rating === 0 || comment.trim() === '' || !foodRating || !serviceRating || !atmosphereRating || !dateOfVisit) {
//       setError(true);
//       return;
//     }

//     setLoading(true);
//     setError(false);

//     const formData = new FormData();
//     formData.append('rating', rating);
//     formData.append('comment', comment);
//     formData.append('foodRating', foodRating);
//     formData.append('serviceRating', serviceRating);
//     formData.append('atmosphereRating', atmosphereRating);
//     formData.append('dateOfVisit', dateOfVisit);
//     formData.append('customerName', email);
//     if (file) {
//       formData.append('image', file);
//     }

//     fetch('http://localhost:8071/reviews', {
//       method: 'POST',
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setSubmitted(true);
//         setLoading(false);
//         handleClear()
//         setOpenDialog(true); // Open dialog on successful submission
//       })
//       .catch((error) => {
//         setError(true);
//         setLoading(false);
//       });
//   };

//   const handleClear = () => {
//     setRating(0);
//     setComment('');
//     setFoodRating(null);
//     setServiceRating(null);
//     setAtmosphereRating(null);
//     setDateOfVisit('');
//     setFile(null);
//     setError(false);
//     setSubmitted(false);
//   };

//   const handleFileChange = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (uploadedFile) {
//       setFile(uploadedFile);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFilePreview(reader.result);
//       };
//       reader.readAsDataURL(uploadedFile);
//     }
//   };

//   return (
//     
//       <Container maxWidth="sm">
//         <Box sx={{ my: 4, padding: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
//           <Typography variant="h4" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
//             Rate Your Experience
//           </Typography>

//           <Typography variant="h6" color="textSecondary" gutterBottom>
//             How would you rate the service at our restaurant?
//           </Typography>

//           <Box sx={{ mb: 3 }}>
//             <Rating
//               name="rating"
//               value={rating}
//               onChange={(event, newValue) => setRating(newValue)}
//               precision={0.5}
//               size="large"
//               sx={{ color: '#ff9800' }}
//             />
//           </Box>

//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               Please provide all required fields before submitting.
//             </Alert>
//           )}

//           <TextField
//             label="Leave a comment"
//             multiline
//             rows={4}
//             variant="outlined"
//             fullWidth
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             sx={{ mb: 3 }}
//             helperText={`${comment.length}/${maxCommentLength} characters`}
//             inputProps={{ maxLength: maxCommentLength }}
//           />

//           <Box sx={{ mb: 3 }}>
//             <Typography variant="h6">How would you rate the Food?</Typography>
//             <Box>
//               <Tooltip title="Excellent">
//                 <IconButton onClick={() => setFoodRating('😍')}>
//                   <EmojiEmotions color={foodRating === '😍' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Good">
//                 <IconButton onClick={() => setFoodRating('😊')}>
//                   <SentimentSatisfiedAlt color={foodRating === '😊' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Neutral">
//                 <IconButton onClick={() => setFoodRating('😐')}>
//                   <SentimentNeutral color={foodRating === '😐' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Bad">
//                 <IconButton onClick={() => setFoodRating('😞')}>
//                   <SentimentVeryDissatisfied color={foodRating === '😞' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Box>

//           <Box sx={{ mb: 3 }}>
//             <Typography variant="h6">How would you rate the Service?</Typography>
//             <Box>
//               <Tooltip title="Excellent">
//                 <IconButton onClick={() => setServiceRating('😍')}>
//                   <EmojiEmotions color={serviceRating === '😍' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Good">
//                 <IconButton onClick={() => setServiceRating('😊')}>
//                   <SentimentSatisfiedAlt color={serviceRating === '😊' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Neutral">
//                 <IconButton onClick={() => setServiceRating('😐')}>
//                   <SentimentNeutral color={serviceRating === '😐' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Bad">
//                 <IconButton onClick={() => setServiceRating('😞')}>
//                   <SentimentVeryDissatisfied color={serviceRating === '😞' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Box>

//           <Box sx={{ mb: 3 }}>
//             <Typography variant="h6">How would you rate the Atmosphere?</Typography>
//             <Box>
//               <Tooltip title="Excellent">
//                 <IconButton onClick={() => setAtmosphereRating('😍')}>
//                   <EmojiEmotions color={atmosphereRating === '😍' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Good">
//                 <IconButton onClick={() => setAtmosphereRating('😊')}>
//                   <SentimentSatisfiedAlt color={atmosphereRating === '😊' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Neutral">
//                 <IconButton onClick={() => setAtmosphereRating('😐')}>
//                   <SentimentNeutral color={atmosphereRating === '😐' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Bad">
//                 <IconButton onClick={() => setAtmosphereRating('😞')}>
//                   <SentimentVeryDissatisfied color={atmosphereRating === '😞' ? 'primary' : 'default'} />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Box>

//           <TextField
//             label="Date of Visit"
//             type="date"
//             variant="outlined"
//             fullWidth
//             value={dateOfVisit}
//             onChange={(e) => setDateOfVisit(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             sx={{ mb: 3 }}
//           />

//           <Box sx={{ mb: 3 }}>
//             <Button variant="outlined" component="label" fullWidth>
//               Upload a photo
//               <input type="file" hidden onChange={handleFileChange} accept="image/*" />
//             </Button>
//             {file && <Typography variant="body2" sx={{ mt: 1 }}>File: {file.name}</Typography>}
//             {filePreview && (
//               <Box sx={{ mt: 2 }}>
//                 <img src={filePreview} alt="File Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
//               </Box>
//             )}
//           </Box>

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSubmit}
//             fullWidth
//             disabled={rating === 0 || comment.trim() === '' || !foodRating || !serviceRating || !atmosphereRating || !dateOfVisit}
//           >
//             {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Review'}
//           </Button>

//           <Button
//             variant="outlined"
//             color="secondary"
//             onClick={handleClear}
//             fullWidth
//             sx={{ mt: 2 }}
//           >
//             Clear Form
//           </Button>

//           <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//             <DialogTitle>Thank You for Your Feedback!</DialogTitle>
//             <DialogContent>
//             <Box sx={{display:'flex',justifyContent:'center'}}>
//             <span style={{ fontSize: '5rem',textAlign:'center' }}>🎉</span>
//             </Box>
//               <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              
//                 Your review has been submitted successfully. 
//               </Typography>
//               <Typography variant="body2" color="textSecondary" align="center">
//                 We appreciate your feedback and will work to improve your experience.
//               </Typography>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenDialog(false)} color="primary">
//                 Close
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       </Container>
//     
//   );
// };

// export default ReviewPage;

//mobile
import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Rating,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  EmojiEmotions,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  SentimentSatisfiedAlt
} from '@mui/icons-material';
import { useUser } from '../contextAPI/context';
import Layout from '../components/Layout/Layout';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [foodRating, setFoodRating] = useState(null);
  const [serviceRating, setServiceRating] = useState(null);
  const [atmosphereRating, setAtmosphereRating] = useState(null);
  const [dateOfVisit, setDateOfVisit] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const maxCommentLength = 300;
  const { email } = useUser();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = () => {
    if (
      rating === 0 ||
      comment.trim() === '' ||
      !foodRating ||
      !serviceRating ||
      !atmosphereRating ||
      !dateOfVisit
    ) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);
    formData.append('foodRating', foodRating);
    formData.append('serviceRating', serviceRating);
    formData.append('atmosphereRating', atmosphereRating);
    formData.append('dateOfVisit', dateOfVisit);
    formData.append('customerName', email);
    if (file) {
      formData.append('image', file);
    }

    fetch(`${BACKEND_API_URL}/reviews`, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then(() => {
        setSubmitted(true);
        setLoading(false);
        handleClear();
        setOpenDialog(true);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  const handleClear = () => {
    setRating(0);
    setComment('');
    setFoodRating(null);
    setServiceRating(null);
    setAtmosphereRating(null);
    setDateOfVisit('');
    setFile(null);
    setError(false);
    setSubmitted(false);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const renderEmojiRating = (currentValue, setValue) => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1
      }}
    >
      <Tooltip title="Excellent">
        <IconButton onClick={() => setValue('😍')}>
          <EmojiEmotions color={currentValue === '😍' ? 'primary' : 'default'} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Good">
        <IconButton onClick={() => setValue('😊')}>
          <SentimentSatisfiedAlt color={currentValue === '😊' ? 'primary' : 'default'} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Neutral">
        <IconButton onClick={() => setValue('😐')}>
          <SentimentNeutral color={currentValue === '😐' ? 'primary' : 'default'} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Bad">
        <IconButton onClick={() => setValue('😞')}>
          <SentimentVeryDissatisfied color={currentValue === '😞' ? 'primary' : 'default'} />
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    
      <Container maxWidth="sm" sx={{ px: isMobile ? 2 : 4 }}>
        <Box
          sx={{
            my: 4,
            p: isMobile ? 2 : 3,
            backgroundColor: '#f5f5f5',
            borderRadius: 2
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            gutterBottom
            sx={{ color: '#3f51b5', fontWeight: 'bold', textAlign: isMobile ? 'center' : 'left' }}
          >
            Rate Your Experience
          </Typography>

          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            color="textSecondary"
            gutterBottom
            sx={{ textAlign: isMobile ? 'center' : 'left' }}
          >
            How would you rate the service at our restaurant?
          </Typography>

          <Box sx={{ mb: 3, display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={0.5}
              size={isMobile ? 'medium' : 'large'}
              sx={{ color: '#ff9800' }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please provide all required fields before submitting.
            </Alert>
          )}

          <TextField
            label="Leave a comment"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 3 }}
            helperText={`${comment.length}/${maxCommentLength} characters`}
            inputProps={{ maxLength: maxCommentLength }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">How would you rate the Food?</Typography>
            {renderEmojiRating(foodRating, setFoodRating)}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">How would you rate the Service?</Typography>
            {renderEmojiRating(serviceRating, setServiceRating)}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">How would you rate the Atmosphere?</Typography>
            {renderEmojiRating(atmosphereRating, setAtmosphereRating)}
          </Box>

          <TextField
            label="Date of Visit"
            type="date"
            variant="outlined"
            fullWidth
            value={dateOfVisit}
            onChange={(e) => setDateOfVisit(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Button variant="outlined" component="label" fullWidth>
              Upload a photo
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
            {file && <Typography variant="body2" sx={{ mt: 1 }}>File: {file.name}</Typography>}
            {filePreview && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <img
                  src={filePreview}
                  alt="File Preview"
                  style={{
                    maxWidth: '100%',
                    borderRadius: '8px',
                    height: 'auto'
                  }}
                />
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            disabled={
              rating === 0 ||
              comment.trim() === '' ||
              !foodRating ||
              !serviceRating ||
              !atmosphereRating ||
              !dateOfVisit
            }
            sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Review'}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClear}
            fullWidth
            sx={{ mt: 2, fontSize: isMobile ? '0.9rem' : '1rem' }}
          >
            Clear Form
          </Button>

          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle sx={{ textAlign: 'center' }}>Thank You for Your Feedback!</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <span style={{ fontSize: '5rem' }}>🎉</span>
              </Box>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Your review has been submitted successfully.
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                We appreciate your feedback and will work to improve your experience.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    
  );
};

export default ReviewPage;

