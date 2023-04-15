import { useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CollectionCreateModal from "./collections/NewCollectionModal";
import { DrawerLayout } from "./layouts/DrawerLayout";
import {LoginForm} from "./LoginForm";


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState<boolean>(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>();
  const [showAddDocsModal, setShowAddDocsModal] = useState<boolean>(false);

  const handleLogin = (authToken: string) => {
    setLoggedIn(true);
    setAuthToken(authToken);
  };

  return (
    <div style={{height:'100%'}}>
      <ToastContainer/>
      <CollectionCreateModal open={showNewCollectionModal} authToken={""} handleClose={function (): void {
          throw new Error("Function not implemented.");
        } } handleCreate={function (): void {
          throw new Error("Function not implemented.");
        } }/>
      {loggedIn && authToken ? (
        <DrawerLayout authToken={authToken}/>      
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
