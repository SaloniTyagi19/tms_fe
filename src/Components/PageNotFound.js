import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/home');
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    textAlign: 'center',
                    mt: 8,
                    mb: 4,
                }}
            >
                <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
                <Typography variant="h3" component="h1" sx={{ mt: 2, mb: 1 }}>
                    404 - Page Not Found
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                    The page you are looking for does not exist or has been moved.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoBack}>
                    Go Back Home
                </Button>
            </Box>
        </Container>
    );
}

export default PageNotFound;
