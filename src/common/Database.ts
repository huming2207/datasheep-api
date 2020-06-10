import mongoose from 'mongoose';

export const connectToDb = async (): Promise<void> => {
    await mongoose.connect(
        process.env.DS_DB_URL ? process.env.DS_DB_URL : 'mongodb://localhost:27017/datasheep',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        },
    );
};
