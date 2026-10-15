# Homepage media demo

The live `index.html` and all existing assets are unchanged.

- `demo-original.html`: byte-for-byte copy of `index.html` at commit `0ef75b9` for comparison. Its original forms remain live; do not send test enquiries from this page.
- `demo.html`: complete homepage with additional media treatments. Its visible enquiry forms show a demo notice instead of sending messages. Search indexing is disabled on this enhanced demo.

## Included concept

A ten-second, muted factory loop gives the existing hero movement, with a pause/play control and poster fallback. Reduced-motion and data-saving preferences prevent automatic playback. The background pauses off screen and when the tab is hidden.

After About, a dedicated factory story presents the complete 33-second film with native controls and sound available on demand. Next is a 20-photo gallery with Facility, Production and Products filters, thumbnail navigation, arrows, touch swipe and a fullscreen dialog. Escape closes the viewer; left/right keys navigate it.

The user-supplied original photos and video are retained outside this repository. Web derivatives preserve the embedded branding. Photos are at most 1600px along either dimension, with separate 320px thumbnails. The full video loads on demand. No new third-party libraries were added.

## Other creative directions

1. **Quiet hero:** Keep the original still-image hero and use only the factory story below About. This is the lightest, least distracting option.
2. **Process chapters:** Use selected video moments beside the stages material handling, processing and pressing, followed by product close-ups. Confirm detailed process labels before publishing them.
3. **Gallery-led story:** Make a film poster the lead gallery tile and open the full film on request; keep a compact photo strip below it.
4. **Product details:** Pair each existing product description with matching factory/product photographs. Use block and slab close-ups where the format is visually clear; do not infer unverified weights or specifications from a photograph.

Recommendation: review the current hero-loop plus factory-story concept, then choose whether the hero should remain animated. The dedicated film and gallery can stand on their own.

## Preview and publication

Serve the repository with a static web server and open `/demo.html`. `/demo-original.html` is the comparison page. Both use the existing asset paths. A branch alone does not publish these URLs through GitHub Pages; merging the additive demo files into the configured Pages source would make them available without replacing the homepage.

## Checks

- SHA-256 of the comparison copy matches `index.html`.
- JavaScript syntax checked with Node.
- Browser verified hero autoplay and pause-on-scroll, next/previous gallery controls, category counts, fullscreen opening/navigation/closing and narrow-screen layout.
- New photo media loaded successfully; no browser console errors observed during checks.
- Existing homepage placeholders such as `portfolio-details.html` and the guide's `#` link are inherited and not addressed by this media demo.
