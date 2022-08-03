import ImageIcon from "@atlaskit/icon/glyph/editor/image";
import * as React from "react";


const sendAndInsertImage = (editorActions: any, uploadURL: string, access_token: string, image: any) => {
    let data = new FormData()
    data.append('upload', image)
    // @ts-ignore
    data.append('_token', access_token)

    fetch(uploadURL, {
        method: 'POST',
        body: data
    })
      .then(response => response.json())
      .then(data => {

          let newWidth = data.originalSize.width
          let newHeight = data.originalSize.height

          if (newWidth > 760) {
              newHeight = Math.round(760 * newHeight / newWidth)
              newWidth = 760
          }

          editorActions.replaceSelection({
              "type": "mediaSingle",
              "content": [
                  {
                      "type": "media",
                      "attrs": {
                          "type": "external",
                          "url": `${data.url}#media-blob-url=true&id=87bcf0a2-a269-4038-8834-65f4bd6e5a9e&collection=contentId-65651&contextId=65651&mimeType=image%2Fjpeg&name=(89).jpg&size=256698&width=${newWidth}&height=${newHeight}&alt=`,
                          "width": newWidth,
                          "height": newHeight,
                      }
                  }
              ]
          })
      })
}

const imageButton = {
    content: "Insert image",
    value: {name: "insert-image"},
    tooltipDescription: "Insert image",
    tooltipPosition: "right",
    // @ts-ignore
    elemBefore: <ImageIcon/>,

    onClick: (editorActions: any) => {
        // @ts-ignore
        const uploadURL = document.querySelector("#edit-document-form")?.dataset?.atlaskitUploadImage
        // @ts-ignore
        const access_token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
        let inputElement = document.querySelector('#atlaskit-image-input')
        if (!inputElement) {
            inputElement = document.createElement('input');
            inputElement.setAttribute('id', 'atlaskit-image-input');
            // @ts-ignore
            inputElement.style.display = 'none';
            // @ts-ignore
            inputElement.type = 'file';

            inputElement.addEventListener('change', () => {
                // @ts-ignore
                if (inputElement.files && uploadURL) {
                    // @ts-ignore
                    sendAndInsertImage(editorActions, uploadURL, access_token, inputElement.files[0])
                }
            });
            document.body.appendChild(inputElement);
        }
        // @ts-ignore
        inputElement.value = ''

        // @ts-ignore
        inputElement.click();
    }
}
export default imageButton