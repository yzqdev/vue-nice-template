const { spawn } = require(`child_process`);
const downloadGit = (repo, targetPath, opts, cb) => {
  if (typeof opts === `function`) {
    cb = opts;
    opts = null;
  }

  opts = opts || {};

  const git = opts.git || `git`;
  const args = [`clone`];

  const _checkout = () => {
    const args = [`checkout`, opts.checkout];
    const process = spawn(git, args, { cwd: targetPath });
    process.on(`close`, status => {
      if (status === 0) {
        cb && cb();
      } else {
        cb && cb(new Error(`'git checkout' failed with status ${status}`));
      }
    });
    return `finish`;
  };

  if (opts.shallow) {
    args.push(`--depth`);
    args.push(`1`);
  }

  args.push(`--`);
  args.push(repo);
  args.push(targetPath);

  const process = spawn(git, args);
  process.on(`close`, status => {
    if (status === 0) {
      if (opts.checkout) {
        _checkout();
      } else {
        cb && cb();
      }
    } else {
      cb && cb(new Error(`'git clone' failed with status ${status}`));
    }
  });
};

// eslint-disable-next-line complexity
module.exports = downloadGit;
