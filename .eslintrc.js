module.exports = {
  extends: 'kswedberg/es5',
  rules: {
    'comma-dangle': ['warn', 'never'],
    'no-param-reassign': 'off',
    'newline-per-chained-call': 'off',
    'no-use-before-define': ['error', {functions: false}],
    'func-style': 'off'
  },
  globals: {
    define: false
  }
};
