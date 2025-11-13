import { Box, Typography } from '@mui/material';
import React from 'react';

const TermsAndConditions = () => {
  return (
    
      <Box sx={{ p: 4, lineHeight: 1.8 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Terms and Conditions
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome to our restaurant! By accessing or using our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
      </Typography>
      <ul>
        <li>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            1. Acceptance of Orders
          </Typography>
          <Typography variant="body1">
            All orders placed through our platform are subject to acceptance and availability. We reserve the right to refuse or cancel any order if the requested item is unavailable or due to unforeseen circumstances.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            2. Pricing and Payment
          </Typography>
          <Typography variant="body1">
            Prices listed on the menu are subject to change without prior notice. All payments must be made at the time of ordering, and we accept various payment methods as displayed on our platform.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            3. Cancellation and Refund Policy
          </Typography>
          <Typography variant="body1">
            Orders once placed cannot be canceled. Refunds are only processed in cases of incorrect or damaged items. Please contact our support team for assistance.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            4. Delivery Terms
          </Typography>
          <Typography variant="body1">
            Delivery times are approximate and may vary based on location, traffic, and other factors. We strive to deliver your food fresh and within the estimated timeframe.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            5. Allergies and Food Preferences
          </Typography>
          <Typography variant="body1">
            Customers are responsible for informing us of any allergies or dietary restrictions at the time of ordering. While we take precautions, we cannot guarantee that our food is free from allergens.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            6. Usage of the Platform
          </Typography>
          <Typography variant="body1">
            You agree to use our platform responsibly and not engage in any activities that may disrupt its functionality or harm other users.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            7. Intellectual Property
          </Typography>
          <Typography variant="body1">
            All content on this platform, including logos, images, and text, is the property of our restaurant. Unauthorized use or reproduction is strictly prohibited.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            8. Privacy Policy
          </Typography>
          <Typography variant="body1">
            We respect your privacy and ensure that your personal information is handled securely. Please review our Privacy Policy for more details.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            9. Changes to Terms
          </Typography>
          <Typography variant="body1">
            We reserve the right to update or modify these terms at any time without prior notice. Continued use of our platform signifies your acceptance of the updated terms.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            10. Contact Information
          </Typography>
          <Typography variant="body1">
            If you have any questions or concerns about these terms, please contact us at support@restaurant.com or call +91-123-456-7890.
          </Typography>
        </li>
      </ul>
    </Box>
    
  );
};

export default TermsAndConditions;

