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

### `develop` vs `main` or `master`

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
