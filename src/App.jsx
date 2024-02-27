import React, { useEffect, useMemo, useState } from 'react'
import { io } from "socket.io-client"
import { Button, Container, Stack, TextField, Typography, Chip } from '@mui/material'

function App() {

  const socket = useMemo(() => io('https://basic-chat-be.vercel.app'), [])

  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [socketId, setSocketId] = useState('')
  const [messages, setMessages] = useState([])
  const [createRoom, setCreateRoom] = useState('')
  const [userName, setUserName] = useState('')

  const [activeUsers, setActiveUsers] = useState([])

  

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
      console.log("Connected to server with id" + socket.id)
    })
    socket.on('user_connected', (data) => { setActiveUsers(data) })
    socket.on("receave-message", (data) => {
      console.log(data);
      setMessages((message) => [...message, data.message]);
    })
    console.log("hii");
    return () => { socket.disconnect() }
  }, [])

  console.log(activeUsers);

  const handleOnCreateRoom = (e) => {
    e.preventDefault()
    socket.emit('join-room', createRoom)
    setCreateRoom('');
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', { message, room, userName })
    // setMessage('')
    console.log({ message, room, userName });
  }

  const handleUserName = (e) => {
    e.preventDefault()
    socket.emit('userName', userName)
  }

  const handleOnChipClick = (data)=> {
    setRoom(data.socketId)
  }

  const uName = activeUsers.filter(data => data.socketId == room)

let mainUser = uName.map(data => data.userName).toString()

console.log(mainUser);
  return (
    < div style={{display: 'flex', flexDirection: 'row'}}>
    <Container maxWidth='sm'>
      <Typography variant='h3' component='div' gutterBottom>
        Welcome Chat!
      </Typography >
      <Typography variant='h5' component='div' gutterBottom>
        {
          userName ? userName : socketId
        }
      </Typography>

      <form onSubmit={handleUserName}>
      <TextField value={userName} onChange={(e) => setUserName(e.target.value)} label="User Name" variant='outlined' id='outlined-basic' />
        <Button type='submit'>Add</Button>
      </form>

      <br />
      <form onSubmit={handleOnCreateRoom} >
        <TextField value={createRoom} onChange={(e) => setCreateRoom(e.target.value)} label="Room Name" variant='outlined' id='outlined-basic' />
        <Button type='submit' >Join</Button>
      </form>

      <br />

      <form onSubmit={handleOnSubmit}>
        <TextField value={message} onChange={(e) => setMessage(e.target.value)} label="Message" variant='outlined' id='outlined-basic' />
        <TextField value={mainUser} onChange={(e) => setRoom(e.target.value)} label="User" variant='outlined' id='outlined-basic' />

        <Button type='submit' >Send</Button>
      </form>

      <Stack>
        {
          messages.map((m, id) => {
            return <Typography key={id} variant='h6' component='div' gutterBottom>
              {m}
            </Typography>
          })
        }
      </Stack>

    </Container>

    <Container maxWidth='sm'>
    <Typography variant='h3' component='div' gutterBottom>
        Online Users
      </Typography>
      <Typography variant='h6' component='div' gutterBottom>
      {
        activeUsers.map((data, index) => {
          return  <Chip key={index} label={data.userName} onClick = { () => handleOnChipClick(data) } />
        })
      }
      </Typography>
    </Container>
    </ div>
    
  )
}

export default App