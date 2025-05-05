{
  const container = document.querySelector(".messages");

  function renderMessages(messages) {
    for (const message of messages) {
      const messageElement = document.createElement("article");
      messageElement.className = "message";

      messageElement.innerHTML = `
        <div class="message-author">${message.username}</div>
        <button class="message-control"></button>
        <p class="message-text">${message.text}</p>
        <time>${message.timestamp}</time>
      `;

      container.appendChild(messageElement);
    }
  }

  function initChat() {
    fetch("http://localhost:4000/messages", {
      method: "GET",
    })
      .then(function (messagesResponse) {
        if (messagesResponse.status !== 200) {
          throw new Error("Couldn't get messages from server");
        }

        return messagesResponse.json();
      })
      .then(function (messagesList) {
        console.log(messagesList);
        renderMessages(messagesList);
      });
  }

  initChat();

  const dotButtons = document.querySelectorAll(".message-control");
  const menuButton = document.querySelector(".menu-button");
  
  dotButtons.forEach(button => {
    button.addEventListener('click', function () {
      const parent = button.closest('.message');
      const options = parent.querySelector('.options-wrapper');
      options.classList.toggle('active');
    });
  });

  menuButton.addEventListener("click", function () {
    const options = document.querySelector(".menu-control")
    options.classList.toggle("active");
  });

  

}