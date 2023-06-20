export default class Message {
    video_id: string;
    query: string;
    answer: string;
    citations: string[];
    timestamp: string;
  
    constructor(entry: Record<string, any>) {
      this.video_id = entry.video_id;
      this.query = entry.query;
      this.answer = entry.answer;
      this.citations = entry.citations;
      this.timestamp = entry.timestamp;
    }
}