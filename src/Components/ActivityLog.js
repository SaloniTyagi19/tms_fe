import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Divider, Box, TextField, MenuItem } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import axios from 'axios';
import { SentimentDissatisfied } from '@mui/icons-material';

function ActivityLog() {
    const [selectedOptions, setSelectedOptions] = useState(null);
    const [projects, setProject] = useState([]);
    const [activityList, setActivityList] = useState([]);
    const getToken = JSON.parse(localStorage.getItem('user'))

    const getActivity = async (proID) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/activity/${proID}`, { headers: { Authorization: getToken.token } })
            if (response.status === 200) {
                setActivityList(response.data.payload.activityLog)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getProjects = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/project/all`, { headers: { Authorization: getToken.token } })
            if (response.status === 200) {
                setProject(response.data.payload.projects)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getProjects()
    }, [])

    const handleChangeProject = (e) => {
        setSelectedOptions(e.target.value);
        getActivity(e.target.value);
    };

    return (
        <Box sx={{ p: 4 }}>
            <TextField
                label="Projects"
                name="status"
                select
                fullWidth
                value={selectedOptions}
                onChange={handleChangeProject}
            >
                {projects?.map((project) => (
                    <MenuItem value={project._id}>{project.name}</MenuItem>
                ))}
            </TextField>
            {activityList?.length > 0 ?
                <List>
                    {activityList.map((activity) => (
                        <div key={activity._id}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar><EventIcon /></Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={activity.description}

                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </div>
                    ))}
                </List> :
                <>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        textAlign="center"
                    >
                        <SentimentDissatisfied style={{ fontSize: 80, color: '#9e9e9e' }} />
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            {"No Data Found"}
                        </Typography>
                    </Box>
                </>
            }

        </Box>
    );
}

export default ActivityLog;
