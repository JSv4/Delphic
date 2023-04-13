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
