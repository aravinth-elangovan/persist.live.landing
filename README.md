# Persist.Live Landing Page

## 📦 What's Included

- **Pure.css** responsive framework (~4KB) for optimal loading speed
- **Secure** Supabase Edge Functions (no exposed API keys)
- **Dark mode** with localStorage persistence
- **Mobile-first** responsive design
- **Google Analytics** integration ready
- **SEO optimized** with meta tags

## 🚀 Deployment Checklist

### Step 1: Deploy Supabase Database Tables

Run the migration to create the required tables:

```bash
cd /Users/aravinth/workspaces/energy/persistLive
supabase db push
```

This will create:
- `waitlist` table
- `contact_submissions` table

Both tables have Row Level Security (RLS) enabled with service-role-only access.

### Step 2: Deploy Supabase Edge Functions

Deploy both Edge Functions to your Supabase project:

```bash
# Deploy waitlist function
supabase functions deploy join-waitlist

# Deploy contact function
supabase functions deploy submit-contact
```

**Important:** Make sure your `.env` file has `SUPABASE_SERVICE_ROLE_KEY` set, as Edge Functions need it to bypass RLS.

### Step 3: Configure JavaScript

Edit `landing/js/main.js` and update the configuration:

```javascript
const CONFIG = {
    // Replace with your actual Supabase project URL
    SUPABASE_URL: 'https://your-project-id.supabase.co',  // ← CHANGE THIS
    EDGE_FUNCTIONS: {
        waitlist: '/functions/v1/join-waitlist',
        contact: '/functions/v1/submit-contact'
    }
};
```

**How to find your Supabase URL:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > API
4. Copy the "Project URL" (e.g., `https://abcdefgh.supabase.co`)

### Step 4: Add Google Analytics

Edit `landing/index.html` (line 34) and replace the placeholder:

```html
<!-- Replace G-XXXXXXXXXX with your actual GA4 tracking ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID-HERE"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YOUR-ID-HERE');  // ← CHANGE THIS
</script>
```

**How to get Google Analytics ID:**
1. Go to https://analytics.google.com/
2. Create a new GA4 property for persist.live
3. Get your Measurement ID (starts with `G-`)

### Step 5: Deploy to GoDaddy

#### Option A: Via FTP/File Manager

1. Log in to your GoDaddy cPanel
2. Go to File Manager
3. Navigate to `public_html` (or your domain's root directory)
4. Upload all files from the `landing/` folder:
   ```
   landing/
   ├── index.html
   ├── privacy.html
   ├── terms.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   └── main.js
   └── assets/ (if any)
   ```

#### Option B: Via FTP Client (FileZilla)

1. Get FTP credentials from GoDaddy cPanel
2. Connect with FileZilla
3. Upload all files to `public_html/`

### Step 6: Test Deployment

1. Visit https://persist.live
2. Test all functionality:
   - ✅ Dark mode toggle
   - ✅ Mobile menu
   - ✅ FAQ accordion
   - ✅ Waitlist form submission
   - ✅ Contact form submission
   - ✅ All navigation links
   - ✅ Privacy & Terms pages

## 🔧 Testing Locally

To test before deploying:

```bash
# Option 1: Python HTTP Server
cd landing
python3 -m http.server 8080

# Option 2: Node HTTP Server
npx http-server landing -p 8080
```

Then visit http://localhost:8080

**Note:** Form submissions won't work locally unless you:
1. Have deployed the Supabase Edge Functions
2. Updated `CONFIG.SUPABASE_URL` in `main.js`
3. Have CORS enabled on your Edge Functions (already configured)

## 📊 Performance Optimization

Current performance metrics:

- **Pure.css**: ~4KB (gzipped)
- **Custom CSS**: ~8KB (gzipped)
- **JavaScript**: ~5KB (gzipped)
- **Total**: ~17KB + HTML

**Tips for even better performance:**
1. Enable gzip compression on GoDaddy server
2. Set browser caching headers
3. Use CDN for assets (Pure.css already on CDN)
4. Optimize any images before uploading

## 🔐 Security Notes

✅ **What's Secure:**
- No Supabase anon key exposed in client code
- All database operations go through Edge Functions
- Edge Functions use service role key (server-side only)
- Rate limiting implemented (3 requests per 15 minutes per IP)
- RLS policies prevent direct database access

⚠️ **Production Enhancements (Future):**
- Implement Redis/Upstash for distributed rate limiting
- Add CAPTCHA for spam prevention
- Set up monitoring/alerting for Edge Functions
- Add email notifications for new waitlist signups

## 📝 Content Updates

### Update FAQ

Edit `landing/index.html`, find the FAQ section (~line 250), and modify the questions/answers as needed.

### Update Profession Dropdown

Edit `landing/index.html` (~line 180):

```html
<select id="waitlist-profession" name="profession">
    <option value="">Select profession (optional)</option>
    <option value="executive">Executive</option>
    <!-- Add more options here -->
</select>
```

### Update Footer Links

Edit the footer section in `index.html` (~line 320).

## 🐛 Troubleshooting

### Forms Not Submitting

1. Check browser console for errors
2. Verify `CONFIG.SUPABASE_URL` is correct in `main.js`
3. Ensure Edge Functions are deployed: `supabase functions list`
4. Check Edge Function logs: `supabase functions logs join-waitlist`

### Dark Mode Not Persisting

- Check if localStorage is enabled in browser
- Clear browser cache and try again

### Mobile Menu Not Working

- Check JavaScript is loading (browser dev tools > Network tab)
- Clear browser cache

## 📈 Analytics Events

The following events are tracked in Google Analytics:

- **join_waitlist**: When user joins waitlist
- **contact_form**: When user submits contact form

View these in Google Analytics > Events.

## 🎨 Customization

### Change Brand Color

Edit `landing/css/styles.css` (line 8):

```css
:root {
    --brand-orange: #FF9500;  /* Change this */
    --brand-orange-hover: #E68600;  /* And this */
}
```

### Change Fonts

Edit `landing/css/styles.css` (line 27):

```css
:root {
    --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

## 📞 Support

For issues or questions:
- Email: persistlive.ai@gmail.com
- Check Supabase dashboard for Edge Function errors
- Check browser console for JavaScript errors

## ✅ Launch Checklist

Before announcing the landing page:

- [ ] All forms tested and working
- [ ] Google Analytics tracking verified
- [ ] Dark mode works correctly
- [ ] Mobile responsive on all devices
- [ ] All links work (Privacy, Terms, etc.)
- [ ] No console errors
- [ ] SEO meta tags filled in
- [ ] Favicon displays correctly
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Test on real mobile devices

---

**Built with:**
- Pure.css (4KB) - Lightweight responsive framework
- Vanilla JavaScript - No dependencies
- Supabase Edge Functions - Secure serverless backend
- GoDaddy - Simple static hosting

**Total page weight: ~17KB + HTML (~25KB total) = Blazing fast! 🚀**
