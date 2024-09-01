import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

function UserProfile() {
    let userInfo = JSON.parse(localStorage.getItem('user'))
    const [editMode, setEditMode] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = useState({
        name: `${userInfo?.firstName} ${userInfo.lastName}`,
        email: userInfo?.email
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const updateUser = async () => {
        try {
            const firstName = user.name.split(' ')[0]
            const lastName = user.name.split(' ')[1]
            const userData = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/auth/update`, { firstName, lastName }, { headers: { Authorization: userInfo.token } })
            setUser({ name: `${userData?.data?.payload?.firstName} ${userData?.data?.payload?.lastName}`, email: userData?.data?.payload?.email })
            const userDetails = await JSON.parse(localStorage.getItem('user'));
            userDetails.firstName = firstName
            userDetails.lastName = lastName
            localStorage.setItem('user', JSON.stringify(userDetails))
        } catch (error) {
            console.log(error)
        }
    }

    const handleSaveClick = () => {
        setOpen(true);
        setEditMode(false);
        updateUser()
    };

    const handleClose = () => {

        setOpen(false);
    }
    return (
        <Container maxWidth="sm">
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}

                onClose={handleClose}
                message="This Snackbar will be dismissed in 5 seconds."
            />
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    User Profile
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Name"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{ readOnly: !editMode }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        fullWidth
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                    {editMode ? (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveClick}
                        >
                            Save
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={handleEditClick}
                        >
                            Edit
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}


export default UserProfile;
