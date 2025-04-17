# DevOps AWS

## Group : 
- Fanny Gautier
- Lucas Charoing
- Vincent Germe
- Clément Souplet

# Production link : 
https://dev.d1i2kmxtnql1f8.amplifyapp.com 

---

## Features

- **Vue 3 Frontend**: Built with the latest Vue 3 composition API and TypeScript
- **AWS Amplify Integration**: Serverless backend with authentication, API, and storage
- **Modern UI**: Using Tailwind CSS for responsive design
- **End-to-End Testing**: Playwright for comprehensive testing
- **CI/CD Ready**: Configured for continuous integration and deployment

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [pnpm](https://pnpm.io/) for package management
- AWS account for deploying Amplify resources
- [AWS CLI](https://aws.amazon.com/cli/) and [Amplify CLI](https://docs.amplify.aws/cli/start/install/) for AWS interactions

## Setup and Installation

### Install Dependencies

```sh
pnpm install
```

### Configure AWS Amplify

If you haven't initialized Amplify yet:

```sh
amplify init
```

To pull an existing Amplify environment:

```sh
amplify pull --appId YOUR_APP_ID --envName YOUR_ENV_NAME
```

## Development

### Start Development Server

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Preview Production Build

```sh
pnpm preview
```

## Testing

### Run End-to-End Tests with Playwright

```sh
# Install browsers for the first run
npx playwright install

# Run all tests
pnpm test:e2e

# Run tests on Chromium only
pnpm test:e2e --project=chromium

# Run specific test file
pnpm test:e2e tests/example.spec.ts

# Run tests in debug mode
pnpm test:e2e --debug
```

## AWS Resources

This project uses the following AWS services through Amplify:

- **Authentication**: Amazon Cognito for user management
- **API**: AppSync GraphQL API and/or REST APIs
- **Storage**: S3 for file storage
- **Functions**: Lambda functions for serverless computing

## Project Structure

```
devops-aws/
├── amplify/           # AWS Amplify configuration and resources
├── public/            # Static assets
├── src/               # Application source code
│   ├── assets/        # Images, fonts, etc.
│   ├── components/    # Vue components
│   ├── router/        # Vue Router configuration
│   ├── stores/        # Pinia stores
│   ├── views/         # Page components
│   └── main.ts        # Application entry point
├── e2e/               # End-to-end tests
└── ...                # Configuration files
```

## Deployment

Deploy to AWS Amplify:

```sh
amplify push
```

## License

[MIT](LICENSE)
