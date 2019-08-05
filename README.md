# Customer Experience Team - Jr. Software Engineer Quiz

Hello there potential teammate!  With this short quiz we hope to get a sense of how you approach problems and devise solutions.  To that end, we're hoping you'll find the following quiz interesting while not demanding a large time investment.

# Instructions

1. Read through the mock ticket below.
2. [Download][zip] or clone the [official repository][repo].
3. Complete the mock ticket.
4. Run `$ bin/pre-submit-clean`
5. Zip up your changes.
6. Send an email with your zip attached to hr@americanfinancing.net letting them know you've completed the quiz.

# Project Setup

1. `$ bundle`
2. `$ rails db:setup`
3. `$ yarn`
4. `$ bin/rs` or `$ foreman start`

## Debugging

[PRY Remote gem][pry-remote] is included for debugging purposes, invoke with
`binding.remote_pry` and follow the directions provided in the server console to
connect.

# Mock Ticket

(Written by our Product Owner for maximum authenticity 😉)

## 📄 \[CE-007\] Jr. Software Engineer Quiz

### Background:

For the sake of argument and certainly with a need to stretch your
imagination, assume that we work for Open Table rather than the largest
privately held, independent, and best mortgage origination company in metro
Denver.

Here at Denver's Open Tables, we've decided to display a very basic website
built in the following stack:

1. Back-end: Ruby on Rails
2. Front-end: HAML (templating)
3. Database: SQLite
4. Javascript: Webpacker/ES6/[StimulusJS][stimulus]

As far as users are concerned, this website has the following features:

1. When the page loads, the database is queried and returns the first 24 restaurants.
2. The restaurant list is paginated.
3. On the first page, the "Prev" link is disabled, naturally.
4. Clicking "Next" advances the user one page forward, pulling the next 24 restaurants from the database.
5. Unfortunately, this website has a bug.  The "Next" button isn't disabled when you reach the end of the restaurant list, and it should be.
6. This website is sorely lacking a feature as well.  It assumes that no new restaurants will ever open, or that existing restaurants may one day close their doors for good.  The original developer was kind enough  to write an OpenTablePuller class to retrieves the restaurant data from the Open Table API, but was shortsighted and wrote no rake task that could be used to refresh the local data.  We'd like to be able to run this rake task as `rails restaurant:pull` to refresh the SQLite database that's powering the front-end paginated list of restaurants.

### Acceptance Criteria:

1. When the end of the restaurant list is reached, the "Next" link is disabled.
2. To refresh the locally stored data, you have created a rake task that leverages the OpenTablePuller class, and this can be executing with the following: `rails restaurant:pull`.
3. Implementing the two items above does not break any existing functionality.

### Additional Notes:

* Browser Support: Current versions of Chrome and Firefox (for simplicity's sake)
* Restaurant database entries are _not_ required to maintain the same primary key between rake executions but no duplication should result

[repo]: https://github.com/americanfinancing/ce_jr_engineer/tree/master
[stimulus]: https://stimulusjs.org
[zip]: https://github.com/americanfinancing/ce_jr_engineer/archive/master.zip
[pry-remote]: https://github.com/Mon-Ouie/pry-remote
