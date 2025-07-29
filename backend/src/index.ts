import express, { Request, Response } from "express";
import cors from "cors"; //CORS нужен, чтобы к API можно было обращаться с других доменов (например, с фронтенда)
import path from "path";
import { readFile, writeFile } from 'fs/promises';



// Тип сообщения, которое будет храниться
type Message = {
  "id": number,
  "username": string,
  "text": string,
  "timestamp": string,
};

const server = express(); // Создаём экземпляр сервера
const PORT = 4000;        // Порт, на котором будет запущен сервер

const messages: Message[] = [];

async function saveMessages() {
    await writeFile('messages.json', JSON.stringify(messages, null, 2), 'utf-8');
}

function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield ++i;
  }
}

const idIterator = infiniteSequence();

// Подключаем middleware
server.use(cors()); // Разрешаем CORS
server.use(express.json()); // Автоматический парсинг JSON в теле запроса

// Получение всех сообщений (GET /messages)

server.get("/messages", function(req: Request, res: Response) {
  res.status(200).json([...messages]);
});



// Создание нового сообщения (POST /messages)
server.post("/messages", function(req: Request, res: Response)  {
  const { username, text } = req.body;

  // Валидация username
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

  // Валидация текста
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

  // Формируем новое сообщение
  const newMessage = {
    id: idIterator.next().value as number,
    text,
    timestamp: new Date().toISOString(),
    username,
  }

  // Сохраняем его в массив и отправляем клиенту
  messages.push(newMessage);
  res.status(201).send(newMessage);
  saveMessages();  
});

async function loadMessages() {
  try {
    const savedMessages = readFile('messages.json', 'utf-8');
    const loadedMessages = JSON.parse(await savedMessages);
    if(Array.isArray(loadedMessages)) {
      messages.push(...loadedMessages);
    }
  }
  catch(err) {
    console.log(err);
  }
}

async function startServer() {
  await loadMessages();
  server.listen(PORT, function() {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

startServer();

// Запускаем сервер

