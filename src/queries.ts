import { createPrismaClient } from "./dbClient";

export const fetchExistingMovie = async (
  movieName: string,
  wokeMeter: number
) => {
  const prismaClient = createPrismaClient();

  const movie = await prismaClient.movie.findFirst({
    where: {
      possibleName: movieName,
      wokeMeter,
    },
  });

  return { existingMovie: movie };
};

export const insertMovieToDB = async (movie: {
  possibleName: string;
  movieName: string;
  wokeScore: number;
  wokeMeter: number;
  headline: string;
  summary: string;
  poster: string;
  rating: string;
  released: string;
}) => {
  const prismaClient = createPrismaClient();
  try {
    await prismaClient.movie.create({
      data: {
        possibleName: movie.possibleName.toLowerCase(),
        name: movie.movieName.toLowerCase(),
        wokeScore: movie.wokeScore,
        summary: movie.summary,
        headline: movie.headline,
        poster: movie.poster,
        wokeMeter: movie.wokeMeter,
        rating: movie.rating,
        released: movie.released,
      },
    });
  } catch (ex) {
    console.log((ex as Error).message);
  }
};
