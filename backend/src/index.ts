import express, { Request, Response } from "express";
import cors from "cors"; //CORS нужен, чтобы к API можно было обращаться с других доменов (например, с фронтенда)
import { Client } from "pg";

const PORT = process.env.APP_PORT || 4000; // Порт, на котором будет запущен сервер


// Тип сообщения, которое будет храниться
type Message = {
  id: number;
  username: string;
  text: string;
  timestamp: string;
};

const pgClient = new Client();
const server = express(); // Создаём экземпляр сервера

const messages: Message[] = []; // Хранилище сообщений в оперативной памяти (не БД)

function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield ++i;
  }
}

async function initServer() {

  if(!process.env.PGUSER) {
    throw new Error("Server cannot be started without database credentials in .env file");
    
  }

  const idIterator = infiniteSequence();

  // Подключаем middleware
  server.use(cors()); // Разрешаем CORS
  server.use(express.json()); // Автоматический парсинг JSON в теле запроса

  // Получение всех сообщений (GET /messages)
  server.get("/messages", function (req: Request, res: Response) {
    res.status(200).json([...messages]);
  });

  // Создание нового сообщения (POST /messages)
  server.post("/messages", function (req: Request, res: Response) {
    const { username, text } = req.body;

    // Валидация username
    if (typeof username !== "string") {
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

    // Валидация текста
    if (typeof text !== "string") {
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

    // Формируем новое сообщение
    const newMessage = {
      id: idIterator.next().value as number,
      text,
      timestamp: new Date().toISOString(),
      username,
    };

    // Сохраняем его в массив и отправляем клиенту
    messages.push(newMessage);
    res.status(201).send(newMessage);
  });

  await pgClient.connect();

  // Запускаем сервер
  server.listen(PORT, function () {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

process.on("exit", async function () {
  await pgClient.end();
});

initServer();
