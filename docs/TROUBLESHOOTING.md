# Troubleshooting Guide

This guide helps diagnose and resolve common issues with the Relogate platform.

## Table of Contents

- [Development Issues](#development-issues)
- [Build & Compilation](#build--compilation)
- [Authentication Issues](#authentication-issues)
- [API & Backend Issues](#api--backend-issues)
- [Database Issues](#database-issues)
- [Payment Issues](#payment-issues)
- [UI & Frontend Issues](#ui--frontend-issues)
- [Deployment Issues](#deployment-issues)

---

## Development Issues

### Dev Server Won't Start

**Symptom**: `npm run dev` fails or server doesn't start

**Solutions**:

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000

   # Or find and kill manually
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Node modules issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Cache issues**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Wrong Node version**
   ```bash
   # Check version
   node --version

   # Should be 18+ for frontend, 22+ for backend
   nvm use 22
   ```

### Hot Reload Not Working

**Symptom**: Changes don't appear without manual refresh

**Solutions**:

1. Check for syntax errors in the file
2. Restart dev server
3. Clear `.next` cache
4. Check file isn't outside watched directories

### TypeScript Errors

**Symptom**: Type errors during development

**Solutions**:

1. **Check strict mode**
   - Ensure `strict: true` in `tsconfig.json`

2. **Update types**
   ```bash
   npm install @types/node @types/react --save-dev
   ```

3. **Restart TypeScript server**
   - In VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

## Build & Compilation

### Build Fails

**Symptom**: `npm run build` fails

**Common Errors**:

1. **Type errors**
   ```
   Type error: Property 'x' does not exist on type 'y'
   ```
   - Fix type definitions
   - Add proper interfaces

2. **Import errors**
   ```
   Module not found: Can't resolve '@/components/...'
   ```
   - Check path aliases in `tsconfig.json`
   - Verify file exists at path

3. **ESLint errors**
   ```bash
   # Check specific errors
   npm run lint

   # Auto-fix where possible
   npm run lint -- --fix
   ```

### Out of Memory During Build

**Symptom**: Build crashes with memory error

**Solution**:
```bash
# Increase Node memory limit
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Build Warnings

**Symptom**: Warnings during build but succeeds

**Common warnings**:

1. **Large bundle size**
   - Use dynamic imports
   - Check for unnecessary dependencies

2. **Missing dependencies**
   ```bash
   npm install <missing-package>
   ```

---

## Authentication Issues

### Can't Log In

**Symptom**: Login fails or redirects back to login

**Solutions**:

1. **Check credentials**
   - Verify email and password are correct
   - Check for typos

2. **Check backend connection**
   ```bash
   # Verify API is reachable
   curl http://localhost:3001/health
   ```

3. **Clear session data**
   - Clear browser cookies/localStorage
   - Try incognito mode

4. **Check Supabase**
   - Verify user exists in Supabase Auth
   - Check if user is confirmed

### Session Expires Too Quickly

**Symptom**: Logged out unexpectedly

**Solutions**:

1. **Check token refresh**
   - Verify refresh token logic
   - Check token expiration settings

2. **Check network issues**
   - Refresh requests might be failing
   - Check browser console for errors

### Admin Can't Access Admin Routes

**Symptom**: Redirected when accessing `/admin`

**Solutions**:

1. **Check user role**
   - User must have `role: 'admin'`
   - Update in Supabase if needed

2. **Check auth guard**
   - Verify AuthGuard is checking role correctly

---

## API & Backend Issues

### API Requests Fail

**Symptom**: Network errors or 5xx responses

**Solutions**:

1. **Check backend is running**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check environment variables**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check backend has required env vars

3. **Check CORS**
   - Verify `CORS_ORIGIN` includes frontend URL
   - Check browser console for CORS errors

### 401 Unauthorized Errors

**Symptom**: API returns 401

**Solutions**:

1. **Check token**
   - Token might be expired
   - Try logging out and back in

2. **Check header**
   - Verify `Authorization: Bearer <token>` is sent
   - Check browser network tab

3. **Token refresh failing**
   - Check refresh token logic
   - Verify backend refresh endpoint works

### 404 Not Found

**Symptom**: API endpoint returns 404

**Solutions**:

1. Check API URL path is correct
2. Verify route exists in backend
3. Check API version prefix (`/api/v1`)

### 500 Internal Server Error

**Symptom**: API returns 500

**Solutions**:

1. **Check backend logs**
   ```bash
   # View backend console output
   npm run dev
   ```

2. **Check database connection**
   - Verify `DATABASE_URL` is correct
   - Check Supabase service status

3. **Check request payload**
   - Verify JSON is valid
   - Check required fields

---

## Database Issues

### Connection Fails

**Symptom**: Database connection errors

**Solutions**:

1. **Check connection string**
   ```bash
   # Verify DATABASE_URL format
   postgresql://user:password@host:port/database
   ```

2. **Check network access**
   - Verify IP is allowed in Supabase
   - Check firewall rules

3. **Check Supabase service**
   - Visit Supabase dashboard
   - Check service status

### Migration Fails

**Symptom**: `npm run db:migrate` fails

**Solutions**:

1. **Check migration files**
   - Look in `drizzle/` directory
   - Verify SQL syntax

2. **Check for conflicts**
   - Migration might conflict with existing data
   - Consider `db:push` for development

3. **Manual rollback**
   ```sql
   -- Check migration status
   SELECT * FROM drizzle.__drizzle_migrations;
   ```

### Data Not Appearing

**Symptom**: Data seems to not save or retrieve

**Solutions**:

1. **Check RLS policies**
   - Row Level Security might block access
   - Check Supabase policies

2. **Check query**
   - Verify correct table/columns
   - Check filters

3. **Check transaction**
   - Data might not be committed
   - Check for errors in service layer

---

## Payment Issues

### Checkout Won't Start

**Symptom**: Clicking payment button does nothing

**Solutions**:

1. **Check Stripe keys**
   - Verify `STRIPE_PUBLISHABLE_KEY` is set
   - Use test keys for development

2. **Check backend endpoint**
   - Verify `/payments/checkout` returns session URL

3. **Check browser console**
   - Look for JavaScript errors

### Webhook Not Received

**Symptom**: Payment completes but status doesn't update

**Solutions**:

1. **Check webhook listener (development)**
   ```bash
   # Start webhook forwarding
   stripe listen --forward-to localhost:3001/api/v1/payments/webhook
   ```

2. **Check webhook secret**
   - Verify `STRIPE_WEBHOOK_SECRET` matches CLI output

3. **Check webhook endpoint (production)**
   - Verify URL is correct in Stripe dashboard
   - Check endpoint is publicly accessible

### Payment Fails

**Symptom**: Payment rejected or fails

**Solutions**:

1. **Use test cards**
   - `4242424242424242` - Success
   - `4000000000000002` - Decline

2. **Check Stripe logs**
   - Visit Stripe Dashboard → Logs
   - Look for error details

3. **Check amount/currency**
   - Verify amount is valid
   - Check currency is supported

---

## UI & Frontend Issues

### Layout Broken

**Symptom**: UI doesn't look right

**Solutions**:

1. **Check RTL**
   - Site should be RTL for Hebrew
   - Verify `dir="rtl"` on html element

2. **Check CSS**
   - Inspect element in browser
   - Look for conflicting styles

3. **Check responsive breakpoint**
   - Test at different screen sizes
   - Verify mobile/desktop components load correctly

### Animations Not Working

**Symptom**: Framer Motion animations don't play

**Solutions**:

1. **Check `"use client"` directive**
   - Framer Motion requires client components

2. **Check reduced motion**
   - User might have reduced motion enabled
   - Test without accessibility settings

3. **Check AnimatePresence**
   - Required for exit animations
   - Verify proper wrapping

### Content Not Displaying

**Symptom**: Hebrew text not showing

**Solutions**:

1. **Check content import**
   ```tsx
   import { siteContent } from "@/content/he";
   ```

2. **Check content keys**
   - Verify property exists in content file

3. **Check font loading**
   - Verify Noto Sans Hebrew is loaded

### Images Not Loading

**Symptom**: Images show broken or placeholder

**Solutions**:

1. **Check URL**
   - Verify image URL is correct
   - Check CORS if external

2. **Check Next.js Image**
   - Add domain to `next.config.js` for external images

3. **Check file path**
   - Public folder images: `/image.png`
   - Imported images: Use import statement

---

## Deployment Issues

### Deployment Fails

**Symptom**: Deploy to Vercel/Netlify fails

**Solutions**:

1. **Check build locally first**
   ```bash
   npm run build
   ```

2. **Check environment variables**
   - All required vars must be set
   - Check for typos

3. **Check Node version**
   - Configure correct version in settings

### CORS Errors in Production

**Symptom**: Works locally, fails in production

**Solutions**:

1. **Update CORS_ORIGIN**
   - Must match production frontend URL
   - Include `https://`

2. **Check API URL**
   - `NEXT_PUBLIC_API_URL` must point to production backend

### SSL/HTTPS Issues

**Symptom**: Mixed content or SSL errors

**Solutions**:

1. **Use HTTPS everywhere**
   - API URL must use `https://`
   - No mixed http/https content

2. **Check SSL certificate**
   - Verify certificate is valid
   - Check expiration

---

## Debugging Tips

### Browser DevTools

1. **Console**: Check for JavaScript errors
2. **Network**: Monitor API requests/responses
3. **Application**: Check localStorage/cookies
4. **Elements**: Inspect HTML/CSS

### Backend Logging

1. **Enable debug logging**
   ```bash
   LOG_LEVEL=debug npm run dev
   ```

2. **Check log output**
   - Look for error messages
   - Track request flow

### Database Inspection

```bash
# Open Drizzle Studio
npm run db:studio
```

### Network Debugging

```bash
# Test API endpoint
curl -v http://localhost:3001/api/v1/health

# With auth header
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/v1/auth/me
```

---

## Getting Help

If you can't resolve an issue:

1. **Check documentation**
   - Review relevant docs
   - Check API reference

2. **Search error message**
   - Google the exact error
   - Check GitHub issues

3. **Create minimal reproduction**
   - Isolate the problem
   - Create simple test case

4. **Ask for help**
   - Provide error messages
   - Include steps to reproduce
   - Share relevant code snippets
