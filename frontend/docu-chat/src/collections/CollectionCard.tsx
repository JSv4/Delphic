import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import { CollectionModelSchema } from "../utils/types";

const bull = <span style={{ paddingLeft: 5 }}>&bull;</span>;

export const CollectionCard = ({ collection }: { collection: CollectionModelSchema }) => {
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
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};
