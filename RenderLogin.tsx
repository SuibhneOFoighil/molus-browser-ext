import { useFirebase } from "~firebase/hook"
export default function LoginScreen() {
    const { user, isLoading, onLogin, onLogout } = useFirebase()
    return (
        <div className="chatLogin">
            <p id="loginUVP"><p id="loginTag">Know the content faster:</p> chat with YouTube videos, ask questions, and get the answer from the source.</p>
            <button id="login-btn"onClick={() => onLogin()}>Login</button>
            <p id="login-disclaimer">Molus is free for early birds 💜.</p>
        </div>
    )
}