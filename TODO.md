# ----- TODO -----

* Clean up helper functions

* Error checks.
  Especially at getPathFromIndicies. Check indicies != null first

* Put checking date and storing date into separate functions

* Implement user variable: New tree at top or bottom
  * and potentially: collapse original bookmarks into new root as well
  - So that it turns into two roots. "original bookmarks" and "sorted by date"

Note: Some todo-items may have gotten lost whn recovering earlier file

* Ignore custom created tree in case of rerun


// Helper: Object.getOwnPropertyNames(obj)

* Auto-Detect from code whether Acrobat is using Light Mode or Dark Mode


Problemer:
- Sjekk på om har kjørt feiler
- Use Case:
  - Legger inn nye dokumenter, og ønsker å regenerere sortering
- Tittel ved siden av dato på sortert visning

* cmd install command will fail if the folder doesn't exist.