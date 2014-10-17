var wsUri="ws://localhost:6078"
var wss=new window.WebSocket(wsUri)
var log=document.getElementById("messagelog")
var onlineEl=document.getElementById("online")
var online=[]
// create my jsCookies function
var jsCookies = {

    // this gets a cookie and returns the cookies value, if no cookies it returns blank ""
    get: function(c_name) {
        var regex = new RegExp(c_name + "=([^;]+)");
        var match = regex.exec(document.cookie);
        return match != null ? unescape(match[1]) : null;
    },

    // this sets a cookie with your given ("cookie name", "cookie value", "good for x days")
    set: function(c_name, value, expiredays) {
        expiredays = expiredays || 365;
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : "; expires=" + exdate.toUTCString());
    },

    // this checks to see if a cookie exists, then returns true or false
    check: function(c_name) {
        return !!jsCookies.get(c_name)
    }

}
var nameKey = "name"
var name = jsCookies.get(nameKey)

// prompt for new name
var chooseName = function () {
  jsCookies.set(nameKey, prompt("What is your unique name?").split(":")[0].slice(0, 18))
  window.location.href = window.location.href // refresh
}

// display server message
var serverMsg = function (text) {
  var tr=document.createElement("TR")
  tr.innerHTML = "<td></td><td><strong style='color:magenta'>server:</strong></td><td>"+text.replace("`",":")+"</td>"
  log.appendChild(tr)
}

wss.onopen = function () {
  if(!jsCookies.check(nameKey)) {
    console.log("Choose name")
    chooseName()
  }
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
