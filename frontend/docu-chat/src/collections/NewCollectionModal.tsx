import React, { useState } from "react";
import Form from '@rjsf/mui';
import { JSONSchema7 } from "json-schema";
import validator from '@rjsf/validator-ajv8';
import {newCollectionForm_Schema} from "../forms/schemas";
import { createCollection } from "../api/collections";
import FileWidget from "../widgets/FileWidget";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
  } from "@mui/material";
  

interface FormData {
    title: string;
    description: string;
    files?: string[]; // This is marked as optional since the schema indicates it's optional
  }

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
    const [error, setError] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);  

  // State to store form data
  const [formData, setFormData] = useState<FormData>({title: "", description:""});

  // Function to handle form data change
  const handleChange = ({ formData }: {formData: FormData}) => {
    setFormData(formData);
  };

  const handleSubmit = async (data: any) => {
    console.log("submit data", data);
    try {
      await createCollection({
        title: formData.title,
        description: formData.description
      }, 
      files, 
      authToken);
      handleCreate();
      handleClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

//   return (
//     <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
//       <DialogTitle id="form-dialog-title">Create Collection</DialogTitle>
//       <DialogContent>
//         <Form 
//             validator={validator}
//             schema={newCollectionForm_Schema as JSONSchema7} 
//         onChange={({ formData }) => setFormData(formData as FormData)} // Add onChange event to update formData state
//           onSubmit={handleSubmit} // Add onSubmit event to call handleSubmit function
//           widgets={widgets}
//           customFormats={customFormats}
//         >
//             <></>
//         </Form>
//         {error && (
//           <p style={{ color: "red" }}>{error}</p>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} color="secondary">
//           Cancel
//         </Button>
//         <Button onClick={(a: any) => console.log("clicked reset", a)} color="primary">
//           Reset
//         </Button>
//         <Button onClick={(a: any) => console.log("clicked created", a)} color="primary">
//           Create
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
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

export default CollectionCreateModal;
