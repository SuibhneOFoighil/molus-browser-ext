import { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"

import { addVideoToCollection, queryVideo } from "~chat"

import Message from "~message"
import Summary from "~summary"

import RenderMessage from "~RenderMessage"
import RenderSummary from "~RenderSummary"

export default function ChatInterface(prop) : JSX.Element {

    const videoId = prop.videoId;
    const [response, setResponse] = useState(null)
    const [gettingResponse, setGettingResponse] = useState(false)
    const [query, setQuery] = useState(null)
    const init_chat_history = [
        new Message({
          video_id: videoId,
          query: "",
          answer: "Hey👋, welcome to Molus! Open a YouTube video and ask me about it. I'll try my best to answer!",
          citations: "",
          timestamp: new Date(Date.now()).toString()
        })
    ];

    const [chatHistory, setChatHistory] = useStorage<Message[]>({
        key: "$chatHistory_{videoId}",
        instance: new Storage({
        area: "local"
        })
    }, (v) => v == undefined ? init_chat_history : v);

    const [summary, setSummary] = useStorage<Summary>({
        key: "$summary_{videoId}",
        instance: new Storage({
          area: "local"
        })
      }, (v) => v == undefined ? null : v);;
    // HELPER FUNCTIONS
    async function getResponse() {

        setGettingResponse(true);

        console.log("getResponse called");
        console.log("query: " + query);
        console.log("video_id: " + videoId);

        if (videoId == null) {
            console.log("videoId is null");
            setResponse({
            'answer': "Hey sorry, we can't chat right now😕. Please open a YouTube video and try again!",
            'citations': ''
            })
            setGettingResponse(false);
            return
        }

        if (query == null) {
            console.log("query is null");
            setResponse({
            'answer': "Hey sorry, we can't chat right now😕. Please type something in the chat box and try again!",
            'citations': ''
            })
            setGettingResponse(false);
            return
        }

        const postResponse = await addVideoToCollection(videoId);
        const success = postResponse['success'];
        if (!success) {
            console.log("failed to add video to collection");
            setResponse({
                'answer': "Hey sorry, we can't chat right now: " + postResponse['error'],
                'citations': ''
            })
            setGettingResponse(false);
            return
        }

        queryVideo(query, videoId)
        .then((data) => {
            console.log("data: " + data);
            setResponse(data);
            setGettingResponse(false);
        })
        .catch((error) => {
            console.log(error);
            setResponse({
                'answer': "Hey sorry, we can't chat right now. Please try again later!",
                'citations': ''
            })
            setGettingResponse(false);
        });
    }

    function clearHistory() {
        setChatHistory(init_chat_history);
        console.log("clearHistory called");
    }

    const handleSend = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault();
        getResponse();
        }
    }

    // UPDATE CHAT HISTORY
    // EVENT HANDLER 2
    useEffect(() => {
        if (response != null) {
        const newMessage = new Message({
            video_id: videoId,
            query: query,
            answer: response['answer'],
            citations: response['citations'],
            timestamp: new Date(Date.now()).toString()
        })
        const newChatHistory = [newMessage, ...chatHistory]
        setChatHistory(newChatHistory)
        }
    }, [response]) 

    return (
        <div className="chatBody">
          <div className="chatHistory">
          <ul className="feed">
            {RenderSummary(summary)}
            {chatHistory.map((message, index) => RenderMessage(message, index))}
          </ul>
          </div>
          <div className="chatFooter">
            <img id="clear" src={require('./assets/broom.png')} alt="clear" title="Clear the chat." onClick={clearHistory}></img>
            <div className="inputBox">
              <textarea 
                id="input" 
                placeholder="Enter your question here..." 
                title="Press enter to send a message."
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleSend}
              />
              <div className="inputBoxButtons">
                { 
                  gettingResponse ? 
                  <img id="loading" src={require('./assets/loading.gif')} alt="loading..."></img> :
                  <></>
                  // <img 
                  //   id="send" 
                  //   src={require('./assets/fast-forward.png')} alt="⏩" 
                  //   onClick={getResponse}
                  //   title="Get the answer."
                  // ></img>
                }
              </div>
            </div>
            {/* <p className="disclaimer">
              Molus is currently free 💜.
              <button onClick={() => onLogout()} id="logout">Logout</button>
            </p> */}
          </div>
        </div>
    )
}