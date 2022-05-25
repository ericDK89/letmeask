import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

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
    likes: Record<
      string,
      {
        authorId: string;
        authorName: string;
        authorEmail: string;
      }
    >;
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
  likeCount: number;
  likeId: string | undefined;
}

export function useRoom(id: string | undefined) {
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState("");
  const { user } = useAuth();
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
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(
            ([key, like]) => like.authorId === user?.id
          )?.[0],
        };
      });
      setQuestions(parsedQuestions);
    });
  }, [id, user?.id]);

  return { questions, title };
}
