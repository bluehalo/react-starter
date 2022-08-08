# React Starter

This project is a foundation for building custom applications using React and Node.js.

## Requirements

You will need to have either [Nodejs](https://nodejs.org/en/download/) or [Docker](https://docker.com) installed. If you are working on multiple projects and not using docker, it may be a good idea to install the latest version of Node using [nvm](https://github.com/nvm-sh/nvm).

## Getting Started

Follow the steps below to get the app running on your local machine:

1. Navigate into the app folder.
1. Run `npm i`.
1. Run `npm run dev`.
1. Open your browser to `http://localhost:3000`.

Alternatively, you can run the app in docker which adds a mongo database

1. docker-compose up --build app

## Scripts

| Name      | Description                             |
| --------- | --------------------------------------- |
| dev       | Run in development mode                 |
| test      | Run Jest using defaults                 |
| start     | Run in production mode                  |
| prettier  | Format all JS code in the src directory |
| build     | Generate the static js files for the ui |

## Deployment Container (TODO)

Built in is a container with terraform, terragrunt, and node all installed. The main purpose is so that there is a committed place of what version of each is necessary to deploy the code.

Other highlights of the container include:
1. Persistent bash history preserved in docker volumes
1. Volumes in the host machine's aws and ssh credentials
1. volumes in the entire repo to keep the docker context non-existant

### Running (TODO)

1. Make sure your aws credentials are valid
1. Run `docker-compose build devops && docker-compose run devops`
1. Run `cd devops/terragrunt/s3-example`
1. Run `terragrunt init`
1. Run `terragrunt apply`
1. Wait for the apply to finish
1. Navigate to the url given by terragrunt

## Conventions

Read more on the following topics in our included docs:

-   [State Management](./docs/StateManagement.md)
-   [Contributing](docs/Contributing.md)
-   [Releases](docs/Releases.md)


## Known issues:

- If a module unfound error is thrown, the live restart does not work as it doesn't run npm installs. The process should exit instead