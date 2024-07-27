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

export default (app: Probot) => {
  // Log when the app is loaded
  app.log.info("Yay! The app was loaded!");

  // Comment on new issues
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  // Comment on new pull requests
  app.on("pull_request.opened", async (context) => {
    const pullRequestComment = context.issue({
      body: "Thanks for making this pull request! We will review it shortly.",
    });
    await context.octokit.issues.createComment(pullRequestComment);
  });
};
