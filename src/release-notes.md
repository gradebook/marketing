---
title: Release Notes
description: See what's changed as Gradebook evolves!
---
<div class="container content-container">

# Release Notes

_Note that we only update our release notes when there is a notable feature or improvement. We often have several smaller releases with bug fixes and improvements that will not be listed until the next time the release notes are updated._ 😊

## 3.28.0

_Released January 9, 2025_

*\*taps mic\** is this thing on? 👋

### Features

- 🦘Added a setting to shift seasons for our friends down under

- 🎨 Redesigned user settings page

- ✨ Embedded course search in the course creator (at select schools)


### Bug Fixes / Notable Changes

- Added "Report an Issue" button to the profile dropdown

- Fixed issues that caused the semester used for GPA calculations to be incorrect

- Supported "more" for y'all

   - Increase the max allowable GPA credit hours

   - add support for decimal GPA credits (at select schools)

   - Increase the max number of courses per semester

   - Increase the max number of grades in a category

- Fixed various crashes

   - When the course creator takes too long to load

   - When creating/updating a category fails in multiple scenarios

   - When creating an incomplete course

   - When deleting a course fails

   - When relaunching the category editor

   - When deleting an assignment in the course creator

   - The app doesn't get stuck on the loading screen

   - When using Safari Private Browsing


- Made minor design enhancements across the app

- Optimized the size of the app

- Improved app stability on flaky networks

   - Added support for trying to re-create a course that was unable to be created

- Fixed "What do I need" sometimes showing on a completed course

- Improved accessibility on the course dashboard

- Surfaced the error message when the app fails to launch


## 3.27.0

_Released January 2, 2022_

### Features

 - Allowed old courses to be edited

   - Semesters that have passed are now considered "archived" instead of "readonly"

### Bug Fixes / Notable Changes

 - Cleaned up various accessibility issues. We strive to make using Gradebook a pleasant experience for everyone.

 - Improved reliability of logging in again

 - Made header sticky

 - Fixed crash when leaving the course dashboard before course data has loaded

 - Improved heuristics around the semester used for GPA calculations

 - Added support for new users to create a course from [Course Search](https://cs.gradebook.app/)

 - Improved networking

   - Fixed request prioritization

   - Updated how what error messages are exposed in the UI

 - Fixed a crash when finishing creating a course that would prevent you from ever finishing it

## 3.26.2

_Released August 16, 2022_

_Even though there aren't notable features or improvements, we've decided to include the changes from 3.26.0 to 3.26.2 due to reliability issues._

### Bug Fixes

1. Importing a course should now be fully functional

 - Loading the import page will not crash

 - Trying to import a course after logging in will not cause a crash

2. Logging in to a different school on Gradebook will take you to your correct school

 - Previously, the app would try to log you in, fail, and ask you to log in again

3. Account creation after trying to import a course will work now

 - Previously, you could get a cryptic error


## 3.26.0

_Released August 14, 2022_

### Features

- Upcoming semesters can now be created much earlier

- The semester used for GPA will always be the oldest of current semesters.

  - During transition periods, such as between the Fall and Winter semester, the older semester will be used for GPA calculations until it is archived.

- Added support for using existing course templates (Course Search). Limited to Texas A&M University

### Bug Fixes / Notable Changes

- Enhanced the precision of most numerical calculations

- Fixed crash when experimenting with a category

- Added support for ✨emojis✨ in assignment names

- Improved stability of network communication and handling of network errors

- Added more indicators to show when portions of the site are loading

- Improved validation of bonus points

- Fixed crash in new user welcome screen

- Increased the maximum credit hours to 9

- Fixed delete course sometimes navigating to the wrong semester

- Improved design of the empty semester dashboard

## 3.25.0

_Released November 23, 2021_

### Features

- Added a new system for us to ask for your feedback

### Bug Fixes / Notable Changes

- Fixed "finish creating course" erroring when a semester is full

- Improve the way plus and minus letter grades look

## 3.24.0

_Released October 31, 2021 🎃_

### Features

- Redesigned progress bars to have a unified experience. The visual changes are minor, but a lot of really small issues have been fixed. And it's a bit faster ⚡

- Updated "new category" design

- Increased max course count

### Bug Fixes / Notable Changes

- Allow selecting destination semester for import

- The number of assignments in a category are now surfaced in the grade table

- Fixed grade mode preferences not being remembered

- Improvements to the Course Creator

  - Removed old course creator

  - Allowed deferring assignment creation

  - Allowed opt-out of course creator for assignment creation

  - Reduced file size and increased performance

  - Fixed several issues relating to cutoffs and saving

- Assignments without a weight are now grade-type neutral

- Fix cutoff mismatch after cancelling course settings change

- Improved messaging around network errors

- Fixed GPA calculation for courses with a A-/B-/C-/D- average (this was reported by a student, thank you!)

- Accessibility improvements

- Fixed GPA out-of-date message being hidden behind title

- Removed some dead code

- Improved rendering of percent sign in grade table due to variable widths

- Tamed overzealous scrollbars on Semester Dashboard

- Updater browser support to only modern browsers

## 3.23.0

_Released July 30, 2021_

### Features

 - Added **bonus points** - we know you've been waiting for this feature, and it's finally here!

 - Completely redesigned the new user tour

 - Improve perceived loading performance on slower networks

 - Enabled GPA Insights across all schools

### Bug Fixes / Notable Changes

 - Fixed crash when assignment creation fails

 - Make the new course creator the default

 - Fixed crash when sharing a course with non-latin characters

 - Improved spacing of experimental mode toggle

 - Fixed inconsistencies when category saving fails

 - Improved responsiveness when making lots of changes to a course

 - Fixed course average sometimes showing slightly (0.1%) lower

 - Streamlined GPA configuration callouts

## 3.22.0

_Released April 20, 2021_

### Features

 - Improved "smartness" of GPA insights and suggestions

 - Added course progress bar to course list in GPA insights

 - Added a warning when course weights / cutoffs conflict

### Bug Fixes / Notable Changes

 - Fixed crash when saving course settings on a slow network

 - Performance improvements

## 3.21.0

_Released April 5, 2021_

### Features

 - Added beta support for collaboration with your advisor (limited to participating organizations)

 - General improvements to user experience in the new course creator

### Bug Fixes / Notable Changes

 - Fixed `delete` button showing up in course settings when experimenting

 - Fixed grades sometimes not being removed when editing a category

 - Removed autocomplete from most input fields

 - Added warning when you are rate-limited

 - Added click-to-refresh support in new version notification

## 3.20.0

_Released February 28, 2021_

### Features

 - 💃 Added a new course creator (in beta)

 - Added support for decimal cutoffs

### Bug Fixes / Notable Changes

 - Fixed lazy-loaded semester causing inaccurate dashboards

 - Fixed various visual spacing issues

 - Fixed app crash when you don't have a first or last name

 - Updated grade delete confirmation to only show for categories with a name and weight

 - Fixed glitches when modifying a course or category

 - Fixed crash when trying to create a category with more than 40 grades

 - Fixed some other crashes

 - Various performance improvements!

## 3.19.0

_Released November 13, 2020_

### Features

 - Added experimental mode (beta) - play with your grades to see how you'll do without saving your changes!

 - Each page in the app now updates the tab name

### Bug Fixes / Notable Changes

 - Separated 0-credit courses in GPA page (this was reported by a student, thank you!)

 - Improved and updated styling and fonts across the app

 - Disallowed importing a course if the course list is full

 - Fixed points / percentages sometimes not respect your wishes

 - Fixed a crash when relaunching an old version app

 - Improved tour steps based on new Grade Editor

 - Improved accessibility for animated sections of the app

 - Fixed course navigation (bottom bar) not updating after changing the course name

 - Redesigned Create Category dialog

 - Fixed course progress and "What do I need" not updating when creating new category

 - Fixed crash when you have a creating a category with a really long name

 - Fixed login flow breaking when popups are disabled

## 3.18

_Released September 7, 2020_

### Features

 - Reworked the login flow to make it easier and faster for you to get logged in or create your account

### Bug Fixes / Notable Changes

 - Creating a category now asks for the number of grades

 - Removed unnecessary prompt when deleting an empty assignment or category

 - Fixed an issue with scrollbars in FireFox

 - GPA progress bar won't show up when your semester has no courses

 - Fixed a crash and timing issues when per-school configurations failed to populate

## 3.17

_Released August 18, 2020_

### Features

 - Add initial support for [per-school configurations](https://github.com/gradebook/school-configuration). This will allow us to release features at a faster speed!

### Bug Fixes / Notable Changes

 - Fix category editor crashing the app some times

 - Fix course creation sometimes not working

## 3.16

_Released August 17, 2020_

### Features

 - Internal updates to support [major updates](https://github.com/gradebook/server/releases/tag/v4.0.0) to our backend

### Bug Fixes / Notable Changes

 - Added an edit button to the Previous Semester GPA section

 - Improved support for mobile devices

 - Removed some dead code from 3.15 to make the app load even faster 🚀

 - Added support for Fall 2020

 - Removed `Add Assignment` and `Add Category` buttons from archived semesters - they were crashing the app

## 3.15

_Released August 9, 2020_

### Features

 - Refreshed GradeTable

### Bug Fixes / Notable Changes

 - Fixed course name not visually updating when it was changed in the settings

 - Fixed a memory leak

 - Fixed some issues with the tour

 - Removed unused icon libraries

 - Internally updated how we store cutoffs so we can support more cutoffs in the future

## 3.14

_Released July 4, 2020 🎇_

### Features

 - Based on your feedback, we've added a toggle to let you choose between entering points-based grades (18/20) and percentage grades (90%). ([blog post](/blog/toggle-percentages-or-points/))

 - The app now goes to sleep after you've been gone for a while

### Bug Fixes / Notable Changes

 - Unified iconography

 - `Your Semesters` page has a new look, and now lists semesters reverse chronologically (newest semester first)

 - Remove empty (no name or weight) categories before sharing a course

 - Internal improvements. This should reduce the number of bugs you see and help us make changes faster!

 </div>

{{#block "head"}}
<style>
	.content-container {
		padding-bottom: 2rem;
	}

	.content-container h3 {
		line-height: 3rem;
		margin-left: 1rem;
	}

	.content-container ul li {
		margin-left: 2rem;
	}
</style>
{{/block}}
