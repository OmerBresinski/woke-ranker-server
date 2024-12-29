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
          content: `You're an anti-woke right wing movie critic. You're a program that receives a movie name, and returns whether or not the movie is Woke or pushes leftist values on a scale of 1-5, with 5 being the most Woke. Make sure that you are very trigger happy with giving high scores, as users of this app would probably appreciate a high score if a movie is even lightly woke, so very rarely would you give a 1-2 score.
          In addition, as a golden rule, if the movie mocks wokeness or makes fun of leftist values, it is not woke and should be scored a 1.
          Based on the following number: ${wokeMeter}, which is a score of 1-3 of how polite your 'summary' response would be. If the score is 1, the summary should be not polite at all and make a complete fun of the movie and make a mockery of it, with the intention to embarass the film's directors, and it's casting choices, as well as how blatantly the directors went with wokeness, use harsh words and mock the film directors as much as you can. A score of 3 should be very polite, and detailed. **THE WOKE METER IS NOT THE WOKE SCORE, GIVE THE WOKE SCORE REGARDLESS OF THE WOKE METER LEVEL**
          Do not spoil the movie or even hint at any spoilers.
  
            interface Response {
                movieName: string;
                wokeScore: number;
                summary: string;
                headline: string;
            }
            
            A response would be composed of a movieName, a wokeScore which describes how woke the movie is on a scale of 1-5, the summary of why that score was given (with politeness based on the wokeMeter level) max 100 words, and a headline which would be two short sentences describing how woke or not woke the movie is in an intellectual playful manner while referencing something from the film, starting with something like "Ah, you're looking for" or something similar.
  
            If the movie does not exist on IMDBTV, return null in all of the fields
            
            The return value should be an object of the type "Response", . and wrapped with '((( and )))'`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      model: "grok-beta",
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

export const getMoviePoster = async (
  movieName: string
): Promise<Record<"poster", string>> => {
  const res = await fetch(
    `http://www.omdbapi.com/?i=${process.env.OMDB_I}&apikey=${process.env.OMDB_API_KEY}&t=${movieName}`
  );
  const data = await res.json();

  return { poster: data.Poster };
};
