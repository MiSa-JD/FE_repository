# Repository Guidelines

## Project Structure & Module Organization
Source loads from `index.html` into `app/main.tsx` and ultimately `app/App.tsx`. Feature views live under `app/components/{community|game|order|support|user|layout}` with their hooks, state, and tests co-located. Shared UI primitives stay in `app/components/ui`; extend existing variants before adding new atoms. Global styling flows from `app/global.css` tokens, with Tailwind output in `app/index.css` and localized overrides in `app/custom.css`. Static assets belong in `public/`, onboarding flows in `app/welcome/`, and production builds land in `build/`.

## Build, Test, and Development Commands
Run `npm run dev` to start the Vite dev server at http://localhost:3000. Use `npm run build` before tagging releases to emit the optimized bundle to `build/`. Serve a built snapshot with `npx vite preview`. Execute `vitest run` for the headless unit and component suites once dependencies are installed.

## Coding Style & Naming Conventions
Author React 18 + TypeScript components in PascalCase files, keeping props, hooks, and state identifiers in camelCase. Stick to tokens-driven, kebab-case utility classes and prefer `app/custom.css` only when missing a token. Keep files ASCII-only, rely on repository formatters, and mirror existing `class-variance-authority` patterns for variant logic.

## Testing Guidelines
Co-locate `*.test.tsx` beside their components (e.g., `FeaturePanel.test.tsx`). Mock outbound calls through helpers in `app/api/*` to keep suites deterministic, and ensure `vitest run` passes before pushing.

## Commit & Pull Request Guidelines
Follow the `type(scope): summary` convention, keeping commits small, reversible, and domain-specific. PRs should outline intent, link tracking issues, and attach before/after screenshots for UI updates. Confirm `npm run build` succeeds and document manual QA steps or accessibility considerations.

## Security & Configuration Tips
Never commit secrets or environment files. Discuss any change to the default port 3000 in `vite.config.ts` before merging. Deploy by serving the `build/` output to mirror production expectations.
