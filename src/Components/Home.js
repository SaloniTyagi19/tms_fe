import React, { useEffect, useState } from 'react';
import {
    Box,
    Toolbar,
    Grid,
    Paper,
    TextField,
    Button,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import moment from 'moment';
import { SentimentDissatisfied } from '@mui/icons-material';


function Home() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [list, setList] = useState([])
    const getToken = JSON.parse(localStorage.getItem('user'))

    const [filter, setFilter] = useState({
        priority: '',
        status: '',
        dueDate: ''
    });

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: value,
        }));
    };

    const resetFilter = () => {
        setFilter({
            priority: '',
            status: '',
            dueDate: ''
        })
        setSelectedDate(null)
    }
    const getTasks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tasks/all`, { headers: { Authorization: getToken.token }, params: { ...filter, dueDate: selectedDate } })
            if (response.status === 200) {
                setList(response.data.payload.tasks)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTasks()
    }, [filter, selectedDate]);

    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />

                <Paper sx={{ mb: 3, p: 2, mt: 5 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Select Date"
                                    value={selectedDate}
                                    onChange={(newValue) => setSelectedDate(newValue)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Priority"
                                name="priority"
                                select
                                fullWidth
                                value={filter.priority}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Status"
                                name="status"
                                select
                                fullWidth
                                value={filter.status}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="Todo">Todo</MenuItem>
                                <MenuItem value="InProgress">Inprogress</MenuItem>
                                <MenuItem value="Done">Done</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ flex: 1 }}
                                    onClick={resetFilter}
                                >
                                    Reset Filters
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Project Name</TableCell>
                                <TableCell>Task</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Due Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list?.length > 0 ? list.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell>{row._id}</TableCell>
                                    <TableCell>{row.projectId.name}</TableCell>
                                    <TableCell sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '100%',
                                    }}>{row.title}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{moment(row.dueDate).format('YYYY-MM-DD')}</TableCell>
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
            </Box>
        </Box>
    );
}

export default Home;
