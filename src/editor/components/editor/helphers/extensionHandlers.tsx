import * as React from "react";
import { ExtensionHandlers } from "@atlaskit/editor-common/extensions";

export interface EmbedVideo {
  id: string;
  src: string;
}

const extensionHandlers: ExtensionHandlers = {
  "embed-video": (ext, doc) => {
    const { parameters } = ext;

    const { type, key } = parameters;
    const embedVideo: EmbedVideo = {} as EmbedVideo;

    if (type === "youtube") {
      embedVideo.id = key;
      embedVideo.src = "//www.youtube.com/embed/";
    } else {
      return null;
    }

    return (
      <div>
        <iframe
          title={`embed-video-${embedVideo.id}`}
          width="560"
          height="315"
          src={embedVideo.src + embedVideo.id}
        />
      </div>
    );
  }
};

export default extensionHandlers;
