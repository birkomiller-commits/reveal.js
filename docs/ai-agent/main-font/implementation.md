# Primary font: UKIJKUY

The supplied `assets/fonts/UKIJKUY.TTF` is now the primary font for the interactive course, teacher presentation and workshop guide/PDF. Its internal family name is **UKIJ Kufi Yay**; the CSS family alias is **UKIJKUY**. Bahij remains the next fallback, and code/technical identifiers retain their existing monospace stack.

The shared HTML font helper embeds this exact local TTF, so direct file opening remains offline. It honors the uppercase `.TTF` filename on case-sensitive hosting. The raw font remains in assets for source builds; WOFF2 conversion is optional rather than a new build dependency.

The font covers every Arabic-script character used in the lesson data and includes GSUB, GPOS and GDEF shaping tables. Browser inspection confirms that headings, lesson paragraphs, hint titles and text-size controls use actual custom glyphs from UKIJ Kufi Yay. Merely listing a family in CSS was not used as proof of successful rendering.

The 144 enlarged-text layout checks passed, including 200% on 320px screens. The 42-slide companion suite passed at four viewports. The workbook was regenerated, remains 26 pages and was reviewed as page contact sheets plus a full-resolution lesson sample. Desktop/phone screenshots were reviewed for joined letters and clipping. The existing compact sizes and visitor text-size preference are unchanged.

Change the source font list in `scripts/ai_agent_fonts.py` and the reading stacks in `css/ai-agent/learning.css` / `rtl-reading.css` for future font changes, then rebuild both HTML outputs and export the PDF.
