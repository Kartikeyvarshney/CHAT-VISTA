const socket = io();
let userMessage = document.querySelector("#userMassage");
const username = document.querySelector("#user-name");
const messageBox = document.querySelector(".messagesBox");
const sendBtn = document.querySelector(".fa-paper-plane");

sendBtn.addEventListener("click", (e) => {
  let msg = {
    user: username.textContent,
    message: userMessage.value.trim(),
  };
  if (msg.message === "") {
    alert("Cannot send blank messasges.");
  } else {
    userMessage.value = "";
    sendMessageToServer(msg);
  }
});

userMessage.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (e.shiftKey) {
      userMessage.value = "\n" + userMessage.value;
    }
    else {
        let msg = {
          user: username.textContent,
          message: userMessage.value.trim(),
        };
        if (msg.message === "") {
          alert("Cannot send blank messasges.");
        } else {
          userMessage.value = "";
          sendMessageToServer(msg);
        }
      }
  } 
});

function sendMessageToServer(userMessage) {
  appendMessage(userMessage, "outgoing");

  // sending message to server

  socket.emit("messageToServer", userMessage);
}
function appendMessage(message, type) {
  let messageDiv = document.createElement("div");
  messageDiv.classList.add(type);

  let markup = `
        <h4 class="userName">${message.user}</h4>
        <div class="message">${message.message}</div>
    `;
  messageDiv.innerHTML = markup;
  messageBox.appendChild(messageDiv);
  messageBox.scrollTop = messageBox.scrollHeight;
}

// Recieving messasge

socket.on("messageFromServer", (msg) => {
  appendMessage(msg, "incoming");
});
