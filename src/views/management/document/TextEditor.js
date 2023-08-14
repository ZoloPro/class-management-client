import React from 'react';
import Editor from 'ckeditor5-custom-build';
import { CKEditor } from '@ckeditor/ckeditor5-react';

export default function TextEditor({ onChange }) {
  const config = {
    image: {
      resizeUnit: 'px',
      resizeOptions: [
        {
          name: 'resizeImage:original',
          label: 'Original',
          value: null,
        },
        {
          name: 'resizeImage:100',
          label: '100px',
          value: '100',
        },
        {
          name: 'resizeImage:200',
          label: '200px',
          value: '200',
        },
      ],
    },
  };

  return (
    <CKEditor
      editor={Editor}
      config={config}
      onReady={(editor) => {
        // You can store the "editor" and use it when needed.
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        const newData = editor.getData();
        onChange(newData);
      }}
    />
  );
}
