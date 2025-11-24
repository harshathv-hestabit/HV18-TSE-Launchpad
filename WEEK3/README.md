# Week 3 Advance Frontend
***
# Day 1
## created next js app without recommended settings/config. observing how things could potentially break.
    npx create-next-app@latest app
## Installing tailwind css manually (in app dir):
    npm install -D tailwindcss @tailwindcss/postcss postcss 
## Additionally created a postcss config file and added a tailwind import in /app/globals.css
    /app/postcss.config.mjs
    /app/styles/globals.css
## Compared the above approach with installing tailwindcss through the create-next-app configuration itself. both seemed to provide the same output.
## 
***

# Day 2
## created various component files - 
    Button, Input, Card, Badge, Modal, Sidebar-groups, Charts, Table, Sidebar-group-items, search, user-menu
## usage of each component described in UI-COMPONENTS-DOCS.md

## tried creating components that can take arguments for tailwindcss properties for eg: Card.jsx

## tried to implement a toggle sidebar function but faced some issues initially: -
    in standard layout - the navbar is a child of sidebar component so hiding it was not possible.
    using div for separating for navbar and sidebar. and then applying hidden property made the sidebar invisible but the space did not go away.
    fix for this was implemented by using a different layout component, since the main layout cannot contain the client directive when metadata is present. and created a toggle sidebar function using useState


# Day 3
## implementing routing for the following paths-
    / - which is the landing page
    /dashboard - the dashboard page containing all the content implement from day1 till day2
    /dashboard/profile - the user profile page
    /about - the about page
## as of day 3 task completetion, the said routes render pages that have some placeholder lines to represent the paths
## learnt about the nextjs routing in codevolution crash course where they outlined the routing concept in a clear manner.

## Some modifications:
### Needed to implement on page seo tags (Metadata):
#### Since the pages are static pages, I went along with using the simple static metadata object
#### Metadata objects cannot be added to pages.jsx containing 'use-client' directive. So reworked the following pages to add metadata objects and created components for the same -
- /dashboard/page.jsx and dashboard component
- /login/page.jsx and login-form component
- Replaced standard html img tag with nextjs image component on user-profile component