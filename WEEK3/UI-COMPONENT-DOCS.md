# UI Component Docs
---
Following components have been created to replicate the source image in our project.

## **Layout & ClientLayout**
### Purpose
Page-level wrapper containing Navbar, Sidebar, and main content area.
### Parameters
* **children** — page content.
---

## **Navbar**
### Purpose
Top navigation bar containing the menu toggle, search bar, and user menu.
### Parameters
    onToggleSidebar — function to open/close the sidebar.
---

## **Sidebar**
### Purpose
Left navigation panel containing links and navigation groups.
---

## **Card**
### Purpose
Reusable card container for displaying dashboard widgets, charts, stats, etc.
### Parameters
    title — text placed in the header area.
    icon — optional icon displayed next to the title.
    classProp — extra styling classes for theme variations.
    children — content rendered inside the card.
---

## **Button**
### Purpose
Custom Button component to use in different components
### Parameters
    variant - specific styling for cards
    children - content rendered inside the button
    props - for funtion arguments that can be passed.

## **Search**
### Purpose
Search input inside the navbar.

## **Table**
### Purpose
Generic table renderer for list views, datasets, and dashboard tables.
### Parameters
    columns — array of column names/keys.
    data — array of objects representing the rows.
---

