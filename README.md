Url Shortening Web Application

If you don't want to use your id to test the app

Use this to login to test the app: email: demo@shrinkit.com password: demouser123

Tech Stack: React, Tailwind Css, Node.js, Express, MongoDB, Redis, Jest and Supertest

Deployed with Vercel and Render.

How the app works:

- Unauthenticated users can create 2 urls. On logging in the urls will be transferred to the user account.

- Users can register and login through email and password or with google sign in.

- When registering with email and password the users have to verify their email.

- If a user is logged in through email and password and later decides to login through google with same email the account can be accessed through from google login next time.

- Rate limiting: After logging in the user can create any number of urls but with a limitation of 10 urls per minute. If the user tries to create more than 10 urls per minute then the user
  will be shown a warning to try again after a minute.

- The users can see how many times a url has been clicked or redirected. The clicks update every 10 seconds with the use of redis in backend.

- The click count is initially stored and updated in redis and every 9 minutes a cron job is run to update the click count in MongoDB. After the DB updates redis count goes to 0.

- Uses pagination in dashboard so that each page has 7 urls.

- Users can copy and delete urls.

- Users can also delete their account.

Future Upgrades

- Working on to include custom domain name.

- User has to pay to access this facility.

- Analytics like from which location most of them has clicked a url from and some useful features.
