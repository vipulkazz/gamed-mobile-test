// Expo config plugin: force serial Gradle execution.
//
// Reanimated 4.x links against libworklets.so produced by react-native-worklets.
// With Gradle parallelism on (the default), the reanimated CMake task starts its
// link step before worklets finishes building libworklets.so, and the build
// fails with:
//   ninja: error: '.../libworklets.so' missing and no known rule to make it
//
// Disabling parallel execution ensures worklets builds before reanimated.
// iOS is unaffected.

const { withGradleProperties } = require("expo/config-plugins");

module.exports = function withGradleParallelDisabled(config) {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;
    const existing = props.findIndex(
      (p) => p.type === "property" && p.key === "org.gradle.parallel",
    );
    if (existing !== -1) {
      props.splice(existing, 1);
    }
    props.push({
      type: "property",
      key: "org.gradle.parallel",
      value: "false",
    });
    return config;
  });
};
