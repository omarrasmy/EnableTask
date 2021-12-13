const mongoose = require('mongoose');
require('dotenv').config({ path: './configurations/dev.env' })


mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://Enable:aborasmy@taskenable.r8gmj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
const conn = mongoose.connection;
mongoose.connection.once('open', () => { console.log('MongoDB Connected'); });

