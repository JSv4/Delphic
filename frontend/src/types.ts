export interface FileUploadVariables {
  base64FileString: string;
  filename: string;
  customMeta: Record<string, any>;
  description: string;
  title: string;
}

export interface FileDetailsProps {
  title?: string;
  description?: string;
}

export interface FileUploadPackageProps {
  file: File;
  formData: FileDetailsProps;
}

export interface RightColProps {
  files: FileUploadPackageProps[];
  selected_file_num: number;
  selected_doc: number;
  handleChange: (a: any) => void;
}

export interface CollectionIn {
  title: string;
  description: string;
}

export interface CollectionModelSchema {
  id: number;
  title: string;
  description: string;
  status: CollectionStatus;
  created: string;
  modified: string;
  has_model: boolean;
  document_names: string[];
}

export interface CollectionQueryInput {
  collection_id: number;
  query_str: string;
}

export interface CollectionQueryOutput {
  response: string;
}

export enum UploadStatus {
  NOT_STARTED = "NOT_STARTED",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  UPLOADING = "UPLOADING",
}

export enum CollectionStatus {
  COMPLETE = "COMPLETE",
  RUNNING = "RUNNING",
  QUEUED = "QUEUED",
  ERROR = "ERROR",
}
