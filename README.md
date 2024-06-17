This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!


## My Instructions / What I Did

- create .gitignore and .env files
`touch .gitignore .env`

- add .env to gitignore
edit the file and type `.env` into the file to tell git to ignore .env (avoid
checking it into our repo)

- add MONGODB_URI="connection string" to .env
`echo MONGODB_URI="connection string here" >> .env`

You need to put this for later. We never ever ever wanna put it anywhere in
our git repo because then people can access our database.

- run `npx create-next-app@latest`
    (see https://nextjs.org/docs/getting-started/installation)
this is going to create the skeleton structure for the app.

- I already went through the steps above if you're viewing the complete repo.

- to see the page, continuously run the following commands in the project
folder:
`npm run build`
and
`npm start`

the prompt will show you how to access the site. Typically it's gonna
be at [http://localhost:3000](http://localhost:3000).

- The other option is to use `npm run dev` to run the development server.

- The package.json file is important because it gives a list of various
settings, defauls, scripts, and dependencies of the project.

- If you're gonna deploy to Heroku, make sure the updated package.json file
is checked into the repo. Otherwise you will get build errors.

- src/app/page.js is like the "entry point" for the app, equivalent to
src/App.js in the Cards Lab Demo project.

- The default layout.js file that comes with a skeleton Next.js project
breaks the styling for the Material UI components. You need to delete it
and replace it with the layout file provided near the top of
https://mui.com/material-ui/integrations/nextjs/.
