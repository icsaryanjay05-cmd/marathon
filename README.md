# PACE — Marathon Training Hub

A responsive, local-first marathon training, running analytics, nutrition and schedule website. **No backend, subscriptions, logins or API keys required.**

## Quick start

1. Keep the following **six files in one directory**: `index.html`, `styles.css`, `motion.css`, `plan.js`, `app.js`, `motion.js`.
2. Open `index.html` in a modern browser. For more consistent storage behavior, host on HTTPS (e.g. GitHub Pages).
3. Explore **Overview**, **Training plan**, **Run journal**, **Nutrition & fuel**, **Daily schedule**, and **Insights**.
4. Click **Log a run** to begin. Planned workouts are preloaded, but actual runs are deliberately blank; no workouts have been fabricated.
5. Set your body weight, nutrition targets, mileage goal, and marathon goal under **Settings & goals**.

## Publish online for free with GitHub Pages

1. Sign into GitHub, create a **new public repository** (example: `marathon-training-hub`).
2. Upload **`index.html`, `styles.css`, `motion.css`, `plan.js`, `app.js`, `motion.js`** directly to the repository root (not inside a subfolder).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch** → `main` → `/ (root)` → **Save**.
5. Wait for GitHub Pages to finish publishing and use the URL shown there. Typically the URL is `https://USERNAME.github.io/marathon-training-hub/` (where USERNAME is your GitHub username).

No Vercel or paid hosting is required.

## What is inside

- **Animated opening screen:** branded 42.2 km runner-route animation, progress bar, and a Skip intro button. The intro closes as the site loads, with a safety timeout.
- **Motion system:** smooth page/section reveals, subtle dashboard hover effects, animated chart bars and pace line, progress meters, dialogs, and highlighted navigation. Supports system Reduce Motion settings.
- **Dashboard:** race countdown, current-week running volume, distance-weighted average pace, core planned-versus-actual weekly mileage chart, next workout, most recent sessions.
- **Training plan:** editable session-by-session program for **October 12–November 28, 2026**, with Monday threshold, Tuesday and Saturday strength, Friday long runs, November 14 10K, and November 28 marathon. Mark workouts completed or log a run on that date. Optional session distances are not counted in the planned mileage estimate.
- **Run journal:** add/edit/delete distance, time, date, run type, average HR, perceived effort (RPE), sleep, carbs consumed during running, fluids, shoe and notes. Pace is computed from distance and moving time.
- **Nutrition & fuel:** daily calorie, carbohydrate, protein, fat and fluids logs. Includes editable targets, common-food quick entries, training-day meal ideas and your plan's endurance fueling guidance.
- **Daily schedule:** weekly calendar and individually editable activities with date, time, category, notes and completion state, alongside scheduled runs.
- **Insights:** recent pace chart, distance by training type, total running time and distance, longest run, logged mean HR, run effort, mileage change and rule-based training notes. These are not medical recommendations.
- **Backup/restore:** JSON download/restore for all your data; CSV export for the run journal.

## How data is stored

Data is saved with **browser `localStorage`** under `pace.marathon.v1`. It stays on the **current browser on the current device**. It does not automatically synchronize between a computer and a phone; no data is uploaded to GitHub or shared with the public by this website. If you clear site data, use a different browser, or change the website's URL, you may not see your earlier logs.

**Use the Backup button regularly** (bottom of sidebar) and save the JSON file somewhere secure. Click **Restore** to replace the browser's dataset with a saved backup.

This version intentionally does not publish or synchronize a Google Sheet, COROS account or any external personal data. A future version could add an authenticated backend/sync service or a supervised file import.

## Data safety and limitations

- Calorie and macro targets are illustrative starter values you can edit, not a personalized nutrition prescription. Estimates for the banana, rice, egg, gel and sports-drink shortcuts depend on brand and portion size; check labels.
- Sleep warnings and mileage comparisons are basic heuristics, not injury diagnosis or predictions. Review with a professional if unwell or injured.
- The marathon pace reference is not an automated finish-time prediction. Training plan distinguishes a sub-3 stretch goal from provisional 3:10–3:15 planning.
- A third-party Google Fonts request is made if online; the site otherwise uses system fonts. No analytics scripts or tracking tools are included.

## Editing the website

- `index.html`: layout, navigation and editable forms.
- `styles.css`: colors, spacing and responsive layout.
- `motion.css`: loading-screen visual design and accessible animations.
- `motion.js`: loading state, animated section reveals and line-chart transitions.
- `plan.js`: initial day-by-day training plan and week descriptions.
- `app.js`: data storage, analytics, calendar, forms, charts and navigation.

### Updating the default plan

The schedule is generated from the `TRAINING_ROWS` table in `plan.js`. Editing it changes the **default plan only for new visitors**. Existing users have their own stored plan, which they can edit within the Training plan screen or by clearing/restoring their local data.

Created October 2026. Animated edition updated October 11, 2026.

## Animation notes

The loading screen is intentionally a short branded entrance, **not a live network transfer measurement**. Click **Skip intro** to dismiss it early. Users who prefer reduced motion automatically bypass the introduction and see an animation-free interface.

If you previously deployed the four-file version, keep your existing `app.js` and `plan.js` data handling by replacing all four original site files with the updated ones, **and add `motion.css` and `motion.js`**. GitHub Pages will serve the changes automatically after your push; if you see an old version, refresh the browser. Your locally stored training entries are not deleted by updating these website files when you continue using the same URL and browser origin.
