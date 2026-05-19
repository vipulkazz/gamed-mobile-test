#!/usr/bin/env bash
#
# pnpm android wrapper. Works around a known path-mismatch bug between
# react-native-reanimated@4.1.7 and react-native-worklets@0.5.1 on Expo SDK 54:
#
# - reanimated's CMakeLists.txt expects libworklets.so at:
#     android/build/intermediates/cmake/${BUILD_TYPE}/obj/${ABI}/libworklets.so
# - That directory is owned by AGP's auto-imported prefabs (libc++_shared,
#   libfbjni) and AGP wipes anything we drop into it during reanimated's build.
# - worklets actually publishes libworklets.so via prefab at:
#     android/build/intermediates/prefab_package/${BUILD_TYPE}/prefab/modules/worklets/libs/android.${ABI}/libworklets.so
#
# We pre-build worklets (so the prefab path is populated), patch reanimated's
# CMakeLists.txt to read from the prefab path, then run the normal Expo build.
#
# Usage: pnpm android
#
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
ABI="${EXPO_ANDROID_ABI:-arm64-v8a}"
REANIMATED_CMAKE="$ROOT/node_modules/react-native-reanimated/android/CMakeLists.txt"
PATCH_MARKER="# gamed-patched"

echo "==> Running expo prebuild --platform android"
npx expo prebuild --platform android --no-install

echo "==> Pre-building react-native-worklets ($ABI) — produces prefab package"
(
    cd android
    ./gradlew ":react-native-worklets:buildCMakeDebug[$ABI]" ":react-native-worklets:prefabDebugPackage"
)

PREFAB_SO="$ROOT/node_modules/react-native-worklets/android/build/intermediates/prefab_package/debug/prefab/modules/worklets/libs/android.${ABI}/libworklets.so"
if [ ! -f "$PREFAB_SO" ]; then
    echo "ERROR: prefab libworklets.so not produced at $PREFAB_SO"
    exit 1
fi
echo "==> Found prefab libworklets.so"

echo "==> Patching reanimated CMakeLists.txt to use prefab path"
if ! grep -q "$PATCH_MARKER" "$REANIMATED_CMAKE"; then
    cp "$REANIMATED_CMAKE" "$REANIMATED_CMAKE.bak"
    # Replace the hardcoded "cmake/${BUILD_TYPE}/obj/${ANDROID_ABI}" with the prefab path.
    sed -i.tmp \
        's|intermediates/cmake/\${BUILD_TYPE}/obj/\${ANDROID_ABI}/libworklets.so|intermediates/prefab_package/\${BUILD_TYPE}/prefab/modules/worklets/libs/android.\${ANDROID_ABI}/libworklets.so|' \
        "$REANIMATED_CMAKE"
    rm -f "$REANIMATED_CMAKE.tmp"
    echo "$PATCH_MARKER" >> "$REANIMATED_CMAKE"
    echo "    patched"
else
    echo "    already patched"
fi

echo "==> Running expo run:android"
npx expo run:android
