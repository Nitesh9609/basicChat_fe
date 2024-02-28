import React, { useEffect, useMemo, useState } from 'react'
import { io } from "socket.io-client"
import { Button, Container, Stack, TextField, Typography, Chip } from '@mui/material'
import './App.css'
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function App() {

  const socket = useMemo(() => io('http://localhost:8080'), [])

  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [socketId, setSocketId] = useState('')
  const [messages, setMessages] = useState([])
  const [createRoom, setCreateRoom] = useState('')
  const [userName, setUserName] = useState('')

  const [activeUsers, setActiveUsers] = useState([])

  const [allMessage, setAllMessage] = useState([])





  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
      
    })
    socket.on('user_connected', (data) => { setActiveUsers(data) })
    socket.on("receave-message", (data) => {
         setMessages((prev) => [...prev, data]);
    })
        return () => { socket.disconnect() }
  }, [])

  const handleOnCreateRoom = (e) => {
    e.preventDefault()
    socket.emit('join-room', createRoom)
    setCreateRoom('');
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    setMessages((prev)=> [...prev,{ message, room, userName } ])
    socket.emit('message', { message, room, userName })
    setMessage('')
    
  }

  const handleUserName = (e) => {
    e.preventDefault()
    socket.emit('userName', userName)
  }

  const handleOnChipClick = (data) => {
    setRoom(data.socketId)

  }
 
  return (
    < div style={{ display: 'flex', flexDirection: 'row' }}>

      <Container maxWidth='sm' >
        <Typography variant='h3' component='div' gutterBottom>
          Online Users
        </Typography>
        <div className='onlineList'>
          {
            activeUsers.map((data, index) => {
              return <div className='onlineUser' key={index} onClick={() => handleOnChipClick(data)} ><AccountCircleIcon/> {data.userName}</div>
            })
          }
        </div>
      </Container>


      <Container maxWidth='sm' style={{ borderLeft: "1px solid black" }}>
        <Typography variant='h3' component='div' gutterBottom>
          Welcome to Chat!
        </Typography >

        <form onSubmit={handleUserName}>
          <TextField value={userName} onChange={(e) => setUserName(e.target.value)} label="User Name" variant='outlined' id='outlined-basic' />
          <Button type='submit'>Add</Button>
        </form>

        <br />
        {/* <form onSubmit={handleOnCreateRoom} >
        <TextField value={createRoom} onChange={(e) => setCreateRoom(e.target.value)} label="Room Name" variant='outlined' id='outlined-basic' />
        <Button type='submit' >Join</Button>
      </form> */}

        <br />

        <form onSubmit={handleOnSubmit}>
          <div className='chatBox'>
            <Stack>
              {
                messages.map((m, id) => {
                  return <div key={id} className={m.userName == userName ? 'chipRight' : 'chip'} >{m.message}</div>

                })
              }
            </Stack>
          </div>
          <input value={message} className='messageBox' type="text" onChange={(e) => setMessage(e.target.value)} />
          <Button type='submit' ><SendIcon /></Button>
        </form>



      </Container>


    </ div>

  )
}

export default App