const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    watchForFileChanges: false,
    defaultCommandTimeout: 30000,
    setupNodeEvents(on, config) {
    },
  },
});
