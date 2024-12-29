import { createPrismaClient } from "./dbClient";

export const fetchExistingMovie = async (movieName: string) => {
  const prismaClient = createPrismaClient();

  const movie = await prismaClient.movie.findUnique({
    where: {
      name: movieName,
    },
  });

  return { existingMovie: movie };
};

export const insertMovieToDB = async (movie: {
  movieName: string;
  wokeScore: number;
  summary: string;
  headline: string;
  poster: string;
}) => {
  const prismaClient = createPrismaClient();

  await prismaClient.movie.create({
    data: {
      name: movie.movieName,
      wokeScore: movie.wokeScore,
      summary: movie.summary,
      headline: movie.headline,
      poster: movie.poster,
    },
  });
};
