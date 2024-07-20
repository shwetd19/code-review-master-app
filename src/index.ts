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
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  app.on("pull_request.opened", async (context) => {
    const pullRequestComment = context.issue({
      body: "Thanks for making this pull request! We will review it shortly.",
    });
    await context.octokit.issues.createComment(pullRequestComment);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/
  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
