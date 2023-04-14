//########################### NEW DOCUMENT FORM #################################

export const newDocForm_Schema = {
    title: "Document Details",
    type: "object",
    properties: {
      title: {
        type: "string",
        title: "Title:",
      },
      description: {
        type: "string",
        title: "Description:",
      },
    },
    required: ["title", "description"],
  };
  
  export const newDocForm_Ui_Schema = {
    description: {
      "ui:widget": "textarea",
      "ui:placeholder": "Add a description...",
    },
  };

  //########################### NEW COMPARISON FORM #################################
export const newCollectionForm_Schema = {
    title: "Collection Details",
    type: "object",
    properties: {
      title: {
        type: "string",
        title: "Title",
        description: "Enter a title for your new document collection",
      },
      description: {
        type: "string",
        title: "Description",
        description: "Enter a description for your new document collection",
      },
      files: {
        type: "array",
        title: "Upload Files",
        description: "Upload one or more files to add to the collection (optional - you can add docs later)",
        items: {
          type: "string",
          format: "data-url",
        },
      },
    },
    customFormats: {
        "data-url": "FileList",
      },
    required: ["title", "description"],
  };