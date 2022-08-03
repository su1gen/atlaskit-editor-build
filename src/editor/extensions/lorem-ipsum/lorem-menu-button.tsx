import ImageIcon from "@atlaskit/icon/glyph/editor/image";
import * as React from "react";

export default {
    content: "Insert lorem",
    value: {name: "insert-lorem"},
    tooltipDescription: "Insert lorem",
    tooltipPosition: "right",
    // @ts-ignore
    elemBefore: <ImageIcon/>,

    onClick: (editorActions: any) => {
        editorActions.replaceSelection({
            "type": "extension",
            "attrs": {
                "extensionType": "com.atlassian.connect",
                "extensionKey": "fake.lorem.ipsum:lorem-ipsum-1",
                "parameters": {
                    "sentence": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam."
                },
                "layout": "default",
                "localId": "3adb5825-793e-4061-8a03-b70a0420056b"
            }
        })
    }
}