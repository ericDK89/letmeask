import { getDatabase, ref, remove, update } from "firebase/database";
import { Link, useNavigate, useParams } from "react-router-dom";
import deleteImg from "../assets/images/delete.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Questions } from "../components/Questions";
import { RoomCode } from "../components/RoomCode";
import { useRoom } from "../hooks/useRoom";
import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { id } = useParams<RoomParams>();
  const { questions, title } = useRoom(id);
  const db = getDatabase();
  const navigate = useNavigate();

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await remove(ref(db, `rooms/${id}/questions/${questionId}`));
    }
  }

  async function handleEndRoom() {
    if (window.confirm("Tem certeza que você deseja encerrar a sala?")) {
      await update(ref(db, `rooms/${id}`), {
        endAt: new Date(),
      });

      navigate("/");
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask" />
          </Link>
          <div>
            <RoomCode code={id!} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span className="number-of-questions">
              {questions.length} pergunta(s)
            </span>
          )}
        </div>
        <div className="questions-list">
          {questions.map((question) => {
            return (
              <Questions
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img
                    src={deleteImg}
                    alt="Excluir pergunta"
                    aria-label="Excluir pergunta"
                  />
                </button>
              </Questions>
            );
          })}
        </div>
      </main>
    </div>
  );
}
