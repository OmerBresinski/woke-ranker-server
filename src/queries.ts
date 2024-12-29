import { createPrismaClient } from "./dbClient";

export const fetchExistingMovie = async (
  movieName: string,
  wokeMeter: number
) => {
  const prismaClient = createPrismaClient();

  const movie = await prismaClient.movie.findFirst({
    where: {
      name: movieName,
      wokeMeter,
    },
  });

  return { existingMovie: movie };
};

export const fetchExistingPossibleName = async (movieName: string) => {
  const prismaClient = createPrismaClient();

  const movie = await prismaClient.moviePossibleNames.findFirst({
    where: {
      possibleName: movieName,
    },
  });

  return { existingPossibleName: movie?.name };
};

export const insertMovieToDB = async (movie: {
  movieName: string;
  wokeScore: number;
  wokeMeter: number;
  summary: string;
  headline: string;
  poster: string;
}) => {
  const prismaClient = createPrismaClient();
  try {
    await prismaClient.movie.create({
      data: {
        name: movie.movieName,
        wokeScore: movie.wokeScore,
        summary: movie.summary,
        headline: movie.headline,
        poster: movie.poster,
        wokeMeter: movie.wokeMeter,
      },
    });
  } catch (ex) {
    console.log((ex as Error).message);
  }
};

export const insertPossibleNameToDb = async (
  possibleName: string,
  movieName: string
) => {
  const prismaClient = createPrismaClient();

  await prismaClient.moviePossibleNames.create({
    data: {
      possibleName,
      name: movieName,
    },
  });
};
