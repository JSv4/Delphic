import { useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CollectionCreateModal from "./collections/NewCollectionModal";
import DrawerLayout2 from "./layouts/DrawerLayout2";
import {LoginForm} from "./LoginForm";
import { CollectionModelSchema } from "./utils/types";


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<CollectionModelSchema | undefined>();
  const [showAddDocsModal, setShowAddDocsModal] = useState<boolean>(false);

  const handleLogin = (authToken: string) => {
    setLoggedIn(true);
    setAuthToken(authToken);
  };

  return (
    <div style={{height:'100%'}}>
      <ToastContainer/>
      {
        authToken ? <CollectionCreateModal open={showNewCollectionModal} authToken={authToken} handleClose={() => setShowNewCollectionModal(false)} handleCreate={function (): void {
          throw new Error("Function not implemented.");
        } }/> : <></>
      }
      
      {loggedIn && authToken ? (
        <DrawerLayout2 
          authToken={authToken}
          onAddNewCollection={() => setShowNewCollectionModal(true)}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}  
        />
        // <DrawerLayout authToken={authToken}/>      
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
