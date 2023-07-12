import { useFirebase } from "~firebase/hook"
import { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"

import RenderMessage from "~RenderMessage"
import Message from "~message"
import RenderSummary from "~RenderSummary"
import Summary from "~summary"

import { addVideoToCollection, queryVideo } from "~chat"
import "./popup.css"

const MolusPopup = () => {

  // STATE VARIABLES
  const { user, isLoading, onLogin, onLogout } = useFirebase()
  const [response, setResponse] = useState(null)
  const [gettingResponse, setGettingResponse] = useState(false)
  const [query, setQuery] = useState(null)
  const [videoId, setVideoId] = useState(null)

  // STORAGE VARIABLES
  const [chatHistoryDict, setChatHistoryDict] = useStorage<Record<string, Message[]>>({
    key: "chatHistory",
    instance: new Storage({
      area: "local"
    })
  }, (v) => v == undefined ? {} : v);

  const [videoSummaryDict, setVideoSummaryDict] = useStorage<Record<string, Summary>>({
    key: "videoSummary",
    instance: new Storage({
      area: "local"
    })
  }, (v) => v == undefined ? {} : v)

  // GET VIDEO ID
  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      const url = new URL(tab.url);
      const video_id = url.searchParams.get("v");
      setVideoId(video_id);
      console.log("video_id: " + video_id);
    });
  }, [])

  const init_chat_history = [
    new Message({
      video_id: videoId,
      query: "",
      answer: "Hey👋, welcome to Molus! Open a YouTube video and ask me about it. I'll try my best to answer!",
      citations: "",
      timestamp: new Date(Date.now()).toString()
    })
  ]

  let chatHistory = chatHistoryDict[videoId] || init_chat_history;
  let videoSummary = videoSummaryDict[videoId] || null;

  // UPDATE CHAT HISTORY
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
      chatHistory = newChatHistory
      setChatHistoryDict({
        ...chatHistoryDict,
        [videoId]: newChatHistory
      })
    }
  }, [response])

  // Remove INIT message
  useEffect(() => {
    if (videoSummary != null && chatHistory.length > 0 && chatHistory[0].answer == init_chat_history[0].answer) {
      chatHistory.shift()
      setChatHistoryDict({
        ...chatHistoryDict,
        [videoId]: chatHistory
      })
    }
  }, [videoSummary])

  // EVENT HANDLERS
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

    const addCollectionResponse = await addVideoToCollection(videoId, false, user);
    const success = addCollectionResponse['success'];
    if (!success) {
        console.log("failed to add video to collection");
        setResponse({
            'answer': "Hey sorry, we can't chat right now: " + addCollectionResponse['error'],
            'citations': ''
        })
        setGettingResponse(false);
        return
    }

    queryVideo(query, videoId, user)
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

  async function getSummary() {
    // get summary from server
    setGettingResponse(true);
    console.log("getSummary called");
    console.log("videoId: " + videoId);
    if (videoId == null) {
      console.log("videoId is null");
      setResponse({
        'answer': "Hey sorry, we can't chat right now😕. Please open a YouTube video and try again!",
        'citations': ''
      })
      setGettingResponse(false);
      return
    }

    const addCollectionResponse = await addVideoToCollection(videoId, true, user);
    const success = addCollectionResponse['success'];
    if (!success) {
      console.log("failed to add video to collection");
      setResponse({
        'answer': "Hey sorry, we can't chat right now: " + addCollectionResponse['error'],
        'citations': ''
      })
      setGettingResponse(false);
      return
    }

    const summaryJson = addCollectionResponse['summary'];
    const summary = new Summary(summaryJson);
    videoSummary = summary;
    setVideoSummaryDict({
      ...videoSummaryDict,
      [videoId]: summary
    })
    setGettingResponse(false);
  }

  // HELPER FUNCTIONS
  function clearHistory() {
    setChatHistoryDict({
      ...chatHistoryDict,
      [videoId]: init_chat_history
    })
    setVideoSummaryDict({
      ...videoSummaryDict,
      [videoId]: null
    })
    console.log("clearHistory called");
  }

  const handleSend = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // get summary if it doesn't exist
      // otherwise get response
      if (videoSummary == null) {
        console.log("videoSummary is null");
        getSummary();
      } else {
        console.log("videoSummary is not null");
        getResponse();
      }
      e.target.value = "";
    }
  }

  // const dummyuser = true;

  return (
    <div className="chatBox">
      <div className="chatHeader">
        <img id="headerLogo" src={require('./assets/icon.png')} alt="ᐅᐅ"></img>
        <div id="chatHeaderTitle">Molus</div>
      </div>
        {!!!user ? (
          <div className="chatLogin">
            <p id="loginUVP"><p id="loginTag">Know the content faster:</p> chat with YouTube videos, ask questions, and get the answer from the source.</p>
            <button id="login-btn"onClick={() => onLogin()}>Login</button>
            <p id="login-disclaimer">Molus is free for early birds 💜.</p>
          </div>
        ) : (
        <div className="chatBody">
          <div className="chatHistory">
          <ul className="feed">
            {/* <div id="export-container">
              export to google docs
              <img id="export" src={require('./assets/google-docs.png')} alt="Export" title="Export to Google Docs" onClick={() => alert('clicked!')}></img>
            </div> */}
            {chatHistory.map((message, index) => RenderMessage(message, index))}
            {RenderSummary(videoSummary)}
          </ul>
          </div>
          <div className="chatFooter">
            {/* <img id="clear" src={require('./assets/broom.png')} alt="clear" title="Clear the chat." onClick={clearHistory}></img> */}

            <div className="inputBox">
              <textarea 
                id="input" 
                placeholder={ (videoSummary == null) ? "Press enter to load the video!" :  "Press enter to send a message..."  } 
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleSend}
              />
              <div className="inputBoxButtons">
                { 
                  gettingResponse ? 
                  <img id="loading" src={require('./assets/loading.gif')} alt="loading..."></img> :
                  <></>
                }
              </div>
            </div>
            {/* <p className="disclaimer">
              Molus is currently free 💜.
              <button onClick={() => onLogout()} id="logout">Logout</button>
            </p> */}
          </div>
        </div>
        )}
    </div>
  )
}

export default MolusPopup;