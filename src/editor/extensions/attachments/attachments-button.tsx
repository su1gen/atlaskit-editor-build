import AttachmentsIcon from "@atlaskit/icon/glyph/editor/file";
import * as React from "react";
import {AttachmentsParams} from "./extension-handler";

const attachmentsButton = {
    content: "Attachments",
    value: {name: "attachments"},
    tooltipDescription: "Attachments",
    tooltipPosition: "right",
    // @ts-ignore
    elemBefore: <AttachmentsIcon />,

    onClick: (editorActions: any) => {

        const newParameters: AttachmentsParams = {} as AttachmentsParams;
        newParameters.items = []

        editorActions.replaceSelection({
            type: "extension",
            attrs: {
                extensionType: "attachments.extension",
                extensionKey: "attachments:attachments-default",
                text: "Attachments",
                parameters: newParameters
            },
        });
    }
}

export default attachmentsButton