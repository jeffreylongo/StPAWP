#!/bin/bash

# ================================================
# Build Script for GoDaddy STAGING Deployment
# St. Petersburg Lodge No. 139 F&AM
# ================================================

echo "🏛️  St. Petersburg Lodge No. 139 - GoDaddy STAGING Build Script"
echo "================================================================="
echo ""
echo "🎯 Building for STAGING: s9d.607.myftpupload.com"
echo "⚠️  NOT for production (stpetelodge139.org) yet!"
echo ""

# Check if we're in the right directory
if [ ! -f "angular.json" ]; then
    echo "❌ Error: angular.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Check Node version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Current version: $NODE_VERSION"

REQUIRED_VERSION="v18"
if [[ ! $NODE_VERSION == $REQUIRED_VERSION* ]]; then
    echo "⚠️  Warning: Node.js 18+ recommended. Current: $NODE_VERSION"
    echo "   Run: nvm use 18.20.2"
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Clean previous build
echo ""
echo "🧹 Cleaning previous build..."
if [ -d "dist" ]; then
    rm -rf dist
    echo "   ✓ Removed old dist folder"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi
echo "   ✓ Dependencies installed"

# Build for STAGING
echo ""
echo "🔨 Building for STAGING environment..."
npm run build:staging
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    echo ""
    echo "💡 Tip: Make sure you've updated src/environments/environment.staging.ts"
    echo "   with your WooCommerce API keys from staging WordPress!"
    exit 1
fi
echo "   ✓ Build completed successfully!"

# Check build output
BUILD_DIR="dist/stpete-lodge139-angular-head-v1/browser"
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found: $BUILD_DIR"
    exit 1
fi

# Display build info
echo ""
echo "📊 Build Information:"
echo "   Build directory: $BUILD_DIR"
echo "   Files created:"
ls -lh "$BUILD_DIR" | tail -n +2 | awk '{print "      " $9 " (" $5 ")"}'

# Calculate total size
TOTAL_SIZE=$(du -sh "$BUILD_DIR" | awk '{print $1}')
echo ""
echo "   Total size: $TOTAL_SIZE"

# Create deployment package
echo ""
echo "📦 Creating deployment package..."
DEPLOY_ZIP="stpete-lodge139-STAGING-deploy-$(date +%Y%m%d-%H%M%S).zip"
cd "$BUILD_DIR"
zip -r "../../../$DEPLOY_ZIP" ./* > /dev/null 2>&1
cd ../../..
echo "   ✓ Created: $DEPLOY_ZIP (STAGING BUILD)"

# Copy helper files to dist for easy access
echo ""
echo "📋 Preparing deployment files..."
cp .htaccess.example "$BUILD_DIR/.htaccess.example"
cp wordpress-cors-plugin.php "$BUILD_DIR/../wordpress-cors-plugin.php"
echo "   ✓ Copied configuration files"

# Display next steps
echo ""
echo "✅ STAGING Build Complete!"
echo "========================================================"
echo ""
echo "🎯 STAGING DEPLOYMENT (s9d.607.myftpupload.com)"
echo ""
echo "📤 Next Steps for GoDaddy STAGING:"
echo ""
echo "1️⃣  Connect to STAGING via SSH/FTP:"
echo "   • SSH: s9d.607.myftpupload.com"
echo "   • Or use FTP/cPanel File Manager"
echo ""
echo "2️⃣  Backup STAGING WordPress (if it exists):"
echo "   • Export database from phpMyAdmin"
echo "   • Download all WordPress files"
echo ""
echo "3️⃣  Move WordPress to /wp subdirectory:"
echo "   • cPanel → File Manager → public_html"
echo "   • Create 'wp' folder"
echo "   • Move all WordPress files into 'wp/'"
echo ""
echo "4️⃣  Update WordPress URLs for STAGING:"
echo "   • SQL: UPDATE wp_options SET option_value = 'http://s9d.607.myftpupload.com/wp'"
echo "   • WHERE option_name IN ('siteurl', 'home');"
echo ""
echo "5️⃣  Upload Angular files:"
echo "   • Upload all files from: $BUILD_DIR"
echo "   • To STAGING: public_html/"
echo "   • Use FTP or cPanel File Manager"
echo ""
echo "6️⃣  Configure .htaccess:"
echo "   • Rename .htaccess.example to .htaccess"
echo "   • Place in public_html/"
echo ""
echo "7️⃣  Install WordPress CORS plugin:"
echo "   • Upload wordpress-cors-plugin.php"
echo "   • To: wp/wp-content/mu-plugins/"
echo "   • Create mu-plugins folder if needed"
echo ""
echo "📚 Full Guide: GODADDY_DEPLOYMENT_GUIDE.md"
echo ""
echo "📦 Deployment Package: $DEPLOY_ZIP"
echo "   (STAGING BUILD - Upload and extract on s9d.607.myftpupload.com)"
echo ""
echo "⚠️  IMPORTANT: This is for STAGING only!"
echo "   Test thoroughly before deploying to production (stpetelodge139.org)"
echo ""
echo "🎉 Good luck with your STAGING deployment!"
echo "   - St. Petersburg Lodge No. 139 F&AM"
echo ""

