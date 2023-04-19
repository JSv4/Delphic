import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  Divider,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { CollectionModelSchema } from "../types";

const bull = <span style={{ paddingLeft: 5 }}>&bull;</span>;

export const CollectionCard = ({
  canDownload,
  canDelete,
  collection,
}: {
  canDelete: boolean;
  canDownload: boolean;
  collection: CollectionModelSchema;
}) => {
  return (
    <Card sx={{ minWidth: 275 }}>
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
        <Typography variant="body2">
          <Divider sx={{ marginTop: ".5rem", marginBottom: ".5rem" }} />
          <span>Documents:</span>
          {collection.document_names.length > 0 ? (
            <Box
              sx={{
                width: "100%",
                maxHeight: 200,
                bgcolor: "background.paper",
                overflowY: "auto",
              }}
            >
              <List>
                {collection.document_names.map((doc_name, index) => (
                  <ListItem key={`${doc_name}_preview_${index}`} disablePadding>
                    <ListItemIcon>
                      <FilePresentIcon />
                    </ListItemIcon>
                    <ListItemText primary={doc_name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <></>
          )}
        </Typography>
      </CardContent>

      <CardActions>
        <IconButton
          size="small"
          edge="end"
          color="primary"
          disabled={!canDownload}
          onClick={() =>
            window.alert("Collection Download Not Implemented Yet")
          }
        >
          <DownloadIcon /> Download
        </IconButton>
        <IconButton
          size="small"
          edge="end"
          color="warning"
          disabled={!canDelete}
          onClick={() => window.alert("Collection Delete Not Implemented Yet")}
        >
          <DeleteIcon /> Delete
        </IconButton>
      </CardActions>
    </Card>
  );
};
