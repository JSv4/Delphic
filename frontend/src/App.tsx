import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CollectionCreateModal } from "./collections/CollectionCreateModal";
import DrawerLayout2 from "./layouts/DrawerLayout";
import { LoginForm } from "./LoginForm";
import { CollectionModelSchema } from "./types";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showNewCollectionModal, setShowNewCollectionModal] =
    useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<
    CollectionModelSchema | undefined
  >();

  const handleLogin = (authToken: string) => {
    setLoggedIn(true);
    setAuthToken(authToken);
  };

  return (
    <div style={{ height: "100%" }}>
      <ToastContainer />
      {authToken ? (
        <CollectionCreateModal
          open={showNewCollectionModal}
          authToken={authToken}
          handleClose={() => setShowNewCollectionModal(false)}
          handleCreate={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      ) : (
        <></>
      )}
      {loggedIn && authToken ? (
        <DrawerLayout2
          authToken={authToken}
          setAuthToken={setAuthToken}
          onAddNewCollection={() => setShowNewCollectionModal(true)}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
          showNewCollectionModal={showNewCollectionModal}
        />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
