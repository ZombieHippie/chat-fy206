var wsUri="ws://chatws.fy206.info"
var wss=new window.WebSocket(wsUri)
var log=document.getElementById("messagelog")
wss.onopen = function () {
  var name=prompt("What is your name?").split(":")[0]
  wss.onmessage = function (event) {
    msg=event.data.split(":")
    switch(msg[0]){
      case "m":
        tr=document.createElement("TR")
        tr.innerHTML = "<td><strong>"+msg[1]+":</strong></td><td>"+msg[2].replace("`",":")+"</td>"
        log.appendChild(tr)
        break;
      case "s":
        tr=document.createElement("TR")
        tr.innerHTML = "<td><strong style='magenta'>Server:</strong></td><td>"+msg[1].replace("`",":")+"</td>"
        log.appendChild(tr)
        break;
    }
  }
  window.sendMessage = function (message) {
    wss.send(name + ":" + message.replace(":","`") + ":" + Date.now())
  }
  document.getElementById('send_btn').style.display = null
}
