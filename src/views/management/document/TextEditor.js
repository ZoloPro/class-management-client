import React from 'react';
import Editor from 'ckeditor5-custom-build';
import { CKEditor } from '@ckeditor/ckeditor5-react';

export default function TextEditor({ onChange }) {
  return (
    <CKEditor
      editor={Editor}
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
