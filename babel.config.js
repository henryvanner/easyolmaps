const presets = [
  [
    "@babel/env",
    {
      targets: {
        firefox: "60",
        chrome: "67"
      },
      useBuiltIns: "usage",
      corejs: '2.x'
    },
  ],
];

module.exports = { presets };