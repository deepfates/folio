#!/bin/bash
# Generate app icons from SVG source with transparent background
# Requires: rsvg-convert (librsvg), iconutil (macOS)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SVG_SOURCE="$PROJECT_ROOT/logomark.svg"
OUTPUT_DIR="$PROJECT_ROOT/electron-app/electron-app/resources"
ICONSET_DIR="$OUTPUT_DIR/icon.iconset"

echo "🎨 Generating icons from $SVG_SOURCE"

# Create output directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$ICONSET_DIR"

# Generate PNG files at various sizes required for macOS icon
# macOS iconset requires specific sizes and naming convention
SIZES=(16 32 64 128 256 512)

for size in "${SIZES[@]}"; do
    # Standard resolution
    echo "  → Generating ${size}x${size}..."
    rsvg-convert -w $size -h $size "$SVG_SOURCE" -o "$ICONSET_DIR/icon_${size}x${size}.png"
    
    # Retina (@2x) resolution - double the size, same name format
    double=$((size * 2))
    if [ $double -le 1024 ]; then
        echo "  → Generating ${size}x${size}@2x (${double}px)..."
        rsvg-convert -w $double -h $double "$SVG_SOURCE" -o "$ICONSET_DIR/icon_${size}x${size}@2x.png"
    fi
done

# Generate 512@2x (1024px)
echo "  → Generating 512x512@2x (1024px)..."
rsvg-convert -w 1024 -h 1024 "$SVG_SOURCE" -o "$ICONSET_DIR/icon_512x512@2x.png"

# Generate main icon.png (used for various purposes, 1024px)
echo "  → Generating main icon.png..."
rsvg-convert -w 1024 -h 1024 "$SVG_SOURCE" -o "$OUTPUT_DIR/icon.png"

# Convert iconset to icns using macOS iconutil
echo "🔨 Creating icon.icns..."
iconutil -c icns "$ICONSET_DIR" -o "$OUTPUT_DIR/icon.icns"

# Cleanup iconset directory (optional - keep for debugging)
rm -rf "$ICONSET_DIR"

echo "✅ Icons generated successfully:"
echo "   - $OUTPUT_DIR/icon.icns (macOS app icon)"
echo "   - $OUTPUT_DIR/icon.png (general use, 1024px)"
