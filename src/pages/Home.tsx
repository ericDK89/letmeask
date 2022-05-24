import { child, get, getDatabase, ref } from "firebase/database";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logoGoogle from "../assets/images/google-icon.svg";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import "../styles/auth.scss";

export function Home() {
  const { user, singInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    const roomsRef = await get(child(ref(getDatabase()), `/rooms/${roomCode}`));

    if (roomCode.trim() === "") {
      return toast.warn("Insira o código da sala", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (!(await roomsRef).exists()) {
      return toast.error("Sala não existe!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    navigate(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="ilustração" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real.</p>
      </aside>
      <main>
        <div>
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={singInWithGoogle}>
            <img src={logoGoogle} alt="entre com o Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
