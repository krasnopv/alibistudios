#!/bin/bash

echo "🧪 Testing build configuration..."

echo "📦 Testing production build..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo "🎉 Build successful!"
