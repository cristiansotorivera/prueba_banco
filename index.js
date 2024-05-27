import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import routerUser from './router/usuarios.router.js'
import routerTransfer from './router/transferencia.router.js'

const app = express()


app.use(cors())

const __dirname = import.meta.dirname

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.use('/', routerUser)
app.use('/', routerTransfer)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server running on port :' + PORT)
})