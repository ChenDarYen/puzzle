module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
      "vue"
    ],
    "extends": ["airbnb-base", "plugin:vue/recommended"],
    "rules": {
      "no-shadow": 1,
      "no-plusplus": [2, { "allowForLoopAfterthoughts": true }],
      "semi": [2, "never"],
      "linebreak-style": 0,
      "global-require": 1,
      "space-before-function-paren": [2, "always"],
      "import/no-dynamic-require": 1,
      "vue/max-attributes-per-line": 0,
      "vue/attributes-order": 0,
      "vue/html-indent": 0,
      "vue/html-closing-bracket-newline": 0
    }
};