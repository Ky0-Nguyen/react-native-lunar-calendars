module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "globals": {
        "expect": true,
        "it": true,
        "describe": true,
    },
    "extends": "eslint:recommended",
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module",
        "requireConfigFile": false,
        "babelOptions": {
            "presets": ["@babel/preset-react", "@babel/preset-typescript"]
        }
    },
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module",
        "requireConfigFile": false,
        "babelOptions": {
            "presets": ["@babel/preset-react", "@babel/preset-typescript"]
        }
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-unused-vars": 2,
        "react/jsx-uses-vars": 2,
        "react/jsx-uses-react": 2,
        "indent": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
