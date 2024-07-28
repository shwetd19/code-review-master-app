  export default (app) => {
    app.log.info("Yay! The app was loaded!");

    app.on("issues.opened", async (context) => {
      app.log.info("Issue opened event received.");
      const issueComment = context.issue({
        body: "Thanks for opening this issue!",
      });
      await context.octokit.issues.createComment(issueComment);
      app.log.info("Comment added to the issue.");
    });

    app.on("error", (error) => {
      app.log.error(`An error occurred: ${error.message}`);
    });
  };
