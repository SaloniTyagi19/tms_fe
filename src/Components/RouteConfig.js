import React from 'react';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Inbox, Mail } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function RouteConfig() {
    return (
        <List>
            {[{ name: 'Dashboard', link: '/home' },
            { name: 'Projects', link: '/project' },
            { name: 'Tasks', link: '/task' },
            { name: 'Activity Log', link: '/activityLog' },
            { name: 'Profile', link: '/profile' },
            { name: 'Logout', link: '/logout' }].map((text, index) => (
                <Link to={text?.link}>
                    <ListItem button key={text?.name}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <Inbox /> : <Mail />}
                        </ListItemIcon>
                        <ListItemText primary={text?.name} />
                    </ListItem>
                </Link>
            ))}
        </List>
    )
}

export default RouteConfig;