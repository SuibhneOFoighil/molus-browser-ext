import { useFirebase } from "~firebase/hook"
import { useEffect, useState } from "react"

import LoginScreen from "~RenderLogin"
import ChatInterface from "~RenderChat"
import VideoLoader from "~RenderVideoLoader"
// import { UserInfoProvider, useUserInfo } from "~core/user-info"
import "./popup.css"

const MolusPopup = () => {

  // STATE VARIABLES
  const { user, isLoading, onLogin, onLogout } = useFirebase()
  const [videoId, setVideoId] = useState(null)
  const [loadedVideo, setLoadedVideo] = useState(false)

  // STORAGE VARIABLES

  // GET VIDEO ID FOR STORAGE KEY
  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      const url = new URL(tab.url);
      const video_id = url.searchParams.get("v");
      setVideoId(video_id);
      console.log("video_id: " + video_id);
    });
  }, [])

  // VIDEO SPECIFIC STORAGE

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
        {
          !!!user ? <LoginScreen />
          : !!!loadedVideo ? <VideoLoader videoId={videoId} setLoadedVideo={setLoadedVideo}/>
          : <ChatInterface/>
        }
    </div>
  )
}

export default MolusPopup;
