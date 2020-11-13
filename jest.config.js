const dynamoDbPreset = require("jest-dynalite/jest-preset");

module.exports = {
    ...dynamoDbPreset,
    testMatch: [`${__dirname}/__tests__/**/*.test.js`],
    moduleDirectories: ["node_modules"],
    modulePathIgnorePatterns: []
};
