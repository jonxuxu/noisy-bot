# noisy-bot

The code that noisy.live's Discord bot is based off of.

## Local development

When running locally, make sure that the Heroku instance (production) is not running:

```
heroku ps:scale worker=0 -a noisy-bot
```

Now you can run the bot locally. To do so, you need to get the `.env` file from one of the project contributors. After, you can run the bot locally and it will be live on localhost:3002

```
yarn
heroku local
```

Remember to bring the Heroku worker instance back up after local development:

```
heroku ps:scale worker=1 -a noisy-bot
```
