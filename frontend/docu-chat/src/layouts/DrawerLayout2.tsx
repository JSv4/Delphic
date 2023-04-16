import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CollectionModelSchema } from '../utils/types';
import { getMyCollections } from '../api/collections';
import { CardContent, Collapse, Paper } from '@mui/material';
import ChatView from '../chat/ChatView';
import { InfoMessageBox } from '../widgets/messages/InfoMessageBox';
import { CollectionInfoPopover } from '../collections/CollectionInfoPopover';

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  selectedCollection: CollectionModelSchema | undefined;
  setSelectedCollection: (arg0: CollectionModelSchema) => void | undefined;
  onAddNewCollection: () => void | undefined;
  authToken: string;
  window?: () => Window;
}


export default function DrawerLayout2(props: Props) {
  const { selectedCollection, setSelectedCollection, onAddNewCollection, authToken, window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  
  const [collections, setCollections] = useState<CollectionModelSchema[]>([]);
  const [loading, setLoading] = useState(true);
  
  const handleCollectionClick = (collection: CollectionModelSchema) => {
    setSelectedCollection(collection);
  };


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


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



  const drawer = (
    <div>
      <Toolbar />
      <ListItem key={"New Collection"} disablePadding>
            <ListItemButton onClick={onAddNewCollection}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"New Collection"} />
            </ListItemButton>
          </ListItem>
      <Divider />
      <Box
      sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper', overflowY:'scroll' }}
    >
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
    </Box>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>{
            selectedCollection ?
            <CollectionInfoPopover collection={selectedCollection}/> :
            <Typography variant="h6" noWrap component="div">
              Select a Collection
            </Typography>
          }
          
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ height:'100vh', display:'flex', flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {
          selectedCollection === undefined ? 
          <InfoMessageBox message="Select an existing collection or create a new one to get started..."/> :
          <ChatView
            selectedCollection={selectedCollection}
            authToken={authToken}
          />
        }
      </Box>
    </Box>
  );
}