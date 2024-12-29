import express, { type Request, type Response } from "express";
import cors from "cors";
import { getMoviePoster, parseResponse, queryWokenessFromGrok } from "./utils";
import { fetchExistingMovie, insertMovieToDB } from "./queries";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/:movie", async (req: Request, res: Response) => {
  const wokeMeter = +`${req.query.wokeMeter}` || 3;
  const { existingMovie } = await fetchExistingMovie(
    req.params.movie,
    wokeMeter
  );

  if (existingMovie) {
    res.send(existingMovie);
    return;
  }

  const grokResponse = await queryWokenessFromGrok(req.params.movie, wokeMeter);
  const { movieName, wokeScore, summary, headline } = parseResponse(
    grokResponse.choices[0].message.content
  );
  const { poster } = await getMoviePoster(movieName);

  await insertMovieToDB({
    possibleName: req.params.movie,
    movieName,
    wokeScore,
    wokeMeter,
    headline,
    summary,
    poster,
  });

  res.send({ movieName, wokeScore, summary, headline, poster });
  return;
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
