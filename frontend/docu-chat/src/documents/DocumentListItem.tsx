import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Description, Delete } from "@mui/icons-material";
import { FileDetailsProps, UploadStatus } from "../utils/types";

interface DocumentListItemProps {
  document: FileDetailsProps;
  status: string;
  selected: boolean;
  onRemove: () => void;
  onSelect: () => void;
}

export const DocumentListItem = ({
  document,
  status,
  selected,
  onRemove,
  onSelect,
}: DocumentListItemProps) => {
  let iconColor;
  if (status === UploadStatus.SUCCESS) {
    iconColor = "success";
  } else if (status === UploadStatus.FAILED) {
    iconColor = "error";
  } else {
    iconColor = "action";
  }

  return (
    <ListItem
      button
      onClick={onSelect}
      sx={{ backgroundColor: selected ? "#e2ffdb" : "inherit" }}
    >
      {status === UploadStatus.UPLOADING ? (
        <ListItemIcon>
          <CircularProgress color="inherit" size="1.5rem" />
        </ListItemIcon>
      ) : status === UploadStatus.NOT_STARTED ? (
        <IconButton edge="end" color="error" onClick={onRemove}>
          <Delete />
        </IconButton>
      ) : (
        <></>
      )}
      <ListItemIcon>
        <Description fontSize="inherit" color="error" />
      </ListItemIcon>
      <ListItemText>
        {status === UploadStatus.FAILED ? (
          <Alert severity="error">
            <AlertTitle>
              ERROR UPLOADING: {document?.title ? document.title : "No contracts"}
            </AlertTitle>
          </Alert>
        ) : (
          <>{document?.title ? document.title : "No contracts"}</>
        )}
      </ListItemText>
    </ListItem>
  );
};
