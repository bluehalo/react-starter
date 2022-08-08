# Contributor's Guide

When working on this project, please adhere to the following guidelines and conventions.

## Conventional Commits

To simplify the change log generation process, please follow the [conventional commit](https://www.conventionalcommits.org/) standard. We stick to the standard angular convention. Specifically, we use `fix`, `feat`, `chore`, `docs`, `style`, and `BREAKING CHANGE`, but feel free to use the other types in the angular spec.

## Branching

### Names

Branches should always include a ticket number. If the branch is not corresponding to a ticket, please create a ticket so that work can be tracked. You can use any pre/post fix you like so all of the following are ok:

-   `feat/ISS-01`
-   `hotfix/ISS-02`
-   `ISS-03`
-   `ISS-04-ui-hotifx`

### Workflow

Typically we create one branch per ticket. But depending on the ticket, you may
need to branch off of `develop` or some other branch. For example, if your ticket is a subtask of a larger epic/strory, then there should be a branch for that epic/story and you should branch of that and not `develop`. If one does not exist yet, go ahead and create a branch for the epic/story, and then another for your subtask.

### `develop` vs `main`

We have two branches that should never be deleted. `develop` is our active development branch while `main` is our current release branch. All pull requests should be based on `develop`. When it comes time to cut a release, we will submit a PR from `develop` to `main` and verify all the changes are ready to be released. When code is merged to `develop`, it should be as close to production ready as possible and deployed to staging for testing.

## Pull Requests

Before submitting a pull request, verify the following:

-   All javascript code has been formatted with prettier (e.g. `yarn prettier`).
-   All terraform code has been formatted with `terraform fmt`.
-   Any new code adds unit tests and updates to old code updates relevant tests.
-   All tests/linting passes.
-   Any acceptance criteria from a ticket has been met.

> If the pull request template suggests anything else, please follow that as well, it is probably more up to date.

Before merging a PR, make sure the following has been verified:

-   The PR has 2 approvals.
-   All the above requirements for submitting have been met
-   You have pulled down the branch and tested locally
-   If there is a section for verification instructions in the PR template, verify they work.
-   If the code would need any special handling during the next deployment, the submitter has
    including updates to the deployment-notes on what to do.

## Semantic Versioning

This project follows [semantic versioning](https://semver.org/). When you are preparing a release, please update the version appropriately.

## Change Log Generation

In order to generate change logs properly, we must follow a specific workflow.Change logs work based on tags. So when running the command, it will try to grab all valid commits since the beginning of time, or the latest tag. This is why
**CREATING TAGS IS SUPER IMPORTANT**. Please follow this workflow to ensure change logs can be correctly generated.

1. Branch off of develop using a branch name according to the convention above.
2. After making changes, commit your code using commit messages that follow the
   [conventional commit](https://www.conventionalcommits.org/) standard.
3. Submit your pull request to develop. If you can squash into a single commit,please do to prevent the change logs from getting too large and difficult to read.
   Make sure the squashed commit follows conventional commits convention.
4. When it is time to cut a release, bump the version in your package.json based on [semantic versioning](https://semver.org/).
5. On `develop`, run yarn changelog from the app directory.
6. Use a signed commit(git commit -as -m 'Publish') to commit. You can use `Publish` here as opposed to a conventional commit message because we do not want this commit to show up in future change logs as this is just a deployment commit.
7. Create a PR to `master`. Wait until PR is merged before moving to the next step.
8. Create a tag based on this version. e.g. `git tag -a 1.0.0` and give it a basic non conventional commit message, like `Version 1.0.0`.
9. Push tags once PR is approved.

> DO NOT SKIP STEP 8 UNDER ANY CIRCUMSTANCES. This will lead to invalid change logs unless manually addressed.
