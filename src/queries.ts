import { prismaClient } from "./dbClient";

export const fetchPopularMovies = async () => {
  const movies = await prismaClient.movie.groupBy({
    by: ["name", "poster"],
    _count: {
      name: true,
    },
    orderBy: {
      _count: {
        name: "desc",
      },
    },
    take: 20,
  });

  return movies;
};

export const fetchExistingMovie = async (
  movieName: string,
  wokeMeter: number
) => {
  const movie = await prismaClient.movie.findFirst({
    where: {
      possibleName: movieName,
      wokeMeter,
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return { existingMovie: movie };
};

export const insertMovieToDB = async (movie: {
  possibleName: string;
  name: string;
  wokeScore: number;
  wokeMeter: number;
  headline: string;
  summary: string;
  poster: string;
  rating: string;
  released: string;
}) => {
  try {
    await prismaClient.movie.create({
      data: {
        possibleName: movie.possibleName.toLowerCase(),
        name: movie.name.toLowerCase(),
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
