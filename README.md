# Alibi - Modern Web Solutions

A modern, responsive website built with Next.js 15, TypeScript, and Tailwind CSS, featuring CMS integration with Sanity and optimized for performance and SEO.

## 🚀 Features

- **Modern Design**: Clean, responsive design with smooth animations
- **CMS Integration**: Sanity CMS for easy content management
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
- **CMS**: Sanity
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
   # Sanity CMS Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_sanity_api_token
   
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

This project uses Sanity as a headless CMS. To set up content management:

1. **Create a Sanity account** at [sanity.io](https://sanity.io)
2. **Create a new project** in Sanity
3. **Set up content types**:
   - Film
   - Award
   - Service
   - Address
   - Team Member
4. **Add your project ID and API token** to `.env.local`
5. **Start creating content** in the Sanity Studio

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
│   ├── sanity.ts        # Sanity integration
│   └── seo.ts           # SEO utilities
└── types/               # TypeScript type definitions
```

## 🚀 Deployment

### Server Deployment with Docker

This project is configured for server deployment using Docker and GitHub Actions.

#### Prerequisites
- Server with Docker installed
- SSH access to the server
- GitHub repository with Actions enabled

#### Setup Steps

1. **Configure Server**
   - Install Docker and Docker Compose on your server
   - Set up SSH key authentication
   - Create deployment directory: `/opt/alibi`

2. **Configure GitHub Secrets**
   Add the following secrets to your GitHub repository:
   - `SERVER_SSH_KEY`: Private SSH key for server access
   - `SANITY_API_TOKEN`: Sanity API token for CMS access

3. **Deploy to Server**
   ```bash
   # Push to main branch (triggers automatic deployment)
   git add .
   git commit -m "Deploy to server"
   git push origin main
   ```

#### Configuration Details

The project uses Docker for deployment:
- **Build**: Next.js standalone build in Docker container
- **Runtime**: Node.js server on port 3000 (mapped to 3100)
- **Reverse Proxy**: Nginx configuration for domain routing
- **CMS**: Sanity integration with environment variables

#### Environment Variables

Required environment variables for server deployment:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET`: Your Sanity dataset (usually 'production')
- `SANITY_API_TOKEN`: Sanity API token for content fetching

#### Troubleshooting

If deployment fails:
1. Check GitHub Actions logs in your repository
2. Verify SSH key is correctly configured
3. Ensure server has Docker and Docker Compose installed
4. Check that all required environment variables are set

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
Modify content types in `src/lib/sanity.ts` to match your Sanity setup.

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
- [Sanity](https://sanity.io/) for the headless CMS
- [Lucide](https://lucide.dev/) for the beautiful icons
