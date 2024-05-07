// User controlled variables
const menuItemText = "Sort Bookmarks by Date"
const sortedCollectionName = "Sorted by Date"
const newOriginalCollectionName = "Original Bookmarks"
const themeIsDarkMode = false

// Avaliable color properties: black, white, dkGray, gray, ltGray, red, green, blue, cyan, magenta, yellow
const sortedCollectionColor = themeIsDarkMode ? color.green : color.magenta
const hasHierarchyColor = themeIsDarkMode ? color.cyan : color.blue

// Helper functions
const dateMatcher = /[0-9]{4}-[0-9]{2}-[0-9]{2}/

// Returns true or false, and additionally stores the name -> date pair for later use
const hasDate = (bookmark) => bookmark.name.match(dateMatcher) != null

// Returns the date of the bookmark name as a string. I.E. 2022-02-14
const getDateString = (bookmark) => bookmark.name.match(dateMatcher)[0]

// Returns the date of the bookmark as an integer. Useful for comparing dates
const getDateTimeStamp = (bookmark) => Date.parse( getDateString(bookmark) )

// Function to see if a PDF has been loaded first, which is a prerequisite
function isEmpty(obj) {
  for(var key in obj) if(obj.hasOwnProperty(key)) return false;

  return true;
}

function isAlreadySorted() {
  for (bookmark of this.bookmarkRoot.children) if (bookmark.name == sortedCollectionName) return true

  return false
}

// End helper functions



// Create a separator in the Edit menu and add a Sort Bookmarks entry. This loads a few moments after Acrobat does.
app.addMenuItem({cName:"-", cParent:"Edit", cExec:" "}); 
app.addMenuItem({cName:menuItemText, cParent: "Edit", cExec: "mainSortScript()"});



// Main script. Called by clicking on the the menu item
function mainSortScript() {
  if(isEmpty(this.bookmarkRoot)) { app.alert("Error. Please open a PDF first."); return; }
  if( isAlreadySorted() ) { app.alert("Error. Bookmarks have already been sorted."); return; }

  // Move all original bookmarks under a new parent for organization
  var originalBookmarks = this.bookmarkRoot.children
  this.bookmarkRoot.createChild(newOriginalCollectionName, null, 0)
  var newOrgRoot = this.bookmarkRoot.children[0] // Reference to the newly created bookmark for holding the original bookmarks
  newOrgRoot.color = sortedCollectionColor
  for (bm of originalBookmarks) {
    if (newOrgRoot.children == null) newOrgRoot.insertChild(bm)
    else newOrgRoot.insertChild(bm, newOrgRoot.children.length) // Insert at the bottom of the list, to keep the order
  }

  // Get a list of all bookmarks that contain dates in their names. Regardless of their hierarchy placement
  var filteredBookmarks = filterRecursive(this.bookmarkRoot.children)

  // Sort date bookmarks chronologically top to bottom. I.E. (Top) 2017 -> 2018 -> 2019... (Bottom)
  filteredBookmarks.sort( (a, b) => getDateTimeStamp(a) - getDateTimeStamp(b) )

  // Create a new sorted bookmark hierarchy
  var newRoot = createNewTreeFrom(filteredBookmarks)

  // Collapse all date-bookmarks to give the user a better overview
  for (bookmark of newRoot.children) bookmark.open = false

  // Collapse the New Parents as well
  newOrgRoot.open = false
  newRoot.open = false
}



// Returns list of all bookmarks with dates in their names
function filterRecursive(bookmarks) {
  var filteredBookmarks = [];

  for (bookmark of bookmarks) {
    if ( hasDate(bookmark) ) filteredBookmarks.push(bookmark)
    if (bookmark.children != null) filteredBookmarks = filteredBookmarks.concat( filterRecursive(bookmark.children) )
  }

  return filteredBookmarks
}



// Creates a new parent bookmark at the last index of the children, and duplicates the structure into the new parent
function createNewTreeFrom(bookmarks) {
  var parent = this.bookmarkRoot

  var newRootIndex = 0 // Places Sorted bookmarks parent at the top of the bookmarks list
  parent.createChild(sortedCollectionName, null, 0)
  var newRoot = parent.children[newRootIndex] // Reference to the newly created bookmark "Sorted by Date"
  
  createChildren(newRoot, bookmarks)

  newRoot.color = sortedCollectionColor

  return newRoot
}

function createChildren(parent, referenceBookmarks) {
  for (referenceBookmark of referenceBookmarks) {
    // Skip if child of a date bookmark and is a date bookmark itself
    if ( parent.name != sortedCollectionName && hasDate(referenceBookmark) ) continue

    var bookmarkIndicies = getNestedBookmarkIndicies(referenceBookmark, this.bookmarkRoot) // Get absolute path from the bookmark root.
    var originalBookmarkPath = getPathFromIndicies(bookmarkIndicies) // String representation of bookmark path
    var bookmarkAction = originalBookmarkPath + ".execute()" // Pressing the new bookmark runs the action of the original

    parent.createChild(referenceBookmark.name, bookmarkAction, parent.children == null ? 0 : parent.children.length)
    var newBookmark = parent.children[parent.children.length - 1]


    // Rename bookmark, and create additional child to store original
    if (hasDate(referenceBookmark)) {
      newBookmark.name = getDateString(referenceBookmark)
      newBookmark.createChild(referenceBookmark.name, bookmarkAction, 0)

      newBookmark.children[0].color = color.ltGray
    }

    // Recursively create children
    if (referenceBookmark.children != null) {
      createChildren(newBookmark, referenceBookmark.children)
    }

    // Color bookmark if it has a hierarchy underneath it
    if (parent.name == sortedCollectionName && newBookmark.children.length > 1) newBookmark.color = hasHierarchyColor
  }


  function getNestedBookmarkIndicies(targetBookmark, parent) {
    if (parent.name == sortedCollectionName) return null // Ignore the duplicate bookmark tree
  
    var children = parent.children
  
    for (var i=0; i < children.length; i++) {
      var child = children[i]
  
      // If this object is the same as the one we are looking for
      if (Object.is(child, targetBookmark)) return [i]
      else if (child.children != null) {
        var subIndicies = getNestedBookmarkIndicies(targetBookmark, child)
        if (subIndicies != null) return [i].concat(subIndicies)
      }
    }
    
    return null
  }

  
  function getPathFromIndicies(indicies) {
    var path = "this.bookmarkRoot"
  
    for (var j=0; j < indicies.length; j++) {
      var index = indicies[j]
      path += '.children' + '[' + index + ']'
    }
  
    return path
  }
}