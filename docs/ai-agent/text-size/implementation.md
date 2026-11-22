# Visitor text-size adjustment

A visible `خەت چوڭلۇقى` button in the top toolbar opens a keyboard-accessible size dialog. Visitors can choose 100%, 125%, 150%, 175% or 200% using A−/A+, the slider or keyboard arrows. A reset returns to 100%; Escape closes the dialog and focus returns to its trigger.

The choice is a device/browser preference saved separately under `agent-lab-text-size-v1`. It persists across reloads and account changes; resetting or importing lesson progress does not replace the visitor's device preference. If local storage is unavailable, sizing still works for the current page and the dialog explains the limitation.

`js/ai-agent-text-size.js` measures the design's original computed font sizes in a batched pass, then applies a shared multiplier to text. It remeasures dynamic lesson/results content, responsive layouts and comfort-mode changes without scaling icons or the entire page. The adjustment dialog stays a stable size. At 100% the original type rules apply directly.

`css/ai-agent/text-size.css` allows expanded labels, navigation, cards and the footer to wrap. On smaller screens, large-text layouts use stacked panels. Code and tables keep their contained scroll areas. The existing chrome ResizeObserver reserves the actual header and footer heights.

The dedicated browser test covers 144 lesson layouts (18 lessons × 2 enlarged sizes × 4 viewports), reload/reset, keyboard operation, dynamic content, unchanged icon dimensions, comfort mode, home/mission content and the sign-in dialog. Existing practice and progress import/export regression checks passed. Phone screenshots were reviewed. This is automated browser and visual verification, not a claim of testing with every device or assistive technology.
