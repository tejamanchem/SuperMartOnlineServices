import mongoose, { Connection } from "mongoose";

const mongo_host = process.env.MONGO_DATABASE_HOST;
const databaseName = process.env.MONGO_DATABASE_NAME;
async function mainConnection(): Promise<Connection> {
  const mongo_db_url = `${process.env.DATABASE}://${mongo_host}/${databaseName}`;
  try {
    const connection = (await mongoose.connect(mongo_db_url,
      {
      //useNewUrlParser: true,
   //   useUnifiedTopology: true,
    }
    )) as any;
    return connection;
  } catch (error: any) {
    console.log(`!! Error in database error : ${error}`);
    throw error;
  }
}

export async function connectToDatabase() {
  try {
    const getConnection = await mainConnection();
  } catch (error: any) {
    console.log(`!! Error in database connection with error : ${error}`);
    throw error;
  }
}
