# LilReddit

## Credit

This app was built while following [this tutorial](https://www.youtube.com/watch?v=I6ypD7qv3Z8&t=43292s&ab_channel=BenAwad) from [Ben Awad](https://github.com/benawad).

## Built With

- [TypeScript](https://www.typescriptlang.org/)
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/#/)
- [GraphQL](https://graphql.org/)
- [React](https://reactjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [NextJS](https://nextjs.org/)
- [URQL](https://formidable.com/open-source/urql/)
- [Apollo](https://www.apollographql.com/)

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/genadi53/lilreddit.git
   ```
2. Install NPM packages
   ```sh
   npm install
   cd frontend
   npm install
   ```
3. Create your own database and add your connection credentials in `backend/src/index.ts`
   ```JS
   const DB_URL = 'ENTER YOUR DATABASE URL';
   ```
4. Run the app

   ```sh
    cd backend
    npm dev
    // open new terminal tab
    cd frontend
    npm dev

   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
