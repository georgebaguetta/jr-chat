{
  const container = document.querySelector(".messages");

  function renderMessages(messages) {
    container.innerHTML = "";
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

  function getMessages() {
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

  function initForm() {
    const formContainer = document.querySelector("form");

    const formTextField = formContainer.querySelector('input[name="text"]');
    const usernameField = formContainer.querySelector('input[name="username"]');
    const formSubmitButton = formContainer.querySelector('input[name="username"]');

    formContainer.onsubmit = function (evt) {
      evt.preventDefault();

      const messageData = {
        username: usernameField.value,
        text: formTextField.value,
      };

      formTextField.disabled = true;
      formSubmitButton.disabled = true;
      formSubmitButton.textContent = "Сообщение отправляется...";
    
      console.log("Sending message:", messageData);
      fetch("http://localhost:4000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })
        .then(function (newMessageResponse) {
          console.log(newMessageResponse.status);

          if (newMessageResponse.status !== 200) {
            //
          }

          formTextField.disabled = false;
          formTextField.value = "";
          formSubmitButton.disabled = false;
          formSubmitButton.textContent = "Отправить";
          getMessages();
        });
    }
  }

  function initChat() {

    setInterval(getMessages, 3000);

    getMessages();
    initForm();
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