import React, { useEffect, useState } from 'react';
import {
    Grid,
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
    MenuItem,
    Box,
    Typography,
    Snackbar
} from '@mui/material';
import { Add, Delete, Edit, SentimentDissatisfied } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs';

const drawerWidth = 240;

function Task() {
    const getToken = JSON.parse(localStorage.getItem('user'))
    const [data, setData] = useState([]);
    const [taskInfo, setTaskInfo] = useState(null);
    const [projects, setProject] = useState([]);
    const [open, setOpen] = useState(false);
    const [newData, setNewData] = useState({ name: '', description: '', dueDate: '', priority: '', status: '', assignTo: '' });
    const [selectedOptions, setSelectedOptions] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [user, setUser] = useState([]);
    const [openToster, setOpenToster] = useState(false);
    const [message, setMessage] = useState('');

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

    const getTasks = async (proId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tasks/all?projectId=${proId ? proId : selectedOptions}`, { headers: { Authorization: getToken.token } })
            if (response.status === 200) {
                setData(response.data.payload.tasks)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getProjects();
        getAllUsers();
    }, [])

    const handleChangeProject = (e) => {
        setSelectedOptions(e.target.value);
        getTasks(e.target.value)
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setTaskInfo(null)
        setOpen(false);
        setNewData({ name: '', description: '', dueDate: '', priority: '', status: '', assignTo: '' });
    };

    const handleSave = () => {
        addtask();
        handleClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewData({ ...newData, [name]: value });
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/tasks/update/${id}`, { headers: { Authorization: getToken.token } })
            getTasks()
        } catch (error) {
            console.log(error)
        }
    }

    const addtask = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/tasks/create`, {
                "title": newData?.name,
                "description": newData?.description,
                "dueDate": selectedDate,
                "priority": newData?.priority,
                "status": newData?.status,
                "projectId": selectedOptions,
                "assignedTo": newData?.assignTo

            }, { headers: { Authorization: getToken.token } })
            setMessage(response.data.message)
            setOpenToster(true)
            setOpen(false)
            getTasks()
        } catch (error) {
            console.log(error)
        }
    }


    const handleClickEdit = (item) => {
        setTaskInfo(item)
        setNewData({
            priority: item?.priority, status: item.status, assignTo: item?.assignedTo,
            name: item.title,
            description: item.description,

        })
        setSelectedDate(dayjs(item?.dueDate))
        setOpen(true);

    }

    const updateTask = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/tasks/update/${taskInfo?._id}`, {
                "title": newData?.name,
                "description": newData?.description,
                "dueDate": selectedDate,
                "priority": newData?.priority,
                "status": newData?.status,
                "projectId": selectedOptions,
                "assignedTo": newData?.assignTo

            }, { headers: { Authorization: getToken.token } })
            setMessage(response.data.message)
            setOpenToster(true)
            setOpen(false)
            handleClose()
            getTasks()
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (row) => {
        deleteTask(row._id)
    }

    const getAllUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/all`, { headers: { Authorization: getToken.token } })
            setUser(response?.data?.payload?.users)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
            <Snackbar
                open={openToster}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={3000}
                message={message}
            />
            <Grid container spacing={3} mt={8}>

                <Grid item xs={12} md={10.5}>
                    <TextField
                        label="Projects"
                        select
                        fullWidth
                        value={selectedOptions}
                        onChange={handleChangeProject}
                    >
                        {projects?.map((project) => (
                            <MenuItem value={project._id}>{project.name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} md={1.5}>
                    <Button disabled={!selectedOptions} variant="contained" color="primary" startIcon={<Add />} onClick={handleClickOpen}>
                        Add New
                    </Button>
                </Grid>

            </Grid>


            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Task Description</TableCell>
                            <TableCell>Due date</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.length > 0 ? data.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>{row._id}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.dueDate}</TableCell>
                                <TableCell>{row.priority}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell align="right">
                                    <IconButton aria-label="edit" size="small" onClick={() => handleClickEdit(row)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton aria-label="delete" size="small" onClick={() => handleDelete(row)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
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
                        margin="normal"
                        name="name"
                        label="Task Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        name="description"
                        label="Task Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newData.description}
                        onChange={handleChange}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker

                            margin="normal"
                            label="Select Date"
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>

                    <TextField
                        label="Priority"
                        name="priority"
                        select
                        fullWidth
                        margin="normal"
                        value={newData.priority}
                        onChange={handleChange}
                    >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                    </TextField>
                    <TextField
                        label="Status"
                        name="status"
                        select
                        margin="normal"
                        fullWidth
                        value={newData.status}
                        onChange={handleChange}
                    >
                        <MenuItem value="Todo">Todo</MenuItem>
                        <MenuItem value="Inprogress">Inprogress</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                    </TextField>
                    <TextField
                        label="Assign To"
                        name="assignTo"
                        select
                        margin="normal"
                        fullWidth
                        value={newData.assignTo}
                        onChange={handleChange}
                    >
                        {user?.map((user) => (
                            <MenuItem value={user._id}>{user.firstName + user.lastName}</MenuItem>
                        ))}


                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={taskInfo ? updateTask : handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Task;
