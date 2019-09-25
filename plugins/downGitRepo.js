const downloadUrl = require(`download`);
const downGitRepo = require(`./gitClone`);
const rm = require(`rimraf`).sync;

/**
 * Download `repo` to `dest` and callback `fn(err)`.
 *
 * @param {String} repo
 * @param {String} dest
 * @param {Object} opts
 * @param {Function} fn
 */

function download(repo, dest, opts, fn) {
  if (typeof opts === `function`) {
    fn = opts;
    opts = null;
  }
  opts = opts || {};
  const clone = opts.clone || false;
  delete opts.clone;

  repo = normalize(repo);
  const url = repo.url || getUrl(repo, clone);

  if (clone) {
    var options = {
      checkout: repo.checkout,
      shallow: repo.checkout === `master`,
      ...opts
    };
    downGitRepo(url, dest, options, err => {
      if (err === undefined) {
        rm(`${dest}/.git`);
        fn();
      } else {
        fn(err);
      }
    });
  } else {
    var options = {
      extract: true,
      strip: 1,
      mode: `666`,
      ...opts,
      headers: {
        accept: `application/zip`,
        ...(opts.headers || {})
      }
    };
    downloadUrl(url, dest, options)
      .then(data => {
        fn();
      })
      .catch(err => {
        fn(err);
      });
  }
}

/**
 * Normalize a repo string.
 *
 * @param {String} repo
 * @return {Object}
 */

function normalize(repo) {
  let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/;
  let match = regex.exec(repo);

  if (match) {
    const url = match[2];
    var checkout = match[3] || `master`;

    return {
      type: `direct`,
      url: url,
      checkout: checkout
    };
  }
  regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^\/]+)\/([^#]+)(?:#(.+))?$/;
  match = regex.exec(repo);
  const type = match[1] || `github`;
  let origin = match[2] || null;
  const owner = match[3];
  const name = match[4];
  var checkout = match[5] || `master`;

  if (origin == null) {
    if (type === `github`) {
      origin = `github.com`;
    } else if (type === `gitlab`) {
      origin = `gitlab.com`;
    } else if (type === `bitbucket`) {
      origin = `bitbucket.org`;
    }
  }

  return {
    type: type,
    origin: origin,
    owner: owner,
    name: name,
    checkout: checkout
  };
}

/**
 * Adds protocol to url in none specified
 *
 * @param {String} url
 * @return {String}
 */

function addProtocol(origin, clone) {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    if (clone) {
      origin = `git@${origin}`;
    } else {
      origin = `https://${origin}`;
    }
  }

  return origin;
}

/**
 * Return a zip or git url for a given `repo`.
 *
 * @param {Object} repo
 * @return {String}
 */

function getUrl(repo, clone) {
  let url;

  // Get origin with protocol and add trailing slash or colon (for ssh)
  let origin = addProtocol(repo.origin, clone);
  if ((/^git\@/i).test(origin)) {
    origin += `:`;
  } else {
    origin += `/`;
  }

  // Build url
  if (clone) {
    url = `${origin + repo.owner}/${repo.name}.git`;
  } else {
    const repoMap = new Map([
      [
        `github`,
        `${origin + repo.owner}/${repo.name}/archive/${repo.checkout}.zip`
      ],
      [
        `gitlab`,
        `${origin + repo.owner}/${repo.name}/repository/archive.zip?ref=${
          repo.checkout
        }`
      ],
      [
        `bitbucket`,
        `${origin + repo.owner}/${repo.name}/get/${repo.checkout}.zip`
      ],
      [`gitea`, `${origin + repo.owner}/${repo.name}/get/${repo.checkout}.zip`]
    ]);
    url = repoMap.get(repo.type);
  }

  return url;
}
/**
 * Expose `download`.
 */

module.exports = download;
