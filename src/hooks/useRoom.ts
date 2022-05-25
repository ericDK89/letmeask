import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      avatar: string;
      email: string;
      name: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

interface Questions {
  id: string;
  author: {
    avatar: string;
    email: string;
    name: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

export function useRoom(id: string | undefined) {
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState("");
  const db = getDatabase();

  useEffect(() => {
    const roomRef = ref(db, `rooms/${id}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      setTitle(data.title);
      const firebase: FirebaseQuestions = data.questions ?? {};
      const parsedQuestions = Object.entries(firebase).map(([key, value]) => {
        return {
          id: key,
          author: {
            avatar: value.author.avatar,
            email: value.author.email,
            name: value.author.name,
          },
          content: value.content,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
        };
      });
      setQuestions(parsedQuestions);
    });
  }, [id]);

  return { questions, title };
}
