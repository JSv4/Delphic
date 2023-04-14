import { useState, useEffect } from "react";
import { getMyCollections } from "../api/collections";
import { CollectionModelSchema } from "../utils/types";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  IconButton,
  Divider,
  Collapse,
  CssBaseline,
  styled,
  ListItemIcon,
  Paper,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from "@mui/icons-material/Menu";
import ChatView from "../chat/ChatView";

const drawerWidth = 240;

const CollectionCard = ({ collection }: { collection: CollectionModelSchema }) => {
  return (
    <Card sx={{ minWidth: 275, position: "fixed", zIndex: 1300, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {collection.title}
        </Typography>
        <Typography variant="h5" component="div">
          {collection.description}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Status: {collection.status}
        </Typography>
        <Typography variant="body2">
          Created: {new Date(collection.created).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          Modified: {new Date(collection.modified).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));  

export const DrawerLayout = ({authToken}: {authToken: string}) => {
  const [collections, setCollections] = useState<CollectionModelSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<CollectionModelSchema | undefined>();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const response = await getMyCollections(accessToken);
          setCollections(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCollectionClick = (collection: CollectionModelSchema) => {
    setSelectedCollection(collection);
  };

  return (
    <Box sx={{ display: "flex", height:'100%' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Docubot {selectedCollection ? `(For ${selectedCollection.title})` : ""}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <List>
            <ListItem disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="New Collection" />
            </ListItemButton>
            </ListItem>
        </List>
        <Divider />
        <List>
          {collections.map((collection) => (
            <div key={collection.id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleCollectionClick(collection)}
                selected={selectedCollection && selectedCollection.id === collection.id}
              >
                <ListItemText primary={collection.title} />
              </ListItemButton>
            </ListItem>
            <Collapse in={selectedCollection && selectedCollection.id === collection.id} timeout="auto" unmountOnExit>
              <Paper elevation={6} sx={{ margin: 1 }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {collection.title}
                  </Typography>
                  <Typography>{collection.description}</Typography>
                </CardContent>
              </Paper>
            </Collapse>
          </div>
          ))}
        </List>
        <Divider />
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Drawer>
      {
        selectedCollection ?
        <ChatView authToken={authToken} selectedCollection={selectedCollection}/> : 
        <p>Login!</p>
      }
    </Box>
  );

}
