import React, { useState } from "react";
import { createCollection } from "../api/collections";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

type CollectionCreateModalProps = {
  open: boolean;
  authToken: string;
  handleClose: () => void;
  handleCreate: () => void;
};

export const CollectionCreateModal: React.FC<CollectionCreateModalProps> = ({
  open,
  authToken,
  handleClose,
  handleCreate,
}) => {
  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);

  console.log("Authtoken", authToken);

  const handleSubmit = async (data: any) => {
    console.log("submit data", data);
    try {
      await createCollection(
        {
          title: title,
          description: description,
        },
        files,
        authToken
      )
        .catch((e) => {
          toast.error(`Unable to create collection due to error: ${e}`);
        })
        .then((response) => {
          toast.success("Collection successfully submitted for processing!");
        });
      handleCreate();
    } catch (error: any) {
      setError(error.message);
    }
    handleClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Collection</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: "block", marginTop: 16 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
