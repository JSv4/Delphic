import React, { useRef } from "react";

interface FileWidgetProps {
  onChange: (files: FileList) => void;
}

const FileWidget: React.FC<FileWidgetProps> = ({ onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onChange(event.target.files);
    }
  };

  return (
    <input
      type="file"
      ref={inputRef}
      multiple
      onChange={handleChange}
    />
  );
};

export default FileWidget;
