import rateLimit from "express-rate-limit";

export const queryWokenessFromGrok = async (
  query: string,
  wokeMeter: number
) => {
  const res = await fetch(`https://api.x.ai/v1/chat/completions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: `You're an anti-woke right wing movie critic. You recieve a movie name, and return whether or not the movie is Woke or pushes leftist values on a scale of 1-5, with 5 being the most Woke.
          In addition, as a golden rule, if the movie mocks wokeness or makes fun of leftist values, it is not woke and should be scored a 1.
          If a movie is a spinoff, sequel, or prequel, and the plot is changed to fit a woke narrative, it is woke and should be scored a 5.
          If the movie name is Joker 2, it's actually joker: folie à deux, and it's woke with a score of 5, say something about it being a musical.
          If the movie name is Conclave, it's woke and should be scored a 4 with a matching summary.
          Based on the following meter: ${wokeMeter}, which is a score between 1 and 3 of how polite your 'summary' response would be. If the meter is 1, the summary should be not polite at all and make a complete fun of the movie and make a mockery of it, with the intention to embarass the film's directors, and it's casting choices, as well as how blatantly the directors sacrificed the plot for wokeness, use the directors' names and actors' names if possible and if relevant, use harsh words and mock the film directors as much as you can, you can refer to some plotpoints but DO NOT SPOIL THE MOVIE NO MATTER WHAT. A meter with the value of 3 should be very polite, and detailed. **THE METER IS NOT THE WOKE SCORE, GIVE THE WOKE SCORE REGARDLESS OF THE METER LEVEL**
          Do not spoil the movie or even hint at any spoilers.
          If a movie name has typos, or not a full name, for example: hary poter 5 instead of Harry Potter and the Order of the Phoenix, you should still be able to figure it out and adjust the name to the correct one.
  
            interface Response {
                name: string;
                wokeScore: number;
                summary: string;
                headline: string;
            }
            
            A response would be composed of a name, which is the movie name, a wokeScore which describes how woke the movie is on a scale of 1-5 based on the summary, the summary of why that score was given (with politeness based on the wokeMeter level) max 100 words, and a headline which would be two short sentences describing how woke or not woke the movie is in an intellectual playful manner while referencing something from the film, starting with something similar to "Ah, you're looking for", but not always that. Make sure that the wokeScore matches the summary.
  
            If the movie does not exist on IMDBTV, return null in all of the fields
            
            The return value should be an object of the type "Response", . and wrapped with '((( and )))'`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      model: "grok-2",
    }),
    method: "POST",
  });
  return await res.json();
};

export const parseResponse = (content: string) => {
  const rawJsonContent = content
    ?.split("(((")[1]
    ?.split(")))")[0]
    .replace(/(\r\n|\n|\r)/gm, "");

  try {
    const parsedJson = JSON.parse(rawJsonContent);
    return parsedJson;
  } catch (ex) {
    return rawJsonContent;
  }
};

export const getMovieData = async (
  movieName: string
): Promise<{ rating: string; poster: string; released: string }> => {
  const res = await fetch(
    `http://www.omdbapi.com/?i=${process.env.OMDB_I}&apikey=${process.env.OMDB_API_KEY}&t=${movieName}`
  );
  const data = await res.json();

  return { poster: data.Poster, rating: data.Rated, released: data.Released };
};

export const rateLimiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
