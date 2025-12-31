#!/bin/bash

# scripts/package-mac.sh
# Helper script to package Folio as a signed and notarized DMG.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Folio DMG Packaging Tool${NC}"
echo "--------------------------"

# Check if environment variables are set, otherwise prompt (without exporting sensitive data permanently)
if [ -z "$APPLE_ID" ]; then
    read -p "Enter your Apple ID: " APPLE_ID
    export APPLE_ID
fi

if [ -z "$APPLE_APP_SPECIFIC_PASSWORD" ]; then
    read -sp "Enter your Apple App-Specific Password: " APPLE_APP_SPECIFIC_PASSWORD
    echo
    export APPLE_APP_SPECIFIC_PASSWORD
fi

if [ -z "$APPLE_TEAM_ID" ]; then
    read -p "Enter your Apple Team ID: " APPLE_TEAM_ID
    export APPLE_TEAM_ID
fi

echo -e "${GREEN}Credentials set for this session.${NC}"
echo -e "${BLUE}Starting production build and packaging...${NC}"

# Run the package script from the root
npm --prefix electron-app run package:dmg

echo -e "${GREEN}Packaging complete!${NC}"
echo -e "Check ${BLUE}electron-app/dist${NC} for the generated DMG."
