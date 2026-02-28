# Codename Sorbet

## Local Setup

This project requires a local PostgreSQL database named `sorbet`.

### Installing PostgreSQL

**macOS (using [Homebrew](https://brew.sh/)):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu / WSL:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### Creating the `sorbet` Database

Once PostgreSQL is installed and running, you can create the database by running:

```bash
createdb sorbet
```

Or, alternatively, you can enter the PostgreSQL interactive terminal (`psql postgres`) and run:
```sql
CREATE DATABASE sorbet;
```

## Running it locally

Open two terminals, `cd` into `frontend` in one of them, and `backend` in the other.

In both terminals, run `npm ci` to install all dependencies.

### Frontend

For the `frontend` terminal, run:

```npm run dev```

Which will start a development server for the frontend - it will react to your changes.

### Backend

For the `backend` terminal, run:

```node server.js```

When you make changes to the backend, CTRL+C then run the above command again.

## Linting

Be sure to lint your code before committing it. You can do this by running:

```npm run lint```

In both the frontend and backend directories.