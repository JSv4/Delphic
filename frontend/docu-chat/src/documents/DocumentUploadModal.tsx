import { useEffect, useState } from "react";
import {
Box,
Button,
Dialog,
DialogActions,
DialogContent,
Divider,
Grid,
Paper,
Typography,
} from "@mui/material";
import { Alert } from "@mui/lab";
import DescriptionIcon from "@mui/icons-material/Description";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  
import { JSONSchema7 } from "json-schema";
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';

import { DocumentUploadList } from "./DocumentUploadList";
import { newDocForm_Schema, newDocForm_Ui_Schema } from "../forms/schemas";
import { toBase64 } from "../utils/files";
import { toast } from "react-toastify";
import { Settings } from "@mui/icons-material";
import { FileDetailsProps, FileUploadPackageProps, FileUploadVariables, RightColProps, UploadStatus } from "../utils/types";


export function RightCol({
  files,
  selected_file_num,
  handleChange,
}: RightColProps) {
  if (files && files.length > 0 && selected_file_num >= 0) {
    return (
      <Box sx={{ height: "100%", width: "100%", p: 2 }}>
        <Form
            validator={validator}
            schema={newDocForm_Schema as JSONSchema7}
            uiSchema={newDocForm_Ui_Schema}
            onChange={handleChange}
            formData={files[selected_file_num]}
        >
          <></>
        </Form>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Settings fontSize="large" />
      <Typography variant="h6">
        Once you've uploaded one or more documents, click on a document to
        update default title and descriptions.
      </Typography>
    </Box>
  );
}

interface DocumentUploadModalProps {
  open: boolean;
  collection_id: string;
  onClose: () => void;
  refetch?: (args?: any) => any | void;
}

export function DocumentUploadModal(props: DocumentUploadModalProps) {

  const { open, onClose, refetch } = props;
  const [files, setFiles] = useState<FileUploadPackageProps[]>([]);
  const [upload_state, setUploadState] = useState<
    ("NOT_STARTED" | "SUCCESS" | "FAILED" | "UPLOADING")[]
  >([]);
  const [selected_file_num, selectFileNum] = useState<number>(-1);

  useEffect(() => {
    if (!open) {
      setUploadState([]);
      setFiles([]);
      selectFileNum(-1);
    }
  }, [open]);


  const uploadDocument = ({base64FileString, filename, customMeta, description, title}: FileUploadVariables) => {

  }


  const toggleSelectedDoc = (new_index: number) => {
    selectFileNum(new_index === selected_file_num ? -1 : new_index);
  };

  const addFile = (file_package: FileUploadPackageProps) => {
    setFiles((files) => [
      ...(files ? files : []),
      { ...file_package, status: UploadStatus.NOT_STARTED },
    ]);
    setUploadState((statuses) => [...statuses, UploadStatus.NOT_STARTED]);
  };

  // TODO... improve type handling
  const uploadFiles = async () => {
    let uploads: any = [];
    if (files) {
      files.forEach(async (file_package, file_index) => {
        setFileStatus(UploadStatus.UPLOADING, file_index);
        var base_64_str = await toBase64(file_package.file);
        if (typeof base_64_str === "string" || base_64_str instanceof String) {
          uploads.push(
            uploadDocument(
                {
                base64FileString: base_64_str.split(",")[1],
                filename: file_package.file.name,
                customMeta: {},
                description: file_package?.formData?.description ? file_package.formData.description : "",
                title: file_package?.formData?.title ? file_package.formData.title : "", 
            })
          );
        }
      });
    }
    await Promise.all(uploads);
  };

  const removeFile = (file_index: number) => {
    setFiles((files) =>
      files?.filter((file_package, index) => index !== file_index)
    );
  };

  let selected_doc = null;
  try {
    selected_doc = files[selected_file_num];
  } catch {}

  const handleChange = ({ formData }: { formData: FileDetailsProps }) => {
    // console.log("handleChange", formData);
    setFiles((files) =>
      files.map((file_package, index) =>
        index === selected_file_num
          ? { ...file_package, formData }
          : file_package
      )
    );
  };

  const setFileStatus = (
    doc_status: "NOT_STARTED" | "SUCCESS" | "FAILED" | "UPLOADING",
    doc_index: number
  ) => {
    setUploadState((states) =>
      states.map((state, state_index) =>
        state_index === doc_index ? doc_status : state
      )
    );
  };

  const clearAndReloadOnClose = () => {
    // Clear files
    setFiles([]);
    setUploadState([]);
    onClose();
  };

  const upload_status = upload_state.reduce((previousValue, currentValue) => {
    return previousValue === UploadStatus.FAILED || currentValue === UploadStatus.FAILED
      ? UploadStatus.FAILED
      : previousValue === UploadStatus.UPLOADING || currentValue === UploadStatus.UPLOADING
      ? UploadStatus.UPLOADING
      : previousValue === UploadStatus.SUCCESS && currentValue === UploadStatus.SUCCESS
      ? UploadStatus.SUCCESS
      : UploadStatus.NOT_STARTED;
  }, UploadStatus.NOT_STARTED);

  return (
    <Dialog open={open} onClose={() => clearAndReloadOnClose()}>
      <Box textAlign="center" mt={1}>
        <div style={{ textAlign: "left" }}>
          <Typography variant="h2">
            <DescriptionIcon />
            Upload Your Contracts
          </Typography>
          <Typography variant="subtitle1">
            Select New Contract Files to Upload
          </Typography>
        </div>
      </Box>
      <DialogContent>
        <Paper>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider orientation="vertical" flexItem />
            </Grid>
            <Grid item xs={6} style={{ paddingRight: "2rem" }}>
              <DocumentUploadList
                selected_file_num={selected_file_num}
                documents={files}
                statuses={upload_state}
                onAddFile={addFile}
                onRemove={removeFile}
                onSelect={toggleSelectedDoc}
              />
            </Grid>
            <Grid item xs={6} style={{ paddingLeft: "2rem" }}>
              <div style={{ height: "100%", width: "100%" }}>
                <div
                  style={{
                    height: "40vh",
                    width: "100%",
                    padding: "1rem",
                  }}
                >
                  {upload_status === UploadStatus.FAILED ? (
                    <Box>
                      <Alert severity="error" style={{ width: "100%" }}>
                        There was an error uploading your documents. See which document icons are red to see which documents failed.
                      </Alert>
                    </Box>
                  ) : (
                    <></>
                  )}
                  {upload_status === UploadStatus.SUCCESS ? (
                    <Alert severity="success" style={{ width: "100%", height: "100%" }}>
                      Your documents were uploaded successfully!
                    </Alert>
                  ) : (
                    <></>
                  )}
                  {upload_status === UploadStatus.UPLOADING ? (
                    <Alert severity="info" style={{ width: "100%", height: "100%" }}>
                      Your documents are being uploaded. Please do not close this window.
                    </Alert>
                  ) : (
                    <></>
                  )}
                  {upload_status === UploadStatus.NOT_STARTED ? (
                    <RightCol
                      files={files}
                      selected_file_num={selected_file_num}
                      selected_doc={selected_file_num}
                      handleChange={handleChange}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="primary" onClick={() => clearAndReloadOnClose()}>
          <CancelIcon /> Close
        </Button>
        {files &&
        Object.keys(files).length > 0 &&
        upload_status === UploadStatus.NOT_STARTED ? (
          <Button variant="contained" color="primary" onClick={() => uploadFiles()}>
            <CheckCircleIcon /> Upload
          </Button>
        ) : (
          <></>
        )}
      </DialogActions>
    </Dialog>
  );
  

}