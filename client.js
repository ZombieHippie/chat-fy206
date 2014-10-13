var wsUri="ws://localhost:6078"
var wss=new window.WebSocket(wsUri)
var log=document.getElementById("messagelog")
var onlineEl=document.getElementById("online")
var online=[]
var name = document.cookie
var chooseName = function () {
  document.cookie = name = prompt("What is your unique name?").split(":")[0]
  window.location.href = "/" // refresh
}
var serverMsg = function (text) {
  var tr=document.createElement("TR")
  tr.innerHTML = "<td></td><td><strong style='color:magenta'>server:</strong></td><td>"+text.replace("`",":")+"</td>"
  log.appendChild(tr)
}
wss.onopen = function () {
  if(name.length === 0 or name.test(/:/))
    chooseName()
  wss.send(name+":+::"+Date.now())
  wss.onmessage = function (event) {
    msg=event.data.split(":")

    type = msg[1]
    sender = msg[0]
    text = msg[2]
    time = ""
    try {
      date = new Date(parseInt(msg[3]))
      time = date.toLocaleString()
    } catch(err){}
    switch(type) {
      case "m":
        var tr=document.createElement("TR")
        tr.innerHTML = "<td>"+time+"</td><td><strong>"+sender+":</strong></td><td>"+text.replace("`",":")+"</td>"
        log.appendChild(tr)
        break;
      case "s":
        serverMsg(text)
        break;
      case "+":
        var li=document.createElement("LI")
        li.innerText=text
        li.id="user-"+text
        onlineEl.appendChild(li)
        serverMsg("user joined: " + text)
        break;
      case "-":
        var li = document.getElementById("user-"+text)
        li != null && li.remove()
        serverMsg("user left: " + text)
        break;
    }
  }
  window.sendMessage = function (message) {
    if (message.length)
      wss.send(name+":m:" + message.replace(":","`") + ":" + Date.now())
    return false
  }
  document.getElementById('send_btn').style.display = null
}
