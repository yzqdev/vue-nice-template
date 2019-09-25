const gitClone = require(`./gitClone`);
gitClone(
  `https://github.com/jaz303/git-clone.git`,
  `./test-checkout`,

  err => {
    console.log(err);
  }
);
