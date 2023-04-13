import { Button } from "@mui/material";
import { useState } from "react";
import { CollectionList } from "./collections/CollectionList";
import CollectionCreateModal from "./collections/NewCollectionModal";
import {LoginForm} from "./LoginForm";


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState<boolean>(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>();
  const [showAddDocsModal, setShowAddDocsModal] = useState<boolean>(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <div>
      
      {loggedIn ? (
        <>
        <Button variant="contained" onClick={() => setShowNewCollectionModal(true)}>New Collection</Button>
        <CollectionCreateModal open={showNewCollectionModal} authToken={""} handleClose={function (): void {
          throw new Error("Function not implemented.");
        } } handleCreate={function (): void {
          throw new Error("Function not implemented.");
        } }/>
        <CollectionList />
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
