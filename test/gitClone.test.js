const gitClone = require(`../plugins/gitClone`);


test(`这里应该输出`,() => {
  expect(gitClone(
    `git@github.com:jaz303/tpl-simple-site.git`,
    `./test-checkout`,
    {
      checkout: `a76362b0705d4126fa4462916cabb2506ecfe8e2`
    },
    err => {
      console.log(`complete!`);
      console.log(err);
    }
  )).toBe(`finish`);
})
;
