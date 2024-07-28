import express from "express";
const app = express();
app.use(express.json());

export default (probotApp) => {
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

  // Helper function to get installation auth
  const getInstallationAuth = async (probotApp) => {
    try {
      const auth = await probotApp.auth();
      const installations = await auth.apps.listInstallations();
      if (installations.data.length > 0) {
        const installationId = installations.data[0].id;
        return await probotApp.auth(installationId);
      }
      throw new Error("No installations found");
    } catch (error) {
      throw new Error(`Failed to get installation auth: ${error.message}`);
    }
  };

  // Define routes
  app.get("/users", async (_req, res) => {
    try {
      const auth = await probotApp.auth();
      const installations = await auth.apps.listInstallations();
      const users = installations.data.map((installation) => {
        if (installation.account) {
          return installation.account.login;
        }
        return "Unknown User";
      });
      res.json(users);
    } catch (error) {
      probotApp.log.error(error);
      res.status(500).send(error.message);
    }
  });

  // Changed to POST request
  app.post("/user/repositories", async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) {
        throw new Error("Username parameter is required");
      }
      const auth = await getInstallationAuth(probotApp);
      const repositories = await auth.paginate(auth.repos.listForUser, {
        username: username,
      });
      const repoInfo = repositories.map((repo) => ({
        name: repo.name,
        html_url: repo.html_url,
      }));
      res.json(repoInfo);
    } catch (error) {
      probotApp.log.error(error);
      res.status(500).send(error.message);
    }
  });

  // Changed to POST request
  app.post("/user/repository/pull_requests", async (req, res) => {
    try {
      const { owner, repo } = req.body;
      if (!owner || !repo) {
        throw new Error("Owner and repo parameters are required");
      }
      const auth = await getInstallationAuth(probotApp);
      const pullRequests = await auth.paginate(auth.pulls.list, {
        owner: owner,
        repo: repo,
      });
      const prInfo = pullRequests.map((pr) => ({
        title: pr.title,
        body: pr.body,
        html_url: pr.html_url,
      }));
      res.json(prInfo);
    } catch (error) {
      probotApp.log.error(error);
      res.status(500).send(error.message);
    }
  });

  // Changed to POST request
  app.post("/user/repository/pull_request/commits", async (req, res) => {
    try {
      const { owner, repo, pull_number } = req.body;
      if (!owner || !repo || !pull_number) {
        throw new Error("Owner, repo, and pull_number parameters are required");
      }
      const auth = await getInstallationAuth(probotApp);
      const commits = await auth.paginate(auth.pulls.listCommits, {
        owner: owner,
        repo: repo,
        pull_number: parseInt(pull_number, 10),
      });
      const commitInfo = commits.map((commit) => ({
        message: commit.commit.message,
        author: commit.commit.author.name,
      }));
      res.json(commitInfo);
    } catch (error) {
      probotApp.log.error(error);
      res.status(500).send(error.message);
    }
  });
  // New POST request to comment on a pull request
  app.post("/user/repository/pull_request/comment", async (req, res) => {
    try {
      const { owner, repo, pull_number } = req.body;
      if (!owner || !repo || !pull_number) {
        throw new Error("Owner, repo, and pull_number parameters are required");
      }
      const auth = await getInstallationAuth(probotApp);
      const comment = await auth.issues.createComment({
        owner,
        repo,
        issue_number: parseInt(pull_number, 10),
        body: "Thanks for making these changes, CodeGen will review it ASAP",
      });
      res.json(comment.data);
    } catch (error) {
      probotApp.log.error(error);
      res.status(500).send(error.message);
    }
  });

  // Start the server
  app.listen(5000, () => {
    probotApp.log.info("Server is running on http://localhost:5000");
  });
};
//# sourceMappingURL=index.js.map
