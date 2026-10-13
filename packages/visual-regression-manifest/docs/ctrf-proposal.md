# Proposal for ctrf-io/ctrf: visual regression tests in CTRF

Draft of the issue to open in https://github.com/ctrf-io/ctrf while the spec is pre-1.0. Everything asked for is additive and optional.

---

**Title:** Visual regression tests: a `visual` type, attachment roles and a few environment fields

## Problem

Screenshot comparison tools (Playwright `toHaveScreenshot`, Vitest `toMatchScreenshot`, jest-image-snapshot, BackstopJS, Roborazzi, Cypress plugins, and the hosted services) all end a run with the same data: per comparison, a baseline image, an actual image, usually a diff image, a diff ratio, the threshold it was checked against, and an outcome that is richer than pass/fail: "no baseline existed", "the baseline was created", "the baseline was updated on request", "approved from a review UI".

CTRF today has `attachments[]` with `name`, `contentType` and `path`, a single base64 `screenshot`, and five statuses. A reporter can put the three images in `attachments`, but nothing says which is which; the ratio, threshold and the finer outcomes have nowhere to go but `extra`, where every tool invents its own keys and no consumer can rely on them.

We built the [visual regression manifest](https://visual-regression.dev/manifest) on top of CTRF's names so a manifest converts to a CTRF report and back ([`toCtrf` / `fromCtrf`](https://github.com/Visual-Regression/visual-regression/blob/main/packages/visual-regression-manifest/src/convert/ctrf.ts)), and we keep the visual fields under an `extra.visualRegression` namespace. This issue asks whether some of it could be documented upstream, so that any CTRF consumer could show a screenshot diff.

## Asks

1. **Document `type: "visual"`** as a known classification value next to `unit`, `integration`, `e2e`, for tests whose outcome is an image comparison.
2. **Optional `role` on attachments** (string, open values; we use `baseline`, `actual`, `diff`, with `trace` and `video` as other obvious ones), so a consumer can pick the three images of a comparison out of `attachments[]` without parsing names.
3. **An optional `visual` object on a test**, or, if a new top-level key is too much for 1.0, an endorsed `extra.visualRegression` namespace:
   ```json
   {
     "diffRatio": 0.0231,
     "threshold": 0.01,
     "baselineWritten": false,
     "variant": "iphone-16-dark"
   }
   ```
   `diffRatio` is the share of differing pixels (0..1), `threshold` the ratio it was compared against, `baselineWritten` whether the run wrote the baseline file, `variant` a producer-chosen id telling baselines of one name apart (device, theme, locale).
4. **A few generic `environment` fields** CI reporters keep needing, visual or not: `ciProvider` (string id), `pullRequestNumber` (integer), `headCommit` (the PR head, as opposed to the merge commit in `commit`), `buildAttempt` (integer, for re-runs).

## What we are not asking for

New statuses. `missing-baseline` maps to `failed` (a human has to look), `created`/`updated`/`approved` map to `passed`, and `rawStatus` keeps the original; that works today.

## Compatibility

All additive, all optional; existing reports stay valid. We are happy to send a PR with schema, docs and an example report if any of this is welcome.

## Evidence

- Spec and converters: https://visual-regression.dev/manifest
- The mapping table manifest ↔ CTRF: https://visual-regression.dev/manifest/converting
- Tools whose output converts today: Playwright, Vitest, jest-image-snapshot, cypress-image-snapshot, cypress-visual-regression, BackstopJS, Roborazzi.
