## Inspiration

The theme of the Mountain Madness 2026 Hackathon is "Dr. Jekyll and Mr. Hyde" — a good doctor by day, and an evil murderer by night. We wanted to build a project that embodied this stark duality. Solaryx takes the inherently noble and positive act of donating to charity (Dr. Jekyll) and contrasts it with the addictive, high-stakes, and often destructive nature of gambling (Mr. Hyde). By combining these two opposing forces, we created a unique platform that gamifies philanthropy, making it both thrilling and impactful.

## What it does

Solaryx is a Solana-based charity donation platform where users pit charitable organizations against one another in head-to-head markets. Participants deposit SOL into their platform wallets and purchase shares to back their chosen charity in "JEKYLL" or "HYDE" themed markets. 

When a market's timer expires, a roulette wheel spins to decide the winner. Crucially, it's winner-takes-all: the selected charity receives the *entire* pool of aggregated shares for that market. A charity's probability of winning is directly proportional to the percentage of the market cap bought in their name. This means even the underdog has a chance to walk away with a massive donation, keeping users on the edge of their seats.

## How we built it

We architected Solaryx to be a robust, full-stack application with seamless blockchain integration:

-   **Frontend**: Built with **SvelteKit** and styled with **Tailwind CSS**. It provides a reactive, real-time user experience, featuring dynamic market share visualizations over time and the thrilling roulette wheel animations to show which share decided the winner.

-   **Backend**: Powered by an **Express.js** REST API. It handles JWT-based authentication, user profile management, session tracking, and the core logic of market lifecycles including interacting with the database.

-   **Database**: Uses **PostgreSQL** schema for users, charities, markets, shares, and on-chain deposits.

-   **Blockchain**: Integrated with the **Solana** blockchain via RPC. Users deposit SOL using quick on-chain transactions. When a market resolves, the backend automatically calculates the winner and dispatches a secure on-chain payout transaction directly to the winning charity's Solana wallet. These transactions are helpfully linked to in the frontend.

-   **Infrastructure**: The application is designed to be served behind an **Nginx** reverse proxy in production.

## Challenges we ran into

Integrating web2 architecture with web3 blockchain interactions posed significant challenges. Ensuring that on-chain Solana deposits were accurately reflected in the user's off-chain balance required careful transaction verification and error handling. 

Additionally, determining the gamification was the most difficult design process. We had to come up with an idea that was simultaneously fun, engaging, and unpredictable, while still being fair as there is money on the line.

## Accomplishments that we're proud of

We are incredibly proud of successfully bridging the gap between a traditional, polished web application and the Solana blockchain. The seamless user flow from signing up with an email, to depositing SOL, to experiencing the thrill of the market resolution without needing an overwhelming web3 interface is a major achievement. We also successfully implemented a robust automated payout system that instantly sends funds to charities on-chain once a market closes.

## What we learned

We gained extensive experience in building reactive frontends with SvelteKit and managing the complex behaviours of Solana throughout our stack. On the web3 side, we deepened our understanding of the Solana RPC API, verifying transaction signatures, managing wallets server-side, and setting up an automated payout pipeline. We also learned how to effectively model probability and randomness in Node.js to keep things fair.

## What's next for Solaryx

We plan to build on Solaryx through tighter UI/UX, and verified recipient charities, possibly through a pipeline which sells Solana for USD, and contributing to the charity through typical fiat means where a Solana recipient address is not available.

## Built With

- **Languages:** JavaScript (Node.js), HTML, CSS, SQL
- **Frontend Stack:** SvelteKit, Svelte, Vite, Tailwind CSS
- **Backend Stack:** Express.js, Node.js
- **Database:** PostgreSQL (with `pgcrypto`)
- **Blockchain / Web3:** Solana, `@solana/web3.js`
- **Cloud & Infrastructure:** AWS SES (Simple Email Service), Nginx
- **Authentication & Security:** JWT (JSON Web Tokens), `bcrypt`