import React from 'react';
import {ExtensionComponentModule} from "../types";

export type EmbedVideoParams = {
    type: string;
    key: any;
    url: string;
};

export interface EmbedVideo {
    id: string;
    src: string;
}

const renderExtensionModule: ExtensionComponentModule<any> = Promise.resolve(props => {
    const { parameters } = props.node;

    const { type, key } = parameters;
    const embedVideo: EmbedVideo = {} as EmbedVideo;

    if (type === "youtube") {
        embedVideo.id = key;
        embedVideo.src = "//www.youtube.com/embed/";
    } else {
        return null;
    }

    return (
        <div className={"embed-video-container"}>
            <iframe
                className={"embed-video-iframe"}
                title={`embed-video-${embedVideo.id}`}
                src={embedVideo.src + embedVideo.id}
            />
        </div>
    );
})


export default renderExtensionModule;
