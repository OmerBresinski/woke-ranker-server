import express, { type Request, type Response } from "express";
import cors from "cors";
import "jsr:@std/dotenv/load";
import { getMoviePoster, parseResponse, queryGrok } from "./utils.ts";

const app = express();
const port = 3000;

app.use(cors());

app.get("/:movie", async (req: Request, res: Response) => {
  const grokResponse = await queryGrok(req.params.movie, req.query.wokeMeter);
  const { movieName, wokeScore, summary, headline } = parseResponse(
    grokResponse.choices[0].message.content
  );

  console.log("getting movie poster", movieName);
  const { poster } = await getMoviePoster(movieName);

  res.send({ movieName, wokeScore, summary, headline, poster });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
