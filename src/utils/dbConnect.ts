import mongoose from 'mongoose'

interface Connection {
  isConnected: number
}
const connection: Connection = {} as Connection

async function dbConnect() {
  if (connection.isConnected) {
    return
  }

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    heartbeatFrequencyMS: 4000,
    serverSelectionTimeoutMS: 3000,
  })

  connection.isConnected = db.connections[0].readyState
}

export default dbConnect
