#!/bin/bash

echo "🧪 Testing both build configurations..."

echo "📦 Testing local development build..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Local build successful"
else
    echo "❌ Local build failed"
    exit 1
fi

echo "🌐 Testing GitHub Pages build..."
GITHUB_ACTIONS=true npm run build:gh-pages
if [ $? -eq 0 ]; then
    echo "✅ GitHub Pages build successful"
    echo "📁 Generated files in /docs folder:"
    ls -la docs/ | grep -E "\.(svg|mp4|html)$" | head -5
else
    echo "❌ GitHub Pages build failed"
    exit 1
fi

echo "🎉 All builds successful!"
