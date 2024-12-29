import express, { type Request, type Response } from "express";
import cors from "cors";
import { getMoviePoster, parseResponse, queryWokenessFromGrok } from "./utils";
import {
  fetchExistingMovie,
  fetchExistingPossibleName,
  insertMovieToDB,
  insertPossibleNameToDb,
} from "./queries";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/:movie", async (req: Request, res: Response) => {
  const wokeMeter = +`${req.query.wokeMeter}` || 3;
  const { existingPossibleName } = await fetchExistingPossibleName(
    req.params.movie
  );

  if (existingPossibleName) {
    const { existingMovie } = await fetchExistingMovie(
      existingPossibleName,
      wokeMeter
    );

    if (existingMovie) {
      res.send({
        movieName: existingMovie.name,
        wokeScore: existingMovie.wokeScore,
        summary: existingMovie.summary,
        headline: existingMovie.headline,
        poster: existingMovie.poster,
      });
      return;
    } else {
      res.status(404).send({ message: "Movie not found" });
      return;
    }
  }

  const grokResponse = await queryWokenessFromGrok(
    req.params.movie,
    `${req.query.wokeMeter}`
  );
  const { movieName, wokeScore, summary, headline } = parseResponse(
    grokResponse.choices[0].message.content
  );
  const { poster } = await getMoviePoster(movieName);

  if (poster && movieName && wokeScore && summary && headline) {
    await insertMovieToDB({
      movieName,
      wokeScore,
      wokeMeter,
      summary,
      headline,
      poster,
    });
    await insertPossibleNameToDb(req.params.movie, movieName);

    res.send({ movieName, wokeScore, summary, headline, poster });
    return;
  } else {
    res.status(404).send({ message: "Movie not found" });
    return;
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
