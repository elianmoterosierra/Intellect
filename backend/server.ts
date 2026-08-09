import express from "express";
import router from "./src/router/cusos.router.ts"
import cors from "cors";


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


app.use("/", router);




app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});