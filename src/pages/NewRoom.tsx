import { getDatabase, push, ref } from "firebase/database";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState("");
  const navigate = useNavigate();
  const db = getDatabase();

  async function handleCreateNewRoom(e: FormEvent) {
    e.preventDefault();

    if (newRoom.trim() === "") {
      return toast.warn("O nome da sala não pode estar vazio", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    const firebaseRoom = push(ref(db, "rooms/"), {
      title: newRoom,
      authorId: user?.id,
      authorEmail: user?.email,
    });

    navigate(`/rooms/${firebaseRoom.key}`, { replace: true });
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
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateNewRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(e) => setNewRoom(e.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala já existente?{" "}
            <Link to="/"> Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
