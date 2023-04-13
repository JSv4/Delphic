import React, { useCallback, useRef } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import { Description, Delete, CloudUpload } from "@mui/icons-material";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { DocumentListItem } from "./DocumentListItem";
import { FileUploadPackageProps } from "../utils/types";


interface DocumentUploadListProps {
  documents: FileUploadPackageProps[];
  statuses: string[];
  selected_file_num: number;
  onSelect: (args?: any) => void | any;
  onRemove: (args?: any) => void | any;
  onAddFile: (args?: any) => void | any;
}

export function DocumentUploadList(props: DocumentUploadListProps) {
  const {
    documents,
    statuses,
    onSelect,
    onRemove,
    onAddFile,
    selected_file_num,
  } = props;

  const onDrop = useCallback(
    <T extends File>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      Array.from(acceptedFiles).forEach((file) => {
        onAddFile({
          file,
          formData: {
            title: file.name,
            description: `Content summary for ${file.name}`,
          },
        });
      });
    },
    [props]
  );

  const { getRootProps, getInputProps } = useDropzone({
    disabled: documents && Object.keys(documents).length > 0,
    onDrop,
  });

  const fileInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const grid =
    documents && documents.length > 0
      ? documents.map((document, index) => {
          return (
            <DocumentListItem
              key={document?.file.name ? document.file.name : index}
              onRemove={() => onRemove(index)}
              onSelect={() => onSelect(index)}
              selected={index === selected_file_num}
              document={document.formData}
              status={statuses[index]}
            />
          );
        })
      : [<></>];

  function filesChanged(event: React.ChangeEvent<HTMLInputElement>) {
    let files: File[] = [];
    if (event?.target?.files) {
      if (event?.target?.files) {
        files = Array.from(event.target.files);
        onDrop(files, [], event);
      }
      onDrop(files, [], event);
    }
  }

  return (
    <div style={{ height: "100%" }}>
      <div
        {...getRootProps()}
        style={{
          height: "40vh",
          width: "100%",
          padding: "1rem",
        }}
      >
        {documents && documents.length > 0 ? (
          <List
            style={{
              height: "100%",
              width: "100%",
              overflowY: "scroll",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: "4px",
            }}
          >
            {grid}
          </List>
        ) : (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed rgba(0, 0, 0, 0.12)",
              borderRadius: "4px",
            }}
          >
            <Description fontSize="large" />
            <Typography variant="h6" gutterBottom>
              Drag Documents Here or Click "Add Document(s)" to Upload
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <em>(Only *.pdf files supported for now)</em>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current.click()}
            >
              Add Document(s)
            </Button>
          </Box>
        )}
        <input
          accept=".pdf"
          {...getInputProps()}
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          onChange={filesChanged}
        />
      </div>
    </div>
  );
        }
