import VideoIcon from "@atlaskit/icon/glyph/editor/file-preview";
import * as React from "react";
import {youtubeReg} from "../../constants/urls";
import {EmbedVideoParams} from "./extension-handler";

const embedVideoButton = {
    content: "Embed video",
    value: {name: "embed-video"},
    tooltipDescription: "Embed video",
    tooltipPosition: "right",
    // @ts-ignore
    elemBefore: <VideoIcon />,

    onClick: (editorActions: any) => {

        const url = prompt("Input Url") || "";
        const youtubeMatch = url.match(youtubeReg);
        const newParameters: EmbedVideoParams = {} as EmbedVideoParams;

        if (youtubeMatch && youtubeMatch[2].length === 11) {
            newParameters.type = "youtube";
            newParameters.key = youtubeMatch[2];
            newParameters.url = url;
        } else {
            return null;
        }

        editorActions.replaceSelection({
            type: "extension",
            attrs: {
                extensionType: "embed.video.extension",
                extensionKey: "embed.video:embed-video-default",
                text: "Embed video",
                parameters: newParameters
            }
        });
    }
}

export default embedVideoButton