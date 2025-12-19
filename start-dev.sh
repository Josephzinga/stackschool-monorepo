#!/bin/bash
# Script pour lancer le dev sans Wi-Fi
adb reverse tcp:8081 tcp:8081
adb reverse tcp:4000 tcp:4000
echo "Passerelles USB activées (8081 et 4000)"
cd apps/mobile && pnpm expo start --localhost --android
