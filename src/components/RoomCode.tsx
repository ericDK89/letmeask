import { toast } from "react-toastify";
import copyImg from "../assets/images/copy.svg";
import "../styles/room-code.scss";

interface RoomCodeProps {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);
    toast.info("Copiado!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Sala #{code}</span>
    </button>
  );
}
