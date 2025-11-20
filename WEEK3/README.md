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