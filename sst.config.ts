/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "filmrover",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const tmdbAccessToken = new sst.Secret("TMDB_ACCESS_TOKEN");
    const databaseUrl = new sst.Secret("DATABASE_URL");
    const databaseAuthToken = new sst.Secret("DATABASE_AUTH_TOKEN");

    new sst.aws.Remix("RemixApp", {
      path: "./packages/www",
      link: [tmdbAccessToken, databaseUrl, databaseAuthToken],
      server: {
        runtime: "nodejs22.x",
      },
    });
  },
});
