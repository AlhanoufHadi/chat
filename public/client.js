const socket = io()
var server = "http://localhost:3000";
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
do {
    name = prompt('Please enter your name: ')
} while(!name)
var nam= document.getElementById("userName");
 let userName = `
        <h2>${name}</h2>  `
nam.innerHTML = userName;
textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message) {
    let msg =
    {
        user:name,
        message:message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)
    console.log("Server says",msg);
}

function appendMessage(msg,type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')
    mainDiv.innerHTML = "" + msg.user + ": " + msg.message;
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}
$.ajax({
    url: server + "/get_messages",
    method: "GET",
    success: function (response) {
        console.log(response);
        // parse JSON to javascript object
        var data = JSON.parse(response);
        for (var a = 0; a < data.length; a++) {
            // creates new DOM element
            let mainDiv = document.createElement('div')
            // add message content as HTML
            mainDiv.innerHTML = "" + data[a].user + ": " + data[a].message;
            // append at the end of list
           messageArea.appendChild(mainDiv)
        }
    }
});
