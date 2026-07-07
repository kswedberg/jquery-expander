import es5 from 'eslint-config-kswedberg/flat/es5.mjs';
import {browserGlobals} from 'eslint-config-kswedberg/flat/globals.mjs';

export default [
  ...es5,
  browserGlobals,
  {
    languageOptions: {
      globals: {
        define: 'readonly',
        module: 'readonly',
        jQuery: 'readonly',
        $: 'readonly',
        QUnit: 'readonly'
      }
    }
  },
  {
    files: ['jquery.expander.js', 'test/tests.js', 'Gruntfile.js', 'eslint.config.mjs'],

    rules: {
      'comma-dangle': ['warn', 'never'],
      'no-param-reassign': 'off',
      'newline-per-chained-call': 'off',
      'no-use-before-define': ['error',
        {functions: false}],
      'func-style': 'off'
    }
  }
];
