import React from "react";
import {
  Box,
  Typography,
  CardMedia,
  Container,
  Stack,
  Divider,
  Paper,
  Fade,
} from "@mui/material";
import aboutImg from "../../assets/about.avif";

const About = () => {
  return (
    <>
      {/* HERO IMAGE SECTION */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          mb: { xs: 4, md: 6 },
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <CardMedia
          component="img"
          alt="Restaurant Ambiance"
          image={aboutImg}
          sx={{
            width: "100%",
            height: { xs: 220, sm: 320, md: 450 },
            objectFit: "cover",
            filter: "brightness(70%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            color: "#fff",
            px: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
              fontWeight: "700",
              textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
            }}
          >
            About <span style={{ color: "#81c784" }}>Table Tales</span>
          </Typography>
          <Typography
            sx={{
              mt: 1,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              maxWidth: 600,
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            A journey of flavors, crafted with passion and served with love.
          </Typography>
        </Box>
      </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="md" sx={{ pb: { xs: 6, md: 10 } }}>
        <Stack spacing={{ xs: 3, sm: 4, md: 6 }}>
          {[
            {
              title: "Welcome to Our Restaurant",
              text: `Welcome to a world of culinary delights where every meal is crafted with passion and precision.
                     At Table Tales, we believe that great food brings people together. Our chefs blend tradition
                     and innovation to serve dishes that leave a lasting impression.`,
            },
            {
              title: "Exciting Offers",
              text: `We love surprising our guests! Explore our seasonal discounts and special combo offers that
                      make dining both delicious and affordable. Every visit is a chance to discover something new.`,
            },
            {
              title: "Wide Variety of Food",
              text: `From comforting classics to exotic dishes, our menu caters to every palate. Vegetarian,
                      vegan, and non-vegetarian — every bite tells a story of freshness and flavor.`,
            },
            {
              title: "Our Expert Chefs",
              text: `Behind every dish lies the creativity of our culinary maestros who have mastered the art of
                      blending flavors. Their dedication ensures that every meal you enjoy is a masterpiece.`,
            },
            {
              title: "24/7 Availability",
              text: `Cravings don’t follow the clock — and neither do we! Table Tales is open round the clock to
                      serve you piping-hot meals whenever hunger strikes.`,
            },
            {
              title: "Catering & Events",
              text: `Planning an event? Let us elevate your celebration with our custom catering services.
                      From small gatherings to grand parties, we take care of every culinary detail.`,
            },
            {
              title: "Sustainability & Quality",
              text: `We take pride in sourcing locally and minimizing waste. Our commitment to sustainability
                      ensures that your dining experience supports both community and environment.`,
            },
          ].map((section, index) => (
            <Fade in timeout={700 + index * 150} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2.5, sm: 4 },
                  borderRadius: 3,
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  textAlign: "center",
                  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#388e3c",
                    fontWeight: "bold",
                    mb: 1.5,
                    fontSize: { xs: "1.3rem", sm: "1.6rem" },
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#444",
                    textAlign: "justify",
                    lineHeight: 1.8,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >
                  {section.text}
                </Typography>
              </Paper>
            </Fade>
          ))}

          {/* THANK YOU NOTE */}
          <Box sx={{ textAlign: "center", mt: { xs: 4, md: 6 } }}>
            <Divider
              sx={{
                mb: 3,
                width: "80px",
                mx: "auto",
                borderColor: "#81c784",
                borderWidth: "2px",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "600",
                color: "#2e7d32",
                fontSize: { xs: "1rem", sm: "1.2rem" },
              }}
            >
              “Thank you for being part of our journey — every story at Table Tales begins with you.”
            </Typography>
          </Box>
        </Stack>
      </Container>


    </>
  );
};

export default About;
