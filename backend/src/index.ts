import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

type Message = {
  "id": number,
  "username": string,
  "text": string,
  "timestamp": string,
};

const server = express();
const PORT = 4000;

const messages:Message[] = [];

function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield ++i;
  }
}

const idIterator = infiniteSequence();

server.use(cors());
server.use(express.json());

server.get("/messages", function(req: Request, res: Response) {
  res.status(200).json([...messages]);
});

server.post("/messages", function(req: Request, res: Response)  {
  const { username, text } = req.body;

  if (typeof username !=="string") {
    res.status(400).send({
      message: "Invalid username",
    });

    return;
  }

  if (username.length < 2) {
    res.status(400).send({
      message: "Username is too short",
    });

    return;
  }

  if (username.length > 500) {
    res.status(400).send({
      message: "Username is too long",
    });

    return;
  }


  if (typeof text !=="string") {
    res.status(400).send({
      message: "Invalid text message",
    });
   
    return;
  }
  
  if (text.length < 1) {
    res.status(400).send({
      message: "Text message is too short",
    });
   
    return;
  }
  
  if (text.length > 500) {
    res.status(400).send({
      message: "Text message is too long",
    });
   
    return;
  }

  const newMessage = {
    id: idIterator.next().value as number,
    text,
    timestamp: new Date().toISOString(),
    username,
  }

  messages.push(newMessage);
  res.status(201).send(newMessage);
});

server.listen(PORT, function() {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
