---
title: Release Notes
description: See what's changed as Gradebook evolves!
---
<div class="container content-container">

# Release Notes

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

 - Based on your feedback, we've added a toggle to let you choose between entering points-based grades (18/20) and percentage grades (90%). ([blog post](/blog/toggle-percentages-or-points))

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