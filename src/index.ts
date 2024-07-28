// import { Probot } from "probot";

// export default (app: Probot) => {
//   app.on("issues.opened", async (context) => {
//     const issueComment = context.issue({
//       body: "Thanks for opening this issue!",
//     });
//     await context.octokit.issues.createComment(issueComment);
//   });
//   // For more information on building apps:
//   // https://probot.github.io/docs/

//   // To get your app running against GitHub, see:
//   // https://probot.github.io/docs/development/
// };

import { Probot } from "probot";
import express from "express";

const app = express();

export default (probotApp: Probot) => {
  // Log when the app is loaded
  probotApp.log.info("Yay! The app was loaded!");

  // Comment on new issues
  probotApp.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  // Comment on new pull requests
  probotApp.on("pull_request.opened", async (context) => {
    const pullRequestComment = context.issue({
      body: "Thanks for making this pull request! We will review it shortly.",
    });
    await context.octokit.issues.createComment(pullRequestComment);
  });

  // Define routes
  app.get("/users", async (_req, res) => {
    try {
      const auth = await probotApp.auth();
      const installations = await auth.apps.listInstallations();
      const users = installations.data.map((installation) => {
        if (installation.account) {
          return installation.account.login;
        }
        return "No Users Listed";
      });
      res.json(users);
    } catch (error) {
      probotApp.log.error(error);
      res.status(500).send((error as Error).message);
    }
  });

  app.get("/user/repositories", async (req, res) => {
    try {
      const { username } = req.query;
      const auth = await probotApp.auth();
      const repositories = await auth.repos.listForUser({
        username: username as string,
      });
      res.json(repositories.data);
    } catch (error) {
      probotApp.log.error(error);
      res.status(500).send((error as Error).message);
    }
  });

  app.get("/user/repository/pull_requests", async (req, res) => {
    try {
      const { owner, repo } = req.query;
      const auth = await probotApp.auth();
      const pullRequests = await auth.pulls.list({
        owner: owner as string,
        repo: repo as string,
      });
      res.json(pullRequests.data);
    } catch (error) {
      probotApp.log.error(error);
      res.status(500).send((error as Error).message);
    }
  });

  app.get("/user/repository/pull_request/commits", async (req, res) => {
    try {
      const { owner, repo, pull_number } = req.query;
      const auth = await probotApp.auth();
      const commits = await auth.pulls.listCommits({
        owner: owner as string,
        repo: repo as string,
        pull_number: parseInt(pull_number as string, 10),
      });
      res.json(commits.data);
    } catch (error) {
      probotApp.log.error(error);
      res.status(500).send((error as Error).message);
    }
  });

  // Start the server
  app.listen(5000, () => {
    probotApp.log.info("Server is running on http://localhost:5000");
  });
};
