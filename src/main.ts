import express, { type Request, type Response } from "express";
import cors from "cors";
import {
  getMovieData,
  parseResponse,
  queryWokenessFromGrok,
  rateLimiter,
} from "./utils";
import { fetchExistingMovie, insertMovieToDB } from "./queries";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.get("/:movie", async (req: Request, res: Response) => {
  const wokeMeter = +`${req.query.wokeMeter}` || 3;
  if (isNaN(wokeMeter)) {
    res.status(400).send("Invalid wokeMeter");
    return;
  }
  if (req.params.movie?.length > 60) {
    res.status(400).send("Movie name too long");
    return;
  }
  const { existingMovie } = await fetchExistingMovie(
    req.params.movie?.toLowerCase(),
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
  const { poster, rating, released } = await getMovieData(movieName);

  if (movieName && wokeScore && summary && headline && poster) {
    await insertMovieToDB({
      possibleName: req.params.movie,
      movieName,
      wokeScore,
      wokeMeter,
      headline,
      summary,
      poster,
      rating,
      released,
    });

    res.send({
      movieName,
      wokeScore,
      summary,
      headline,
      poster,
      rating,
      released,
    });
    return;
  } else {
    res.status(404).send("Movie not found");
    return;
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
