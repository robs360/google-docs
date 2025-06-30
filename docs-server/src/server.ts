import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app"
dotenv.config({ path: '.env.local' });
async function main() {
  try {
    await mongoose.connect(process.env.database_url as string);
   
    const PORT = process.env.PORT || 5000;
    app.listen(PORT,()=>{
        console.log(`app is running on port ${PORT}`)
    })
  } catch (error) {
    console.log(error);
  }
}

main().catch((err) => console.log(err));