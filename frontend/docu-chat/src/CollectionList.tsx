import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface Collection {
  id: number;
  title: string;
  description: string;
  status: string;
  created: string;
  modified: string;
}

export const CollectionList = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get<Collection[]>(
          "http://localhost:8000/api/collections/available",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setCollections(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchCollections();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {collections.map((collection) => (
        <Card key={collection.id}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {collection.title}
            </Typography>
            <Typography color="textSecondary">
              {collection.description}
            </Typography>
            <Typography variant="body2" component="p">
              Status: {collection.status}
            </Typography>
            <Typography variant="body2" component="p">
              Created: {new Date(collection.created).toLocaleString()}
            </Typography>
            <Typography variant="body2" component="p">
              Modified: {new Date(collection.modified).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
      }
