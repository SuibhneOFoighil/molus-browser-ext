import { formatTimestamp } from "./helpers"
import Message from "~message";

function Citation(citation: string, video_id: string, index: number) {

  //get the citation number and timestamp
  const split = citation.split("t=")
  const citationNumber = split[0];
  const timestamp = split[1];
  //convert timestamp to seconds and minutes and hours
  //only include hours if there are hours
  const timestampString = formatTimestamp(timestamp as unknown as number);

  return (
    <li className="citation-line" key={index} onClick={(e) => {
      //get the URL from the current tab
      //add the timestamp to the URL and reload the page
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let tab = tabs[0];
        let url = new URL(tab.url);
        url.searchParams.set('t', timestamp);
        url.searchParams.set('v', video_id);
        const newUrl = url.toString();
        chrome.tabs.update(tab.id, { url: newUrl});
      });
    }}>
      {citationNumber} @ <span className="citation">{timestampString}</span>
    </li>
  )
}

export default function RenderMessage(message: Message, index: number) {

  const isList = typeof message.citations != 'string';

  return (
    <li key={index} className="message">
      <p className="question">{message.query}</p>
      <p className="answer">{message.answer}</p>
      <ul className="citations">
        { 
          isList ? 
          message.citations.map((citation, index) => Citation(citation, message.video_id, index))
          : message.citations
        }
      </ul>
    </li>
  )
}