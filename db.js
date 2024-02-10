// db.js
import mongoose from 'mongoose';

const connection = {};

async function dbConnect() {
    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        connection.isConnected = db.connections[0].readyState;
        // await mongoose.connection.collection("cal2ans").rename("ccal2");
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}

export default dbConnect;


// db.js (continuation)
const { Schema } = mongoose;

// const QBankSchema = new Schema({
//     Chapter: { type: String, required: true },
//     Ref: { type: String },
//     Question: { type: String, required: true },
//     Year: { type: [], items: { type: String }, required: true },
//     Topic: { type: String, required: true },
//     OthersSource: { type: String },
//     MyCoverage: { type: String },
//     aId: { type: String }
// });

// export const QCal2Model = mongoose.models.QCal2 || mongoose.model('QCal2', QBankSchema);

// const Cal2Schema = new Schema({
//     qId: { type: String },
//     ySrc: { type: String },
//     ans: { type: [Object] },
//     photoAns: { type: [] },
//     altQuestion: { type: String },
//     altYear: { type: [] },
// });

// export const CCal2Model = mongoose.models.CCal2 || mongoose.model('CCal2', Cal2Schema);

// const Cal2ChScema = new Schema({
//     cal2chapters: {
//         type: [],
//         items: { type: Object },
//         lesson: { type: String },
//         title: { type: String },
//         topics: { type: [] }
//     }
// })

// export const Cal2ChModel = mongoose.models.Cal2Chapters || mongoose.model('Cal2Chapters', Cal2ChScema)

// const Cal2TopicSchema = new Schema({
//     chapter: { type: String },
//     label: { type: String },
//     answers: { type: [String] }
// })

// export const Cal2TopicModel = mongoose.models.Cal2Topic || mongoose.model('Cal2Topic', Cal2TopicSchema)

const UserSchema = new Schema({
    name: { type: String },
    email: { type: String },
    username: { type: String, unique: [true, "username is already exists in database!"] },
    password: { type: String },
    role: { type: String },
    friends: { type: [Object], default: [] }
})

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema)