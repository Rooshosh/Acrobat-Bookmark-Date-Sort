Two alternatives; Can use system path or user path.
Have to use user-path if you don’t have admin privileges.

# On my Mac: (System path)
Put datesort.js at this path ( Create folders if necesarry )
/Applications/Adobe Acrobat DC/Adobe Acrobat.app/Contents/Resources/JavaScripts/

Restart Adobe Acrobat, verify by finding the menu item “Sort Bookmarks by Date” under the Edit-menu

# On Windows without Admin (User path)
Put datesort.js at this path ( Create folders if necesarry )
/C/Users/<user>/AppData/Roaming/Adobe/Acrobat/Privileged/DC/JavaScripts/

Restart Adobe Acrobat, verify by finding the menu item “Sort Bookmarks by Date” under the ____-menu (Didn’t double-check if it’s the edit-menu or something else)

# CMD Command to automatically install the script
- Assumes that cmd is opened in the user profile directory C:\Users\<username>
wget https://raw.githubusercontent.com/Rooshosh/Datesort/main/datesort.js -P AppData\Roaming\Adobe\Acrobat\Privileged\DC\JavaScripts

# Comments
So it probably possible to also use user-path on Mac, and system-path on Windows, but I haven’t tested these.

Here is the forum thread I used in order to find this out:
https://community.adobe.com/t5/acrobat-sdk-discussions/where-to-store-js-files-for-adobe-acrobat-pro-dc/m-p/10820695
