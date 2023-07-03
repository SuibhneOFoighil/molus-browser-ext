import { useEffect, useState } from "react"
import { addVideoToCollection } from "~chat"

export default function VideoLoader(props) : JSX.Element {

    const videoId = props.videoId;

    async function initChat() {
        console.log("initChat called");
        console.log("videoId: " + videoId);

        if (videoId == null) {
            console.log("videoId is null");
            return
        }

        const response = await addVideoToCollection(videoId);
        props.setLoadedVideo(true);
    }

    return (
        <div className="videoLoader">
            <div className="videoLoaderTitle" onClick={initChat}>Load Video?</div>
            <div className="videoLoaderBar"></div>
        </div>
    )
}