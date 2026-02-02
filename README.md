<h1 style="text-align: center;">Shrink.It</h1>
<p style="font-size:17px">Shrink.It is a URL Shortening web application that converts your big links to short URL.</p>
<a style="font-size:16px" href="https://www.shrinkit.co.in">🔗 Shrink.It</a> 
<p style="font-size:16px">If you don't want to use your credentials to test the app. Use the below credentials to login</p>
<p style="font-size:16px">Email: test@shrinkit.com</p>
<p style="font-size:16px">Password: Testuser@246</p>
<h2>Features</h2>
<p style="font-size:16px">🔗 Short URL: Generates unique Short Urls</p>
<p style="font-size:16px">⚡ Quick Redirects: Cached long urls using Redis</p>
<p style="font-size:16px">📊 Realtime Click Counts: Kafka with Websockets and Redis</p>
<p style="font-size:16px">⛔ Rate Limiting: Prevent spamming of creating so many URLs within a time period.</p>
<p style="font-size:16px">➡️ Url Transfer: Guest Urls will be transferred to user after logging in</p>
<p style="font-size:16px">🔐 Authentication: Users can authenticate using google or using email and password</p>
<p style="font-size:16px">📦 Batch Updates: Cron jobs run every 2 mins to update click counts to DB</p>
<h2>Tech Stack</h2>
<p style="font-size:16px">Fronend: React, React-router, TailwindCss</p>
<p style="font-size:16px">Backend: Node.js, Express.js, MongoDB, Redis, Kafka, Websockets(Socket.Io)</p>
<p style="font-size:16px">Architecture and concepts: MVC Architecture, RESTful API, Rate Limiting, Caching, Event Streaming, Bi-directional communication, DB Transactions and Indexing, API Pagination</p>
<p style="font-size:16px">Deployment: Vercel and Render</p>
<h2>Getting Started</h2>
<p style="font-size:16px">Prerequisites: Node.js, NPM, Nodemon, MongoDb</p>
<p style="font-size:16px">Redis & Kafka: For development I installed both redis and kafk in my computer to run on localhost. For production I have used Upstash Redis and Aiven Kafka</p>

<h2>Clone the Repository</h2>

```
git clone https://github.com/Aadhi25/url-shortener.git
cd url-shortener
```

<h2>Environment Variables for backend</h2>

```

MONGO_CON_STRING=
SECRET=
NODE_ENV=
RESEND_API_KEY=
KAFKA_BROKER=
KAFKA_CA_CERTIFICATE=
KAFKA_ACCESS_KEY=
KAFKA_CERT=
KAFKA_USERNAME=
KAFKA_PASSWORD=
FRONTEND_URL=
BACKEND_URL=
GOOGLE_APP_PASSWORD=
GOOGLE_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
REDIS_URL=

```

<h2>Environment Variables for frontend</h2>

```
VITE_BACKEND_URL=
VITE_FRONTEND_URL=
NODE_ENV=
```

<h2>Install the packages and run the app on localhost</h2>

```
cd server
npm install && npm run dev

cd client
npm install && npm run dev
```

<h2>Testing in backend</h2>

```
.env.test
SECRET=

npm run test
```

<h2>Future Upgrades</h2>
<p style="font-size:16px">🔗 Custom Domains</p>
<p style="font-size:16px">💳 Payment Features</p>
