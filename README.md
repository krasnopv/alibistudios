# Alibi - Modern Web Solutions

A modern, responsive website built with Next.js 15, TypeScript, and Tailwind CSS, featuring CMS integration with Contentful and optimized for performance and SEO.

## 🚀 Features

- **Modern Design**: Clean, responsive design with smooth animations
- **CMS Integration**: Contentful CMS for easy content management
- **Performance Optimized**: Fast loading with Next.js optimizations
- **SEO Ready**: Complete SEO setup with sitemap and meta tags
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Smooth animations and transitions
- **Contact Forms**: Functional contact forms with validation
- **Mobile First**: Responsive design that works on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **CMS**: Contentful
- **Icons**: Lucide React
- **Fonts**: Inter & Poppins (Google Fonts)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alibi
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Contentful CMS Configuration
   CONTENTFUL_SPACE_ID=your_contentful_space_id
   CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token
   CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_contentful_preview_token
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=Alibi
   
   # Analytics (Optional)
   NEXT_PUBLIC_GA_ID=your_google_analytics_id
   NEXT_PUBLIC_GTM_ID=your_google_tag_manager_id
   ```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Content Management

This project uses Contentful as a headless CMS. To set up content management:

1. **Create a Contentful account** at [contentful.com](https://contentful.com)
2. **Create a new space** in Contentful
3. **Set up content types**:
   - Blog Post
   - Service
   - Project
   - Team Member
4. **Add your space ID and access token** to `.env.local`
5. **Start creating content** in the Contentful web app

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── contact/          # Contact page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── Header.tsx        # Navigation header
│   ├── Hero.tsx          # Hero section
│   ├── Services.tsx      # Services section
│   ├── Portfolio.tsx     # Portfolio section
│   ├── ContactForm.tsx   # Contact form
│   └── Footer.tsx        # Footer
├── config/              # Configuration files
│   └── env.ts           # Environment variables
├── lib/                 # Utility libraries
│   ├── contentful.ts    # Contentful integration
│   └── seo.ts           # SEO utilities
└── types/               # TypeScript type definitions
```

## 🚀 Deployment

### GitHub Pages (Static Export)

This project is configured for GitHub Pages deployment with static export.

#### Prerequisites
- GitHub repository
- GitHub Actions enabled

#### Setup Steps

1. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to "Pages" section
   - Set Source to "GitHub Actions"

2. **Deploy to GitHub Pages**
   ```bash
   # Push to main branch (triggers automatic deployment)
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Manual Build (Optional)**
   ```bash
   # Build for GitHub Pages
   npm run build:gh-pages
   
   # The build output will be in the 'docs' folder
   # You can then commit and push the docs folder
   ```

#### Configuration Details

The project uses conditional configuration for GitHub Pages:
- **Local Development**: `npm run dev` (port 3001)
- **GitHub Pages Build**: Automatic via GitHub Actions
- **Output Directory**: `docs/` (configured in `next.config.ts`)
- **Base Path**: `/alibistudios` (your repository name)

#### Environment Variables for GitHub Pages

No environment variables needed for static export. The build process:
1. Automatically detects GitHub Actions environment
2. Switches to static export mode
3. Builds to `docs/` directory
4. Deploys to GitHub Pages

#### Troubleshooting

If deployment fails:
1. Check GitHub Actions logs in your repository
2. Ensure the workflow file exists in `.github/workflows/deploy.yml`
3. Verify the repository name matches the `basePath` in `next.config.ts`

**Common Issues:**

**404 Errors for Assets (logos, images, etc.):**
- This happens when assets aren't being copied to the build output
- The `getAssetPath` function should handle this automatically
- If assets are still missing, check that they exist in the `public/` directory
- Ensure the GitHub Actions environment variable `GITHUB_ACTIONS: 'true'` is set correctly

**Build Failures:**
- Check that all dependencies are installed correctly
- Verify that the build command `npm run build:gh-pages` completes successfully
- Look for any TypeScript or ESLint errors in the build logs

### Vercel (Alternative)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on every push

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔧 Customization

### Colors and Branding
Update the color scheme in `src/app/globals.css`:
```css
:root {
  --primary: #3b82f6;
  --secondary: #64748b;
  --accent: #f59e0b;
}
```

### Content Types
Modify content types in `src/lib/contentful.ts` to match your Contentful setup.

### SEO
Update SEO settings in `src/lib/seo.ts` for your specific needs.

## 📈 Performance

This project includes several performance optimizations:
- **Image optimization** with Next.js Image component
- **Font optimization** with Google Fonts
- **Code splitting** with dynamic imports
- **Compression** enabled
- **Caching** strategies implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at hello@alibi.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Contentful](https://contentful.com/) for the headless CMS
- [Lucide](https://lucide.dev/) for the beautiful icons
