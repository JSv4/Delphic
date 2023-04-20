import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GitHubIcon from "@mui/icons-material/GitHub";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import Toolbar from "@mui/material/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { CollectionModelSchema, CollectionStatus } from "../types";
import { getMyCollections } from "../api/collections";
import ChatView from "../chat/ChatView";
import { InfoMessageBox } from "../widgets/InfoMessageBox";
import { CollectionInfoPopover } from "../collections/CollectionInfoPopover";

import os_logo from "../assets/os_legal_128.png";

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  selectedCollection: CollectionModelSchema | undefined;
  showNewCollectionModal: boolean;
  setSelectedCollection: (arg0: CollectionModelSchema) => void | undefined;
  onAddNewCollection: () => void | undefined;
  setAuthToken: (key: string) => void | undefined;
  authToken: string;
  window?: () => Window;
}

export default function DrawerLayout2(props: Props) {
  const {
    selectedCollection,
    showNewCollectionModal,
    setSelectedCollection,
    onAddNewCollection,
    setAuthToken,
    authToken,
  } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [collections, setCollections] = useState<CollectionModelSchema[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCollectionClick = (collection: CollectionModelSchema) => {
    setSelectedCollection(collection);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  useEffect(() => {
    fetchCollections();
  }, [showNewCollectionModal]);

  useEffect(() => {
    fetchCollections();
  }, []);

  // Set up an interval to long-poll for collection statuses IF any collection is queued or running.
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      collections.some(
        (collection) =>
          collection.status === CollectionStatus.RUNNING ||
          collection.status === CollectionStatus.QUEUED
      )
    ) {
      interval = setInterval(() => {
        fetchCollections();
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [collections]);

  const drawer = (
    <div>
      <Toolbar />
      <ListItem key={"New Collection"} disablePadding>
        <ListItemButton
          onClick={onAddNewCollection}
          disabled={authToken === ""}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"New Collection"} />
        </ListItemButton>
      </ListItem>
      <Divider />
      <Box
        sx={{
          width: "100%",
          height: 400,
          maxWidth: 360,
          bgcolor: "background.paper",
          overflowY: "scroll",
        }}
      >
        <List>
          {collections.map((collection) => (
            <div key={collection.id}>
              <ListItem disablePadding>
                <ListItemButton
                  disabled={
                    collection.status !== CollectionStatus.COMPLETE ||
                    !collection.has_model
                  }
                  onClick={() => handleCollectionClick(collection)}
                  selected={
                    selectedCollection &&
                    selectedCollection.id === collection.id
                  }
                >
                  <ListItemText primary={collection.title} />
                  {collection.status === CollectionStatus.RUNNING ? (
                    <CircularProgress
                      size={24}
                      style={{ position: "absolute", right: 16 }}
                    />
                  ) : null}
                </ListItemButton>
              </ListItem>
            </div>
          ))}
        </List>
      </Box>
      <Divider />
      <List>
        {authToken ? (
          <ListItem key="Logout" disablePadding>
            <ListItemButton onClick={() => setAuthToken("")}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <></>
        )}
        <ListItem key="GitHub" disablePadding>
          <ListItemButton
            onClick={() =>
              window.open(
                "https://github.com/JSv4/Delphic",
                "_blank",
                "noreferrer"
              )
            }
          >
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary="GitHub" />
          </ListItemButton>
        </ListItem>
        <ListItem key="OpenSource Legal" disablePadding>
          <ListItemButton
            onClick={() =>
              window.open("https://opensource.legal", "_blank", "noreferrer")
            }
          >
            <ListItemIcon>
              <ListItemAvatar>
                <Avatar src={os_logo} />
              </ListItemAvatar>
            </ListItemIcon>
            <ListItemText primary="OpenSource Legal" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
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
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {selectedCollection ? (
            <CollectionInfoPopover
              collection={selectedCollection}
              canDownload={authToken !== ""}
              canDelete={authToken !== ""}
            />
          ) : (
            <Typography variant="h6" noWrap component="div">
              Select a Collection
            </Typography>
          )}
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
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          height: "100vh",
          display: "flex",
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {selectedCollection === undefined ? (
          <InfoMessageBox message="Select an existing collection or create a new one to get started..." />
        ) : (
          <ChatView
            selectedCollection={selectedCollection}
            authToken={authToken}
          />
        )}
      </Box>
    </Box>
  );
}
