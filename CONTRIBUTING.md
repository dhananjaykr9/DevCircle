# Contributing to DevCircle

Welcome to DevCircle! DevCircle is an open-source, community-driven platform built to connect technology professionals locally within their cities.

We believe that the best tech communities are built by the developers themselves. We'd love your help in making this platform better for everyone.

## Core Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Vanilla CSS Modules
- **Database:** Prisma ORM (+ SQLite for local dev, PostgreSQL for production)
- **Authentication:** NextAuth.js (Auth.js Beta)

## How to Contribute

1. **Fork the repository** entirely on GitHub.
2. **Clone your fork** locally: `git clone https://github.com/YOUR-USERNAME/devcircle.git`
3. **Install dependencies:** `npm install`
4. **Set up Local DB:** `npx prisma db push` and then seed `npx prisma db seed`.
5. **Start dev server:** `npm run dev`

### Creating a Pull Request
- Create a new branch: `git checkout -b feature/your-feature-name`
- Make your changes and commit them with clear, descriptive messages.
- Push your branch to your fork.
- Open a Pull Request against the `main` branch of this repository.

## Adding a New City
DevCircle is expanding! To add a new city community:
1. Ensure the city has at least 10 active Tech Professionals willing to join.
2. Open an Issue with the label `new-city`.
3. Discuss with community moderators to get the city verified.

## Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
