---
title: Protecting Against NoSQL Injection in Express
date: 2022-02-26 00:55:00
thumbnail: mongodb.jpeg
tags:
  - programming
  - security
  - web
---
## What is a NoSQL Injection?
A NoSQL injection is the NoSQL equivalent to the more commonly known SQL injection. If you're not familiar with either of these terms - it is the process of abusing an input that is not correctly validated before being used for database operations.

The impact of an injection will vary depending on what the operation does, but some plausible results are:

- Bypassing authentication (i.e. logging in as a user without knowing their passphrase)
- Executing code on the server (potentially leading to a full compromise of the server)
- Modifying data that the user should not have write access to

### How Injections Come to Exist
A common design pattern amongst Express applications that utilise libraries like Mongoose or the native MongoDB library is to use the body parser middleware to automatically deserialise JSON bodies into objects that are stored in `req.body` and subsequently pass this (or a child prop) as the query filter.

The problem with this, is that it is possible for a malicious user to specify something other than a valid value, and instead add JSON that will be deserialised into a [Query / Projection Operator](https://docs.mongodb.com/manual/reference/operator/query/).

A basic theoretical example of this would be, if the `username` and `pass` props of `req.body` were used as the filter for a request that processes a login attempt, like so:

```javascript
const express = require('express');
const User = require('./UserModel');

const app = express();

app.post('/login', async (req, res)  => {
  const user = await User.find({
    username: req.body.username,
    pass: req.body.pass,
  });

  if (user) {
    res.send('Logged in!');
  } else {
    res.send('Incorrect credentials');
  }
});
```

In this example, a typical request body that would be expected would be something such as :

```json
{
  "username": "robocop",
  "pass": "ocp1"
}
```

If, however, a user was to submit the following request, they could login as `robocop` without knowing the password:

```json
{
  "username": "robocop",
  "pass": {
    "$ne": ""
  }
}
```

By submitting an object with the `$ne` operator, it changes the query to be the SQL equivalent of:

```sql
SELECT * FROM users WHERE username = 'robocop' AND pass <> ''
```

As long as a value exists in the `pass` field, which it should, the attacker would successfully authenticate as `robocop`; not good.

## Protecting an Application
As already mentioned, a NoSQL injection vulnerability is caused by a lack of validation of user input. Libraries like Mongoose, which define strictly typed models, provide some protection by means of type validation.

Despite strongly typed models in libraries like Mongoose, they frequently do not do any type checking against queries (like the one constructed in the previous section). As a result, this leaves us with two options:

1. Validate that props specified by the user match the expected type
2. Check if a prop is an object that contains a reserved operator name (such as `$ne`)

Today, I released a library that I have been working on to help provide a catch-all means of protecting against NoSQL injection attacks. The library can be found on [GitHub](https://github.com/RobTheFiveNine/express-nosql-sanitizer) and [NPM](https://www.npmjs.com/package/express-nosql-sanitizer).

The library provides two operating modes; one which will remove any dangerous looking props (i.e. any prop that starts with `$`) and another which will remove specifically any props that use the operators listed in the [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/) as of 26th February 2022.

To use the middleware library, first start by adding it to your project:

```bash
npm install express-nosql-sanitizer
```

After adding `express-nosql-sanitizer` as a dependency, it can be added to your Express stack by requiring the library and passing the middleware to `use`; like so:

```javascript
const express = require('express');
const User = require('./UserModel');
const nosqlSanitizer = require('express-nosql-sanitizer');

const app = express();
app.use(nosqlSanitizer());

app.post('/login', async (req, res)  => {
  const user = await User.find({
    username: req.body.username,
    pass: req.body.pass,
  });

  if (user) {
    res.send('Logged in!');
  } else {
    res.send('Incorrect credentials');
  }
});
```

By modifying the example with the above changes, the previous attack which would result in the following query being constructed:

```json
{
  "username": "robocop",
  "pass": {
    "$ne": ""
  }
}
```

Would now, instead, create this query criteria:

```json
{
  "username": "robocop",
  "pass": {}
}
```

As a result, protecting the application from having dangerous operators make their way into the query. For advanced usage of the library, check the [GitHub Page](https://github.com/RobTheFiveNine/express-nosql-sanitizer)

Additionally, if the user input was being passed via `req.query`, the props would be cleansed too. It should be noted, however, `req.params` is *not* cleansed - the reason being, it should not be possible to deserialise objects from `req.params` without manually writing the code to do so.

## TLDR
The take away points here are:

- Validate user input as much as possible
- Implement a fallback / catch all, like [express-nosql-sanitizer](https://github.com/RobTheFiveNine/express-nosql-sanitizer) to deal with cases that slip through the net

