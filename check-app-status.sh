#!/bin/bash

echo "🧪 CAMPUS EXCHANGE APPLICATION STATUS CHECK"
echo "============================================"

# Check if development server is running
echo "1. Checking Development Server Status..."
if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Development server is running on http://localhost:3000"
    
    # Check if CSS is being served
    echo ""
    echo "2. Checking CSS Accessibility..."
    CSS_URL=$(curl -s http://localhost:3000 | grep -o 'href="[^"]*\.css[^"]*"' | head -1 | cut -d'"' -f2)
    if [ -n "$CSS_URL" ]; then
        echo "📄 CSS URL found: $CSS_URL"
        if curl -s -f "http://localhost:3000$CSS_URL" > /dev/null 2>&1; then
            echo "✅ CSS file is accessible"
        else
            echo "⚠️  CSS file not accessible (this may be normal in dev mode)"
        fi
    else
        echo "⚠️  No CSS URL found in HTML"
    fi
    
    # Check if Tailwind classes are being used
    echo ""
    echo "3. Checking Tailwind CSS Usage..."
    if curl -s http://localhost:3000 | grep -q "bg-gradient-to-br\|antialiased\|bg-background"; then
        echo "✅ Tailwind CSS classes are being used in the HTML"
    else
        echo "❌ Tailwind CSS classes not found in HTML"
    fi
    
    # Check if the page loads properly
    echo ""
    echo "4. Checking Page Content..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Home page loads successfully (HTTP $HTTP_CODE)"
        
        # Check for expected content
        if curl -s http://localhost:3000 | grep -qi "campus exchange\|loading"; then
            echo "✅ Page content is being served"
        else
            echo "⚠️  Unexpected page content"
        fi
    else
        echo "❌ Home page failed to load (HTTP $HTTP_CODE)"
    fi
    
    # Check build status
    echo ""
    echo "5. Checking Build Status..."
    if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
        echo "✅ Build artifacts exist"
        
        # Check if CSS files were generated
        CSS_COUNT=$(find .next/static/css -name "*.css" 2>/dev/null | wc -l)
        echo "📄 Generated CSS files: $CSS_COUNT"
        
        if [ "$CSS_COUNT" -gt 0 ]; then
            echo "✅ CSS files were generated during build"
        else
            echo "❌ No CSS files found in build output"
        fi
    else
        echo "❌ Build artifacts not found"
    fi
    
else
    echo "❌ Development server is not running on http://localhost:3000"
    echo "Please start the server with: npm run dev"
fi

echo ""
echo "============================================"
echo "🎯 STATUS SUMMARY"

# Final assessment
if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    if curl -s http://localhost:3000 | grep -q "bg-gradient-to-br\|antialiased"; then
        if [ -d ".next" ] && [ "$(find .next/static/css -name "*.css" 2>/dev/null | wc -l)" -gt 0 ]; then
            echo "🌟 APPLICATION IS WORKING CORRECTLY!"
            echo "✅ Development server running"
            echo "✅ CSS is being applied"
            echo "✅ Build process working"
            echo "✅ Ready for development and testing"
        else
            echo "⚠️  APPLICATION MOSTLY WORKING"
            echo "✅ Development server running"
            echo "✅ CSS is being applied"
            echo "⚠️  Build artifacts may need regeneration"
        fi
    else
        echo "⚠️  APPLICATION RUNNING WITH CSS ISSUES"
        echo "✅ Development server running"
        echo "❌ CSS may not be applied correctly"
    fi
else
    echo "❌ APPLICATION NOT ACCESSIBLE"
    echo "Please start the development server"
fi

echo ""
echo "📋 NEXT STEPS:"
echo "1. If server is not running: npm run dev"
echo "2. Access the application at: http://localhost:3000"
echo "3. For production build: npm run build"
echo "4. For code quality: npm run lint"