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
    const remixCookieSecret = new sst.Secret("REMIX_COOKIE_SECRET");

    const domain =
      {
        production: "filmrover.gramigna.dev",
      }[$app.stage] ?? `${$app.stage}.filmrover.gramigna.dev`;

    if ($app.stage === "production") {
      new sst.aws.Cron("DailyChallenge", {
        schedule: "cron(0 5 * * ? *)",
        function: {
          handler: "./packages/functions/src/handlers/dailyChallenge.handler",
          runtime: "nodejs22.x",
          link: [tmdbAccessToken, databaseUrl, databaseAuthToken],
        },
      });
    }

    new sst.aws.Remix("RemixApp", {
      path: "./packages/www",
      link: [
        tmdbAccessToken,
        databaseUrl,
        databaseAuthToken,
        remixCookieSecret,
      ],
      server: {
        runtime: "nodejs22.x",
        install: ["@libsql/linux-x64-gnu"],
      },
      environment: {
        STAGE: $app.stage,
        DOMAIN: domain,
      },
      ...($app.stage === "production" && {
        domain: {
          dns: false,
          name: domain,
          cert: "arn:aws:acm:us-east-1:612423649476:certificate/66704a81-7ce0-4856-a62c-afc62d673d28",
        },
      }),
    });
  },
});
