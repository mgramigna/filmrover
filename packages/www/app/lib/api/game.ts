import { db, eq, games } from "@filmrover/db";

export const game = {
  getById: async (id: string) => {
    const [result] = await db.select().from(games).where(eq(games.id, id));

    if (!result) {
      throw new Error(`Game ${id} does not exist`);
    }

    return result;
  },
  list: async () => {
    const result = await db.select().from(games);

    return result;
  },
  create: async (input: {
    startMovieId?: number;
    endMovieId?: number;
    startPersonId?: number;
    endPersonId?: number;
  }) => {
    const { startMovieId, startPersonId, endMovieId, endPersonId } = input;

    const [result] = await db
      .insert(games)
      .values({
        startMovieId,
        startPersonId,
        endMovieId,
        endPersonId,
        isFinished: false,
      })
      .returning({
        gameId: games.id,
      });

    if (!result) {
      throw new Error("Error creating game");
    }

    return { gameId: result.gameId };
  },
  complete: async (id: string) => {
    await db
      .update(games)
      .set({
        isFinished: true,
      })
      .where(eq(games.id, id));
  },
};
