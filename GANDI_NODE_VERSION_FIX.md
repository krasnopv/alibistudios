# Fixing Node.js Version Issue on Gandi

## Problem
Gandi is using Node.js 18.14.2, but Next.js 15.5.7 requires Node.js ^18.18.0 || ^19.8.0 || >= 20.0.0

## Solutions

### Option 1: Request Node.js Upgrade from Gandi (RECOMMENDED)

Contact Gandi support and request to upgrade Node.js to version 20 or higher. This is the best long-term solution.

**Contact Gandi Support:**
- Mention that your Next.js 15 application requires Node.js 20+
- Reference that Node.js 18.14.2 is below the minimum required version (18.18.0)

### Option 2: Use .nvmrc or .node-version File

Create a `.nvmrc` or `.node-version` file in the project root to specify the required Node.js version:

```bash
# Create .nvmrc file
echo "20" > .nvmrc
```

Gandi might respect this file and use the specified version.

### Option 3: Downgrade Next.js (NOT RECOMMENDED)

If Gandi cannot upgrade Node.js, you would need to downgrade to Next.js 14.x, which supports Node.js 18.14.2. However, this is a major downgrade and may break features.

**If you must downgrade:**
```bash
npm install next@14.2.18 react@18 react-dom@18
```

⚠️ **Warning**: This will require significant code changes and may break existing features.

### Option 4: Use Docker/Container (If Available)

If Gandi supports Docker containers, you could use the existing Dockerfile which specifies Node.js 20.

## Current Status

✅ Postinstall script is working - it detects Gandi server correctly
❌ Build fails due to Node.js version incompatibility

## Next Steps

1. **First**: Contact Gandi support to upgrade Node.js to version 20+
2. **If that fails**: Try creating `.nvmrc` file with version "20"
3. **Last resort**: Consider downgrading Next.js (requires code changes)

