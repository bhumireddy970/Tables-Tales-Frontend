import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import CallIcon from "@mui/icons-material/Call";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Typography,
  Container,
  Stack,
  Paper,
  TextField,
  Button,
  Fade,
} from "@mui/material";

const Contact = () => {
  return (
    <>
      {/* HERO SECTION */}
      {/* HERO SECTION WITHOUT IMAGE */}
<Box
  sx={{
    width: "100%",
    height: { xs: 200, sm: 250, md: 300 },
    background: "linear-gradient(135deg, #81c784 0%, #43a047 100%)", // green gradient
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center",
    mb: { xs: 4, md: 6 },
    borderRadius: 2,
  }}
>
  <Box sx={{ px: 2 }}>
    <Typography
      variant="h2"
      sx={{
        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
        fontWeight: 700,
        mb: 1,
      }}
    >
      Get in Touch
    </Typography>
    <Typography
      sx={{
        fontSize: { xs: "0.9rem", sm: "1rem" },
        maxWidth: 600,
        mx: "auto",
        lineHeight: 1.6,
      }}
    >
      We’re here to serve you — reach out with questions, feedback, or just to say hello!
    </Typography>
  </Box>
</Box>


      {/* CONTACT INFO SECTION */}
      <Container maxWidth="md" sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#2e7d32",
            mb: { xs: 3, sm: 5 },
          }}
        >
          Contact Information
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
        >
          {[
            {
              icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#43a047" }} />,
              title: "Customer Support",
              info: "+91 23458578 (Toll-Free)",
            },
            {
              icon: <MailIcon sx={{ fontSize: 40, color: "#43a047" }} />,
              title: "Email Us",
              info: "bhanuprakashuruva09@gmail.com",
            },
            {
              icon: <CallIcon sx={{ fontSize: 40, color: "#43a047" }} />,
              title: "Call Us",
              info: "7207485739",
            },
          ].map((item, index) => (
            <Fade in timeout={500 + index * 200} key={index}>
              <Paper
                elevation={4}
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {item.icon}
                <Typography
                  variant="h6"
                  sx={{ mt: 1, color: "#2e7d32", fontWeight: 600 }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1.2 }}>
                  {item.info}
                </Typography>
              </Paper>
            </Fade>
          ))}
        </Stack>
      </Container>

      {/* CONTACT FORM SECTION */}
      <Box
        sx={{
          bgcolor: "#f9f9f9",
          py: { xs: 5, md: 7 },
          px: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: { xs: 3, sm: 4 },
              color: "#2e7d32",
            }}
          >
            Send Us a Message
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                size="medium"
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                variant="outlined"
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                sx={{
                  backgroundColor: "#43a047",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#388e3c" },
                }}
              >
                Send Message
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* MAP SECTION */}
      <Box
        sx={{
          mt: { xs: 6, md: 8 },
          mb: { xs: 0, md: 6 },
          width: "100%",
          height: { xs: 300, sm: 400 },
        }}
      >
        <iframe
          title="Table Tales Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387144.0075831045!2d-74.25819542730962!3d40.70562584201033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xecd7f6d9b9a20e6b!2sNew%20York%20City!5e0!3m2!1sen!2sus!4v1705234957429!5m2!1sen!2sus"
          style={{
            border: 0,
            width: "100%",
            height: "100%",
            borderRadius: "8px",
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>


    </>
  );
};

export default Contact;
