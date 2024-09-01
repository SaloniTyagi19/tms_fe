import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Autocomplete,
    Chip,
    Snackbar,
    Box,
    Typography
} from '@mui/material';
import { Add, Delete, Edit, SentimentDissatisfied } from '@mui/icons-material';
import axios from 'axios';

const drawerWidth = 240;

function Projects() {
    const [data, setData] = useState([]);
    // const [userInfo, setUserInfo] = useState([]);
    const [open, setOpen] = useState(false);
    const [openToster, setOpenToster] = useState(false);
    const [message, setMessage] = useState('');

    const [user, setUser] = useState([]);
    const [project, setProject] = useState(null);
    const [newData, setNewData] = useState({ name: '', description: '', memberCount: [] });
    const getUser = JSON.parse(localStorage.getItem('user'))

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickEdit = (item) => {
        setProject(item)
        setNewData({
            name: item.name,
            description: item.description,
            memberCount: user.filter(element => item?.users.includes(element?._id))
        })
        setOpen(true);

    }

    const addProject = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/project/create`, {
                "name": newData.name,
                "description": newData.description,
                "users": newData.memberCount?.map(res => res._id)
            }, { headers: { Authorization: getUser.token } })
            setMessage(response.data.message)
            setOpenToster(true)
            setOpen(false)
            getProjects()
        } catch (error) {
            console.log(error)
        }
    }


    const updateProject = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/project/update/${project?._id}`, {
                "name": newData.name,
                "description": newData.description,
                "users": newData.memberCount?.map(res => res._id)
            }, { headers: { Authorization: getUser.token } })
            setMessage(response.data.message)
            setOpenToster(true)
            setOpen(false)
            getProjects()
        } catch (error) {
            console.log(error)
        }
    }

    const getAllUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/all`, { headers: { Authorization: getUser.token } })
            setUser(response?.data?.payload?.users)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteProject = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/project/update/${id}`, { headers: { Authorization: getUser.token } })
            setMessage(response.data.message)
            setOpenToster(true)
            getProjects()
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (row) => {
        deleteProject(row._id)
    }
    const handleClose = () => {
        setOpen(false);
        setNewData({ name: '', description: '', memberCount: [] });
        setProject(null)
    };

    const handleSave = () => {
        addProject();
        handleClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewData({ ...newData, [name]: value });
    };
    const getProjects = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/project/all`, { headers: { Authorization: getUser.token } })
            if (response.status === 200) {
                setData(response.data.payload.projects)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // setUserInfo(JSON.parse(localStorage.getItem('user')))
        getAllUsers();
        getProjects();
    }, []);

    return (
        <div sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
            <Snackbar
                open={openToster}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={3000}
                message={message}
            />
            {getUser && ['Admin', 'PM'].includes(getUser.role) &&
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleClickOpen}>
                    Add New
                </Button>
            }
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Project Name</TableCell>
                            <TableCell>Project Description</TableCell>
                            <TableCell>Member Count</TableCell>
                            {getUser && ['Admin', 'PM'].includes(getUser.role) && <TableCell align="right">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.length > 0 ? data.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>{row._id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.totalMembers}</TableCell>
                                {getUser && ['Admin', 'PM'].includes(getUser.role) && <TableCell align="right">
                                    <IconButton aria-label="edit" size="small" onClick={() => handleClickEdit(row)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton aria-label="delete" size="small" onClick={() => handleDelete(row)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>}
                            </TableRow>
                        )) : <Box
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
                        </Box>}

                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newData.description}
                        onChange={handleChange}
                    />
                    <Autocomplete
                        multiple
                        id="multiselect-dropdown"
                        options={user}
                        getOptionLabel={(option) => option.firstName + option.lastName}
                        value={newData?.memberCount}
                        onChange={(ev, newVal) => setNewData({ ...newData, ['memberCount']: newVal })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Select Member"
                                placeholder="Member list"
                            />
                        )}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    label={option.firstName + option.lastName}
                                    {...getTagProps({ index })}
                                    key={option._id}
                                />
                            ))
                        }
                        style={{ width: 300 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={project ? updateProject : handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Projects;
