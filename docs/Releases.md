# Releases
Use the following checklist as a guide of what to do in preparation for a release. Depending on how you decide to set up your infrastructure, the steps after this checklist may vary. This checklist is specifically for **preparing** the webapp for release.

## Release Checklist
1. Ensure all code you want released is merged into the `develop` branch.
2. While on the `develop` branch:
    * Update the `package.json` version based on [semver](https://semver.org/).
    * Run `yarn changelog` to generate change logs/release notes.
3. Use a signed commit(`git commit -as -m 'Publish'`) and create a pull request to `master`.
4. Once `develop` is merged to `master`, switch to the `master` branch.
5. **Create an annotated tag matching the `package.json` version**:
    * For example, `git tag -a 1.0.0`
    * Include the date (something like `12/25/2020`) in the message.
6. Push your tag.

## Deployment
After completing the release checklist, you are ready to deploy the webapp. You will need to consult the infrastructure documentation for the remaining steps to actually do the deployment. If there are any special considerations for the deployment that are linked to changes elsewhere in the codebase, e.g. migration scripts for database updates or code changes connecting to new infrastructure, make sure to document them according to your projects guidelines.   
