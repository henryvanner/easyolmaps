const presets = [
    [
      "@babel/env",
      {
        targets: {
          firefox: "60",
          chrome: "67"          
        },
        useBuiltIns: "usage",
      },
    ],
  ];
  
  module.exports = { presets };