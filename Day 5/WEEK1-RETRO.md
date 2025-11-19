# Learnings

## Day 1
### learnt a basic bash commands such as 'which' and revised my bash commands knowledge such as echo and cat
### revised filesystem methods in JS
### got introduced to performance benchmarks. explored console.time(), performance.now(), date.now() to see which would be best fit for checking stream vs buffer

## Day 2
### Tried understanding Node single-threaded nature.
### learnt how promises.all() is different from worker_threads() and how one focuses on CPU parallelism and how one implements concurrency.
### Learnt a new topic - Node CLI tool building. explored 'commander package', program module
### and learnt how to parse arguments entered in cli using process.argv() that return an array which has two default values at index 0 and 1.

## Day 3
### learnt a new concept of git bisect and how to identify a faulty commit through the task
### faced a merge conflict when trying to revert a git commit.
### initially due to my limited understanding of git bisect, I was puzzled at why some commits just disappeared during the git bisect session.
### understood the fact direct revert of a commit would result in a merge conflict, so resolved it by making the change to the bug and then apply git revert.
### in the process, also learnt git reset to clear commit using commit id

## Day 4 
### introduced to two commands- nslookup and traceroute. revised my knowledge on DNS lookup and traceroute
### used postman to interact with request headers and observed response headers
### learnt to write a test script in postman to capture differences between two requests using pm.globals(). An Alternative is pm.environments()
### learnt to create a simple server setup in node js since my previous exposure was to use express to handle routes for request & responses. 
### foundational node function to handle requests and send appropiate responses.

## Day 5
### learnt in detail about eslint and prettier config. The online yt videos contained deprecated content, so I headed over to the documentation to help setup eslint + prettier. 
### eslint is the primary package in my setup and I added prettier as a plugin to eslint. eslint will now use prettier to perform its formatting checks instead of default
### learnt to create bash scripts to perform validate task. this improved my knowledge on using filesystem function in bash scripts
### got introduced to husky and some concepts such as pre commit hook, post commit hook, pre push hook
### understood the difference b/w npm build (legacy) and npm run build (custom user script)
### setting up a cron job created some problems for me. there were some path issues with the build script which needed some correction upon which the task scheduling worked. 
### cron task scheduling was new and i explored how to schedule a task and how to view realtime updates for cron tasks.