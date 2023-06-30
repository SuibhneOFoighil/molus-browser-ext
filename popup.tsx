import { useFirebase } from "~firebase/hook"
import { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"

import RenderMessage from "~RenderMessage"
import Message from "~message"
import { addVideoToCollection, queryVideo } from "~chat"
import { UserInfoProvider, useUserInfo } from "~core/user-info"
import "./popup.css"

const MolusPopup = () => {

  // STATE VARIABLES
  const { user, isLoading, onLogin, onLogout } = useFirebase()
  const [response, setResponse] = useState(null)
  const [gettingResponse, setGettingResponse] = useState(false)
  const [query, setQuery] = useState(null)
  const [videoId, setVideoId] = useState(null)

  // STORAGE VARIABLES
  const init_chat_history = [
    new Message({
      video_id: videoId,
      query: "",
      answer: "Hey👋, welcome to Molus! Open a YouTube video and ask me about it. I'll try my best to answer!",
      citations: "",
      timestamp: new Date(Date.now()).toString()
    })
  ]

  const [chatHistory, setChatHistory] = useStorage<Message[]>({
    key: "chatHistory",
    instance: new Storage({
      area: "local"
    })
  }, (v) => v == undefined ? init_chat_history : v);

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
      setChatHistory(newChatHistory)
    }
  }, [response]) 

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

    const addCollectionResponse = await addVideoToCollection(videoId);
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

  // HELPER FUNCTIONS
  function clearHistory() {
    setChatHistory(init_chat_history);
    console.log("clearHistory called");
  }

  const handleSend = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      getResponse();
      setQuery("");
    }
  }

  // const dummyuser = true;
 
  // const EmailShowcase = () : JSX.Element => {
  //   const userInfo = useUserInfo()

  //   return (
  //     <div>
  //       Your email is: <b>{userInfo?.email}</b>
  //       Your id is: <b>{userInfo?.id}</b>
  //     </div>
  //   )
  // }
  // <UserInfoProvider>
  //   <EmailShowcase />
  // </UserInfoProvider>

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
            {chatHistory.map((message, index) => RenderMessage(message, index))}
          </ul>
          </div>
          <div className="chatFooter">
            <img id="clear" src={require('./assets/broom.png')} alt="clear" title="Clear the chat." onClick={clearHistory}></img>
            <div className="inputBox">
              <textarea 
                id="input" 
                placeholder="Press enter to send a message..." 
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
        )}
    </div>
  )
}

export default MolusPopup;
