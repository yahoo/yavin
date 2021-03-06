module.exports = {
  env: {
    embertest: true,
  },
  globals: {
    $: true,
    server: true,
    wait: true,
    reorder: true,
    drag: true,
  },
  rules: {
    'multiline-comment-style': ['error', 'starred-block'],
  },
};
