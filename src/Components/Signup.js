import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Box, Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [pass, setPass] = useState(null);
    const [confirmPass, setConfirm] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const onSignUp = async () => {
        try {

            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
                email,
                password: pass,
                firstName,
                lastName
            })
            if (response?.data) {
                localStorage.setItem('user', JSON.stringify(response.data.payload))
                setMessage(response?.data?.message)
                setOpen(true)
                navigate('/home');
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Container maxWidth="xs">
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={5000}
                message={message}
            />
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                height="100vh"
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign Up
                </Typography>
                <form>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="First Name"
                        name="name"
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Last Name"
                        name="name"
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPass(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="current-password"
                        onChange={(e) => setConfirm(e.target.value)}
                    />

                    <Button
                        fullWidth
                        disabled={pass !== confirmPass}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={onSignUp}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/">Already have an account? Sign in</Link>

                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
}

export default Signup;
