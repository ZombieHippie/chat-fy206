http = require('http')
WebSocketServer = require('ws').Server
wss = new WebSocketServer({port: 6078})
fs = require 'fs'
require './node_modules/jade-dev/jade-dev.js'

clients = []
lastsender = null
msgsrow = 0

Msg = (name, text, type="m") ->
  [name, type, text.replace(/[:\n]/g,'`'), Date.now()].join(':')

broadcast = (name, text, type="m") ->
  data = Msg(name, text, type)
  if type is "m"

    # Prevent spamming
    if lastsender is name
      msgsrow++
      if msgsrow > 4
        # too many in a row
        return
    else
      msgsrow = 0
      lastsender = name

    fs.appendFile "./messages.log", data + "\n", ((error)->error? and console.error(error))
  for client in clients when client._chatname?
    client.send data

  console.log localDate(), data

localDate = ->
  (new Date).toLocaleString()

onClientConnection = (ws) ->
  ws.on "message", onClientMessage
  ws.on "close", onClientClose
  clients.push ws

onClientClose = ->
  selfIndex = clients.indexOf @
  if selfIndex isnt -1
    clients.splice(selfIndex, 1)[0]
    if @_chatname
      broadcast(null, client._chatname + " left the chatroom", "s")
      broadcast(null, @_chatname, "-")

onClientMessage = (data) ->
  messageParts = data.split(":")
  self = @

  if messageParts.length is 4
    m = {
      name: messageParts[0]
      type: messageParts[1]
      text: messageParts[2]
      date: messageParts[3]
    }

    switch m.type
      when "+"
        # Logged on
        self._chatname = m.name

        fs.readFileSync("./messages.log", "utf8").split("\n").slice(0,25).forEach self.send.bind(self)

        # Update new log client's online list
        for client in clients when client isnt self and client._chatname
          self.send Msg(null, client._chatname, "+")

        self.send Msg(null, "Welcome to the most bomb-ass chatroom!", "s")
        broadcast(null, self._chatname + " joined the chatroom", "s")
        broadcast(null, m.name, "+")

      when "m"
        broadcast(m.name, m.text)

wss.on('connection', onClientConnection)
