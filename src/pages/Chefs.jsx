
// import React, { useState, useEffect } from 'react';
// import Layout from '../components/Layout/Layout';
// import {
//   Box,
//   Card,
//   CardContent,
//   CardMedia,
//   Grid,
//   Typography,
//   Button,
//   Modal,
//   TextField,
//   IconButton,
//   Input,
// } from '@mui/material';
// import StarIcon from '@mui/icons-material/Star';
// import CloseIcon from '@mui/icons-material/Close';

// const Chefs = () => {
//   const [chef, setChef] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [newChef, setNewChef] = useState({
//     name: '',
//     speciality: '',
//     experience: '',
//     rating: 0,
//     description: '',
//     image: null, // Initially set to null
//   });

//   // Fetch the list of chefs when the component mounts
//   useEffect(() => {
//     const fetchChefs = async () => {
//       try {
//         const response = await fetch('http://localhost:8071/chef/showchefs');
//         if (!response.ok) {
//           throw new Error('Failed to fetch chef details');
//         }
//         const data = await response.json();
//         setChef(data.chef); // Assuming the response contains an array of chefs
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchChefs();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewChef({
//       ...newChef,
//       [name]: value,
//     });
//   };

//   const handleImageChange = (e) => {
//     setNewChef({
//       ...newChef,
//       image: e.target.files[0], // Get the selected image file
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Check that all required fields are populated
//     if (!newChef.name || !newChef.speciality || !newChef.experience || !newChef.rating || !newChef.image || !newChef.description) {
//       alert("Please fill all fields.");
//       return;
//     }
    
//     const formData = new FormData();
//     formData.append('name', newChef.name);
//     formData.append('speciality', newChef.speciality);
//     formData.append('experience', newChef.experience);
//     formData.append('rating', newChef.rating);
//     formData.append('description', newChef.description);
//     formData.append('image', newChef.image);

//     try {
//       const response = await fetch('http://localhost:8071/chef/addchef', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add chef');
//       }

//       const data = await response.json();
//       setChef((prev) => [...prev, data.chef]); // Add new chef to the list

//       setOpenModal(false);
//       setNewChef({
//         name: '',
//         speciality: '',
//         experience: '',
//         rating: 0,
//         description: '',
//         image: null,
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     
//       <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#f7f7f7' }}>
//         <Typography variant="h3" gutterBottom>
//           Meet Our Chefs
//         </Typography>
//         <Typography variant="subtitle1" color="textSecondary" gutterBottom>
//           Our talented chefs bring the best of culinary artistry to your table.
//         </Typography>
//       </Box>

      

//       {/* Display Chefs */}
//       <Grid container spacing={4} sx={{ p: 4 }}>
//         {chef.map((c) => (
//           <Grid item xs={12} sm={6} md={4} key={c._id}>
//             <Card sx={{ maxWidth: 345, mx: 'auto', boxShadow: 3 }}>
//               <CardMedia component="img" height="200" image={`https://restaurant-app-three-pied.vercel.app${c.imageURL}`} alt={c.name} />
//               <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//                   <Typography gutterBottom variant="h5" component="div">
//                     {c.name}
//                   </Typography>
//                   <Box sx={{ display: 'flex', alignItems: 'center', color: '#f39c12' }}>
//                     <StarIcon />
//                     <Typography variant="body1" sx={{ ml: 0.5 }}>
//                       {c.rating}
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Typography variant="body2" color="textSecondary">
//                   <strong>Specialty:</strong> {c.speciality}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   <strong>Experience:</strong> {c.experience} years
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
//                   {c.description}
//                 </Typography>
//                 {/* <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
//                   View More
//                 </Button> */}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     
//   );
// };

// export default Chefs;


//mobile
import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout/Layout';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
  Rating,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import { useUser } from '../contextAPI/context';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const Chefs = () => {
  const {role} = useUser();
  const [chef, setChef] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newChef, setNewChef] = useState({
    name: '',
    speciality: '',
    experience: '',
    rating: 0,
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/chef/showchefs`);
        if (!response.ok) throw new Error('Failed to fetch chef details');
        const data = await response.json();
        setChef(data.chef);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChefs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewChef((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setNewChef((prev) => ({
      ...prev,
      rating: newValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewChef((prev) => ({
        ...prev,
        image: file,
      }));

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newChef.name ||
      !newChef.speciality ||
      !newChef.experience ||
      !newChef.rating ||
      !newChef.image ||
      !newChef.description
    ) {
      alert('Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newChef.name);
    formData.append('speciality', newChef.speciality);
    formData.append('experience', newChef.experience);
    formData.append('rating', newChef.rating);
    formData.append('description', newChef.description);
    formData.append('image', newChef.image);

    try {
      const response = await fetch(`${BACKEND_API_URL}/chef/addchef`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add chef');

      const data = await response.json();
      setChef((prev) => [...prev, data.chef]);
      setOpenModal(false);
      setNewChef({
        name: '',
        speciality: '',
        experience: '',
        rating: 0,
        description: '',
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#f7f7f7' }}>
        <Typography variant="h3" gutterBottom>
          Meet Our Chefs
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Our talented chefs bring the best of culinary artistry to your table.
        </Typography>
        {
          role === 'ADMIN' && (
            <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ mt: 3 }}
        >
          Add New Chef
        </Button>
          )
        }
      </Box>

      <Grid container spacing={4} sx={{ p: 4 }}>
        {chef.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c._id}>
            <Card sx={{ maxWidth: 345, mx: 'auto', boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={`${c.imageURL}`}
                alt={c.name}
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography gutterBottom variant="h5" component="div">
                    {c.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#f39c12' }}>
                    <StarIcon />
                    <Typography variant="body1" sx={{ ml: 0.5 }}>
                      {c.rating}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  <strong>Specialty:</strong> {c.speciality}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Experience:</strong> {c.experience} years
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  {c.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for adding new chef */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box component="form" onSubmit={handleSubmit} sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Add New Chef</Typography>
            <IconButton onClick={() => setOpenModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newChef.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Speciality"
            name="speciality"
            value={newChef.speciality}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Experience (years)"
            name="experience"
            type="number"
            value={newChef.experience}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 0 }}
          />

          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={newChef.rating}
              onChange={handleRatingChange}
              precision={0.5}
              size="large"
              sx={{ mt: 1 }}
            />
          </Box>

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newChef.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            required
          />

          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {imagePreview && (
            <Box sx={{ mt: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 4 }}
              />
            </Box>
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Add Chef
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Chefs;
