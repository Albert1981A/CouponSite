import "./Layout.css";
import React from 'react';
import { createStyles, makeStyles, useTheme, Theme, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import clsx from "clsx";
import { AssignmentInd, Business, ExitToApp, Home, Info, LockOpen, PersonAdd } from "@material-ui/icons";
import Routing from "../Routing/Routing";
import { BrowserRouter, Link, NavLink, useHistory, withRouter } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
);

function Layout(): JSX.Element {

    const history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    // const theme = createTheme();

    // theme.typography.h5 = {
    //     fontFamily: 'Roboto',
    //     fontWeight: "bold",
    //     fontSize: '1.2rem', '@media (min-width:600px)': { fontSize: '1.5rem', },
    //     [theme.breakpoints.up('md')]: {
    //         fontSize: '2.4rem',
    //     },
    // };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    //const { history } = props;
    const itemList = [{
        text: 'Register',
        icon: <PersonAdd />,
        link: "/register"
        // onClick: () => history.push("/register")
    }, {
        text: 'addCoupon',
        icon: <LockOpen />,
        link: "/add-coupon"
        //onClick: () => history.push("/login")
    }, {
        text: 'Login',
        icon: <LockOpen />,
        link: "/login"
        //onClick: () => history.push("/login")
    }, {
        text: 'Logout',
        icon: <ExitToApp />,
        link: "/logout"
        //onClick: () => history.push("/logout")
    }, {
        text: 'About',
        icon: <Info />,
        link: "/about"
        //onClick: () => history.push("/about")
    }, {
        text: 'Home',
        icon: <Home />,
        link: "/home"
        // onClick: () => history.push("/home")
    }, {
        text: 'Company Coupons',
        icon: <Business />,
        link: "/company-coupons"
        // onClick: () => history.push("/company-coupons")
    }, {
        text: 'Customer Coupons',
        icon: <AssignmentInd />,
        link: "/customer-coupons"
        // onClick: () => history.push("/customer-coupons")
    }
    ];

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>

                    <ThemeProvider theme={theme}>
                        <Typography variant="h5" noWrap>
                            ALBERT Coupon
                        </Typography>
                    </ThemeProvider>
                </Toolbar>
            </AppBar>

            <BrowserRouter>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >

                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>

                    <Divider />

                    <List>
                        {itemList.map((item, index) => {
                            const { text, icon, link } = item;
                            return (
                                <ListItem button component={Link} to={link} key={text}>
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            );
                        })}
                    </List>

                    <Divider />

                </Drawer>

                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Routing />
                </main>
            </BrowserRouter>
        </div>
    )
}
// export default withRouter(Layout);
export default Layout;

