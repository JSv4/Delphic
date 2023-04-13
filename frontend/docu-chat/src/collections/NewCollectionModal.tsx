import React, { useState } from "react";
import Form from '@rjsf/mui';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { JSONSchema7 } from "json-schema";
import validator from '@rjsf/validator-ajv8';
import {newCollectionForm_Schema} from "../forms/schemas";


type CollectionCreateModalProps = {
  open: boolean;
  authToken: string;
  handleClose: () => void;
  handleCreate: () => void;
};

const CollectionCreateModal: React.FC<CollectionCreateModalProps> = ({
  open,
  authToken,
  handleClose,
  handleCreate,
}) => {
  const [error, setError] = useState("");

  const handleSubmit = async (data: any) => {
    console.log("submit data", data);
    // try {
    //   await createCollection(formData, [], authToken);
    //   handleCreate();
    //   handleClose();
    // } catch (error: any) {
    //   setError(error.message);
    // }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create Collection</DialogTitle>
      <DialogContent>
        <Form 
            validator={validator}
            schema={newCollectionForm_Schema as JSONSchema7} 
            onSubmit={handleSubmit} 
        >
            <></>
        </Form>
        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={(a: any) => console.log("clicked reset", a)} color="primary">
          Reset
        </Button>
        <Button onClick={(a: any) => console.log("clicked created", a)} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollectionCreateModal;
