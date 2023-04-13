import { useEffect, useState } from "react";
import { getMyCollections } from "../api/collections";
import { CollectionModelSchema } from "../utils/types";
import { CollectionCard } from "./CollectionCard";


export const CollectionList = () => {
    const [collections, setCollections] = useState<CollectionModelSchema[]>([]);
    const [loading, setLoading] = useState(true);
  
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
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <>
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </>
    );
  };