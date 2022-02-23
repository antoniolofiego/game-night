![GitHub-Mark-Dark](https://raw.githubusercontent.com/antoniolofiego/game-night/develop/docs/assets/LogoLight.png#gh-light-mode-only)
![GitHub-Mark-Dark](https://raw.githubusercontent.com/antoniolofiego/game-night/develop/docs/assets/LogoDark.png#gh-dark-mode-only)

A **very** in-development project for board game enthusiasts. An all-encompassing tool to feed your board game addiction.

Planned features:

- [x] Import your board game collection from BoardGameGeek
- [ ] Explore friends' or BGG users collections
- [ ] Organize game nights with your friends
  - [ ] Choose a game night theme by category, Shelf-of-Shame, weight or more
  - [ ] Streamline decisions on who brings what game
  - [ ] Set reminders via email or text message
  - [ ] Organize trades and borrowings among friends

## Technology stack

- Next.js
- Tailwind CSS
- Supabase

## Development

To create your development environment, you need to follow a few steps:

1. Clone this repository.
2. Run `npm install`. There might be a few packages that need to be force installed in order to work with the most recent version of React.
3. Create an account on [Supabase](http://supabase.com)
4. Once loaded, find your Supabase URL, Anon key and Service key. You can find them at an URL that looks like `https://app.supabase.io/project/[PROJECT_URL]/settings/api`.
5. Copy these keys into `MODIFY.env.local` and rename the file to `.env.local`.
6. Go to the SQL editor in Supabase (found at the `/sql` endpoint in your project)
7. Copy the `/supabase/pg_dump.sql` file and run it to generate all the tables, functions and triggers that you need to run the app appropriately.
8. Run `npm run dev` and navigate to `http://localhost:3000/`.
9. You should be able to login and use the app as expected.
