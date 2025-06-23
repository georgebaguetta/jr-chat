{
  const USERNAME_REC = "username";

  let username = null;

  const chatContainer = document.querySelector(".messages");
  const usernameContainer = document.querySelector(".username");
  const logoutButton = document.querySelector("#logout-button");

  function renderMessages(messages) {
    chatContainer.innerHTML = "";

    for (const message of messages) {
      const messageElement = document.createElement("article");
      messageElement.className = "message";
      messageElement.classList.toggle("message-mine", username === message.username);

      messageElement.innerHTML = `
        <div class="message-header">
          <div class="message-author">${message.username}</div>
          <button class="message-control"></button>
        </div>
        <p class="message-text">${message.text}</p>
        <time class="message-time">${message.timestamp}</time>
      `;

      chatContainer.appendChild(messageElement);
    }
  }

  function getMessages(cb) {
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
        renderMessages(messagesList);

        if (typeof cb === "function") {
          cb();
        }
      });
  }

  function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function initForm() {
    const formContainer = document.querySelector("#message-form");

    const formTextField = formContainer.querySelector("textarea");
    const formSubmitButton = formContainer.querySelector("button");

    const usernameField = formContainer.querySelector("input[name=username]");
    usernameField.value = username;

    formContainer.onsubmit = function (evt) {
      evt.preventDefault();

      const formData = new FormData(evt.target);

      const messageData = {
        username: formData.get("username"),
        text: formData.get("text"),
      };

      formTextField.disabled = true;
      formSubmitButton.disabled = true;
      formSubmitButton.textContent = "Сообщение отправляется...";

      fetch("http://localhost:4000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })
        .then(function (newMessageResponse) {
          if (newMessageResponse.status !== 200) {
            //
          }

          formTextField.disabled = false;
          formTextField.value = "";
          formSubmitButton.disabled = false;
          formSubmitButton.textContent = "Отправить";

          getMessages(scrollToBottom);
        });
    }
  }

  function initChat() {

    toggleLoginLogoutStyles();
    getMessages();
    setInterval(getMessages, 3000);
    initForm();
  }


  function initUsernameForm() {
    const usernameForm = usernameContainer.querySelector("form");


    usernameForm.onsubmit = function (evt) {
      evt.preventDefault();

      const formElement = evt.target;
      const formData = new FormData(formElement);
      const enteredUsername = formData.get("username");

      localStorage.setItem(USERNAME_REC, enteredUsername);

      usernameContainer.close();
      usernameForm.onsubmit = null;

      initApp();
    };

    toggleLoginLogoutStyles()
    usernameContainer.showModal();
  }

  function toggleLoginLogoutStyles() {
    if (username === null) {
      document.querySelector('body').classList.add("logout");
      document.querySelector('.message-form').classList.add("hide-message-form");
    }

    if (username != null) {
        document.querySelector('body').classList.remove("logout");
        document.querySelector('.message-form').classList.remove("hide-message-form");
    }
  }

  function initApp() {
    username = localStorage.getItem(USERNAME_REC);

    if (username == null) {
      initUsernameForm();
      return;
    }
    initChat();
  }

    logoutButton.addEventListener('click', function(){
      console.log('lalal')
      localStorage.removeItem(USERNAME_REC);
      location.reload();
    })

  initApp();
}