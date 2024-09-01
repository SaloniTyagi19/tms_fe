import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import Projects from './Components/Projects';
import RouteConfig from './Components/RouteConfig';
import { AppBar, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Task from './Components/Task';
import ActivityLog from './Components/ActivityLog';
import UserProfile from './Components/UserProfile';
import PageNotFound from './Components/PageNotFound';
import Logout from './Components/Logout';

// const drawerWidth = 200;

function App() {
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setUserInfo(JSON.parse(loggedInUser));
        }
    }, [userInfo]);
    return (

        <Router>

            <AppBar
                position="fixed"

            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Task Management System ( TMS )
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container spacing={3} mt={8}>
                {userInfo && userInfo.token ? (
                    <Grid item xs={12} md={1.5}>
                        <RouteConfig />
                    </Grid>
                ) : null}
                <Grid item xs={12} md={10.5}>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/project" element={<Projects />} />
                        <Route path="/task" element={<Task />} />
                        <Route path="/activityLog" element={<ActivityLog />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/logout" element={<Logout />} />

                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Grid>

            </Grid>


        </Router>
    );
}

export default App;
