# Noisy

The code that noisy.live's Discord bot is based off of. Let us know if you'd like to view the code for the website, backend or Musenet Generator.

![Noisy Webpage](https://i.ibb.co/mvp2BF3/pog.png)

## Feature Requests and Bug Reports
If you have any suggestions, we'd love to [hear your feedback](https://github.com/JonathanXu1/noisy-bot/issues/new/choose) and improve the bot to maximise happiness! Note: we're using Github issues, so you may need to create a Github account first before being able to fill feature requests and bug reports.

## How It Works

We generate new songs of a given genre by querying Musenet with the appropriate parameters. For each genre we store a list of available songs, and when the song currently being played is near the end of that list we query Musenet for new songs to add to the list. New songs are generated with beginnings identical to the endings of the most recent song in the given genre, so that we create relatively continuous sequences of songs which eventually diverge far from their starting points.

## Contributors

We built this bot! Hope you like it :D

If you have any questions or concerns about the bot (security, privacy, features) that need to be addressed privately, you can directly message any one of us at the contacts listed on our profiles.

[Jonathan Xu](https://github.com/JonathanXu1)
[Ricky Mao](https://github.com/rickrm)
[Vincent Huang](https://github.com/vincenthuang75025)
[Aaron Abraham](https://github.com/aaronabraham311)

## Special thanks
Dmitri Brereton  
Chris Axon

<!-- ## Local development

When running locally, make sure that the Heroku instance (production) is not running:

```
heroku ps:scale worker=0 -a noisy-bot
```

Now you can run the bot locally. To do so, you need to get the `.env` file from one of the project contributors. After, you can run the bot locally and it will be live on localhost:3002. The env file contains the bot token for Noisy-test. The token for production Noisy is on Heroku, and it is used by builds to Github master branch.

```
yarn
heroku local
```

Remember to bring the Heroku worker instance back up after local development:

```
heroku ps:scale worker=1 -a noisy-bot
``` -->
