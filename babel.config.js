const presets = [
  [
    "@babel/env",
    {
      targets: {
        firefox: "60",
        chrome: "67"
      },
      useBuiltIns: "usage",
      corejs: {
        version: 3,
        proposals: true
      }
    },
  ],
];

module.exports = { presets };