import { useFirebase } from "~firebase/hook"
import { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"

import RenderMessage from "~RenderMessage"
import Message from "~message"
import { addVideoToCollection, queryVideo } from "~chat"
import "./popup.css"

export default function IndexPopup() {
  const { user, isLoading, onLogin, onLogout } = useFirebase()

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>
      {!user ? (
        <button onClick={() => onLogin()}>Log in</button>
      ) : (
        <button onClick={() => onLogout()}>Log out</button>
      )}
      <div>
        {isLoading ? "Loading..." : ""}
        {!!user ? (
          <div>
            Welcome to Plasmo, {user.displayName} your email address is{" "}
            {user.email}
          </div>
        ) : (
          ""
        )}
      </div>

      <footer>Crafted by @PlamoHQ</footer>
    </div>
  )
}
