'use client';

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Book, BookOnlineOutlined, CalendarMonthOutlined, Create, Home, Logout, QrCode } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { logout } from '../../services/user';
import { UserContext } from '../../contexts/UserContext';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    marginLeft: 0,
                },
            },
        ],
    }),
);

const handleLogOut = async () => {
    const resp = await logout();
    if (resp?.ok) {
        getToken();
        handleCloseUserMenu()
        navigate.push('/')
    }
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: `${drawerWidth}px`,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function Header() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const { token, getToken } = React.useContext(UserContext);

    const navigate = useRouter();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogOut = async () => {
        const resp = await logout();
        if (resp?.ok) {
            getToken();
            handleDrawerClose()
            navigate.push('/')
        }
    }

    const handleNavigation = (link) => {
        navigate.push(link);
        handleDrawerClose();
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    {token ?
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={[
                                {
                                    mr: 2,
                                },
                                open && { display: 'none' },
                            ]}
                        >
                            <MenuIcon />
                        </IconButton>
                        : <></>}
                    <Typography variant="h6" noWrap component="div">
                        Admin Kolam Pancing Paklong Mat Sen
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem key={'Home'} disablePadding>
                        <ListItemButton onClick={() => handleNavigation('/home')}>
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText primary={'Home'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'Scan QR'} disablePadding>
                        <ListItemButton onClick={() => handleNavigation('/scan-qr')}>
                            <ListItemIcon>
                                <QrCode />
                            </ListItemIcon>
                            <ListItemText primary={'Scan QR'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'Lihat Booking Pengguna'} disablePadding>
                        <ListItemButton onClick={() => handleNavigation('/booking-pengguna')}>
                            <ListItemIcon>
                                <Book />
                            </ListItemIcon>
                            <ListItemText primary={'Lihat Booking Pengguna'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'Cipta Manual Booking'} disablePadding>
                        <ListItemButton onClick={() => handleNavigation('/booking-manual')}>
                            <ListItemIcon>
                                <Create />
                            </ListItemIcon>
                            <ListItemText primary={'Cipta Booking Manual'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'Urus Tempahan'} disablePadding>
                        <ListItemButton onClick={() => handleNavigation('/urus-tempahan')}>
                            <ListItemIcon>
                                <CalendarMonthOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Urus Tempahan'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'Log out'} disablePadding>
                        <ListItemButton onClick={handleLogOut}>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary={'Log out'} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
            </Main>
        </Box>
    );
}