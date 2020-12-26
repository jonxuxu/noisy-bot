# Noisy Telegram

This code powers Noisy's Telegram bot.

WIP. Mind the dust.

# Development

## Local development

Steps for running the Discord bot locally:

1. Open the noisy-webserver repo, and run the webserver locally as per the README in that repo.
2. Open the noisy-web repo, and run the website locally as per the README in that repo.
3. In the main repo folder, run `yarn`.
4. In `index.js` in this project folder, uncomment the line for `startBot();`. Remember to comment it before pushing.
5. In this project folder, run `nodemon index.js`. Nodemon allows for hot reloading.

## Pushing to production

When you are sure the local version has your updates, and is working, you can push the code to production. We have turned off automatic deploys to Heroku because minor Github pushes will cause the dyno to restart and break instances of the bot that are currently on servers. Steps to deploy to production:

0. Make sure you have recommented the line: `startBot();` in discord/index.js
1. Stage and commit your changes
2. Push to the main branch
3. On the Heroku dashboard, manually deploy the main Github branch. If you do not have access to the Heroku dashboard, contact a developer who does.
