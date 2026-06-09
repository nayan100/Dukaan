# Track Specification: Vercel Showcase Deployment

## 1. Overview
Deploy the Dukaan Grand Showcase frontend to Vercel to provide a live, accessible demo of the application's persona-driven UX and real-time state management.

## 2. Functional Requirements
### 2.1 Vercel Deployment
- Configure and deploy the `frontend/` directory as a Vercel project.
- Implement `vercel.json` to handle React Router deep-linking (SPAs).

### 2.2 CI/CD Integration
- Create a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployments on push to `master`.
- Configure Vercel Project Secrets (tokens/project IDs) in the GitHub repository.

### 2.3 Environment & Mode
- Ensure the app builds correctly using `npm run build` (Vite).
- Verify that the "Showcase Mode" (mock data) is active and functional on the live URL.

## 3. Acceptance Criteria
- [ ] Application is live at a `.vercel.app` URL.
- [ ] Sub-routes (e.g., `/admin`, `/hq`) load correctly on direct refresh.
- [ ] Automatic deployment triggers on branch updates.
- [ ] No hardcoded secrets or sensitive developer tokens are leaked in the client build.

## 4. Out of Scope
- Backend API deployment.
- Custom domain setup.
- Persistent cross-device data.
