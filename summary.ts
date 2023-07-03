export default class Summary {
    video_id: string;
    title: string;
    channel: string;
    keypoints: string;
  
    constructor(entry: Record<string, any>) {
        this.video_id = entry.video_id;
        this.title = entry.title;
        this.channel = entry.channel;
        this.keypoints = entry.keypoints;
    }
}