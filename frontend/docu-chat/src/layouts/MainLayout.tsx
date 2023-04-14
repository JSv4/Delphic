import * as React from "react";
import { styled, useTheme } from "@mui/system";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer, Typography, Paper } from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";

const DrawerToggleButton = styled(IconButton)(({ theme }) => ({
    [theme.breakpoints.up("md")]: {
        display: "none",
    },
}));

interface LayoutProps {
    leftColumn: React.ReactNode;
    mainContent: React.ReactNode;
}

export const MainLayout: React.FC<LayoutProps> = ({
    leftColumn,
    mainContent,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [drawerToggled, setDrawerToggled] = React.useState<boolean>(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (isMobile) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" flexGrow={1}>
                            App Title
                        </Typography>
                        <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => setDrawerToggled(!drawerToggled)}>
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box sx={{ display: 'flex', flexGrow: 1 }}>
                    <Drawer
                        anchor="left"
                        open={drawerToggled}
                        onClose={() => setDrawerToggled(false)}
                        sx={{
                            width: '80vw',
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: {
                                width: '80vw',
                                boxSizing: 'border-box',
                            },
                        }}
                    >
                        <Toolbar />
                        <Box sx={{ p: 2 }}>{leftColumn}</Box>
                    </Drawer>
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <Toolbar />
                        {mainContent}
                    </Box>
                </Box>
            </Box>
        );

    }
    else {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <AppBar position="static">
                    <Toolbar>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </Menu>
                        {isMobile && (
                            <DrawerToggleButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={() => setDrawerToggled(!drawerToggled)}
                            >
                                <MenuIcon />
                            </DrawerToggleButton>
                        )}
                    </Toolbar>
                </AppBar>
                <Box sx={{ display: 'flex', flexGrow: 1, overflowY: 'hidden' }}>
                    {!isMobile && (
                        <Paper sx={{ width: '30vw', height: '100%', overflowY: 'hidden' }}>
                            {leftColumn}
                        </Paper>
                    )}
                    <div style={{height:'100%', width:'70vw', overflow:'hidden'}}>
                        {mainContent}
                    </div>
                </Box>
            </Box>
        );
    }

};
