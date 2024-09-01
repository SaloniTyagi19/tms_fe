import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Box, Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState(null);
    const [pass, setPass] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const onLogin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
                email: email,
                password: pass
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
                    Login
                </Typography>
                <form>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setEmail(e?.target?.value)}
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
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={onLogin}
                    >
                        Login
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to="/signup">Don't have an account? Sign Up</Link>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
}

export default Login;
