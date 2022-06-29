import React, { useState } from "react";

import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

export default function RTEditor(props) {
  const contentBlock = htmlToDraft(
    localStorage.getItem("currHtml") || "<h1>Hello</h1>"
  );
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  );
  let [state, setState] = useState({
    editorState: EditorState.createWithContent(contentState),
  });

  const getHtml = (currEditor = state.editorState) => {
    return draftToHtml(convertToRaw(currEditor.getCurrentContent()));
  };
  const printContent = () => {
    let initial = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="Note"
          content="Rendered note"
        />
        <title>NOTES</title>
        <script defer>
        setTimeout(()=>{
          if (window.confirm('Print?'))
          {
              window.print();
          }
          else
          {
              alert('not printed');
          }
        }, 3000)
        </script>
        <body>
    `;

    let newWindow = window.open("", "_blank", `auto,auto`);
    newWindow.document.write(initial);
    newWindow.document.write(
      "<link rel='stylesheet' href='https://dl.dropboxusercontent.com/s/59j6hswrlhv7ca5/mdnotes.css' type='text/css'/>" +
        "<link rel='stylesheet' href='https://dl.dropboxusercontent.com/s/qvgafkj3ngl477h/editor.css' type='text/css'/>"
    );
    newWindow.document.write(
      draftToHtml(convertToRaw(state.editorState.getCurrentContent())) +
        "</body>"
    );
  };

  return (
    <>
      <button onClick={printContent}>Print Content</button>
      <Editor
        editorState={state.editorState}
        wrapperStyle={{ display: "inline-block" }}
        onEditorStateChange={(editorState) => {
          localStorage.setItem("currHtml", getHtml(editorState));
          setState({ editorState: editorState });
        }}
      />
    </>
  );
}
