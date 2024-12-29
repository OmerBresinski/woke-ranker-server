import express, { type Request, type Response } from "express";
import cors from "cors";
import { getMoviePoster, parseResponse, queryGrok } from "./utils";
import { fetchExistingMovie, insertMovieToDB } from "./queries";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.get("/:movie", async (req: Request, res: Response) => {
  const grokResponse = await queryGrok(
    req.params.movie,
    `${req.query.wokeMeter}`
  );
  const { movieName, wokeScore, summary, headline } = parseResponse(
    grokResponse.choices[0].message.content
  );

  const { existingMovie } = await fetchExistingMovie(movieName);

  if (existingMovie) {
    console.log("Sending existing movie");
    res.send({
      movieName: existingMovie.name,
      wokeScore: existingMovie.wokeScore,
      summary: existingMovie.summary,
      headline: existingMovie.headline,
      poster: existingMovie.poster,
    });
  } else {
    const { poster } = await getMoviePoster(movieName);
    console.log("Adding movie to DB..");
    await insertMovieToDB({ movieName, wokeScore, summary, headline, poster });

    res.send({ movieName, wokeScore, summary, headline, poster });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
