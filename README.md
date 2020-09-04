# Cotter JS SDK

Cotter's JS SDK for Passwordless Authentication using Email/Phone Number. To read more about Cotter, get started with our 📚 integration guides and example projects.

- [Documentation](https://docs.cotter.app)
- [Quickstart](https://docs.cotter.app/quickstart-guides/web-quickstart-with-js-sdk)
- [SDK Reference](https://docs.cotter.app/sdk-reference/web/web-sdk-verify-email-phone)
- [Tutorial](https://blog.cotter.app/passwordless-login-with-email-and-json-web-token-jwt-authentication-with-nextjs/)

# Install

```shell
yarn add cotter
```

or

```html
<script
  src="https://unpkg.com/cotter@0.3.14/dist/cotter.min.js"
  type="text/javascript"
></script>
```

(Make sure you check the latest version. If you don't want to specify a specific version, check [unpkg](https://unpkg.com/) for a guide on how to specify versions).

# Usage

You'll need an `API_KEY_ID`, which you can get by [creating a free account at Cotter](https://dev.cotter.app).

```javascript
import React from "react";
import Cotter from "cotter";

export default function Home() {
  useEffect(() => {
    var cotter = new Cotter(API_KEY_ID); // 👈 You need to add your API KEY ID
    cotter
      .signInWithLink()
      .showEmailForm()
      .then((payload) => {
        // Use the user information to register or login your users
        loginInOrRegisterMyServer(payload); // 👈 You need to define this function
      })
      .catch((err) => {
        // handle error here
        alert(error);
        console.log("OnError", error.data);
      });
  }, []);

  return (
    // ❗❗ This div needs to have "cotter-form-container" as the ID. ❗❗
    <div id="cotter-form-container" style={{ width: 300, height: 200 }}></div>
  );
}
```

- `ApiKeyID`: Your `API_KEY_ID` from [Cotter](https://www.cotter.app)

### Methods

**Sending Magic Link:**

```javascript
cotter
  .signInWithLink() // use this
  .showEmailForm();
```

**Sending OTP:**

```javascript
cotter
  .signInWithOTP() // use this
  .showEmailForm();
```

### Channels

**Sending to Email**

```javascript
cotter.signInWithLink().showEmailForm(); // use this
```

**Sending to Phone Number**

```javascript
cotter.signInWithLink().showPhoneForm(); // use this
```

For more information about customization, check out [our documentation](https://docs.cotter.app/sdk-reference/web/web-sdk-verify-email-phone).

---

# WebAuthn

Integrating WebAuthn allows your website to authenticate users using TouchID or Windows Hello from their browser.
You'll need an `API_KEY_ID`, which you can get by [creating a free account at Cotter](https://dev.cotter.app).

```javascript
import React, { useEffect, useState } from "react";
import Cotter from "cotter"; //  1️⃣  Import Cotter

function App() {
  const [payload, setpayload] = useState(null);

  //  2️⃣ Initialize and show the form
  useEffect(() => {
    var cotter = new Cotter(API_KEY_ID); // 👈 Specify your API KEY ID here
    cotter
      .signInWithWebAuthnOrLink() // sign in with WebAuthn or fallback to MagicLink
      .showEmailForm()
      .then((response) => {
        setpayload(response); // show the response in our state
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {/*  3️⃣  Put a <div> that will contain the form with id "cotter-form-container" */}
      <div id="cotter-form-container" style={{ width: 300, height: 300 }} />

      <pre>{JSON.stringify(payload, null, 4)}</pre>
    </div>
  );
}

export default App;
```

**Fallback to Magic Link:**

```javascript
cotter
  .signInWithWebAuthnOrLink() // use this
  .showEmailForm();
```

**Fallback to OTP:**

```javascript
cotter
  .signInWithWebAuthnOrOTP() // use this
  .showEmailForm();
```

---

# Social Login

Find the updated documentation here: [Sign in with Social Login](https://docs.cotter.app/sdk-reference/web/sign-in-with-social-login-provider).

To enable this feature, you need to first configure [Sign in with Email/Phone Number](https://docs.cotter.app/sdk-reference/web/web-sdk-verify-email-phone) as the primary login method. You can then add options for the user to sign in using a Social Login Provider.

1. Make sure you are using the JS Package version >= 0.3.16
2. Go to your [Dashboard](https://dev.cotter.app) > Social Login and create a new social login connection. Make sure you enter the credentials given by the social login provider.
3. Follow the instructions for each login provider:
   - [Github Instructions](https://docs.cotter.app/sdk-reference/web/sign-in-with-social-login-provider/github-instructions)
4. Go to your [Dashboard](https://dev.cotter.app) > Branding and check the social login provider you want to show under "Social Login Providers"

## Usage

You don't need to do anything to show the "Sign in with <provider>" button.

## How it works

If a user with signed-in with Github and the Github username is user1 and the Github email is user1@gmail.com:

- If a user with Github username user1 has ever logged-in and already associated with a user (userID: 123), then the user can automatically login.
- If a user with email user1@gmail.com **doesn't exists**: It will create a new user with email user1@gmail.com, and the user can login both with their Github account or with email user1@gmail.com using magic link or OTP.
- If a user with email user1@gmail.com **already exists**: It will ask the user if they want to link account for user1@gmail.com with the Github account. If they aggree, the user can always login both with their Github account or with email user1@gmail.com using magic link or OTP.

## UI Considerations

Logging-in to social providers **requires us to redirect the user to the provider's page to login** when necessary. When the login process is done, the users will be redirected back **to the page where you embeded the form**:

For example:

- Login Page that contains the form: `example.com/login`
  - User login to github: redirect to `github.com/oauth/....`
  - User finish login: redirect back to `example.com/login?code=xyz&state=abc`

As you can see, we pass in a `code` and `state` and other parameters when redirecting back to your login page. **Cotter's Login Form automatically handles this query parameters** for you and will resolve the Promise with the usual Cotter user information response. This means that similar to sign in with email/phone number, you will immediately receive the response inside the `then` callback function that you have.

```javascript
var cotter = new Cotter(API_KEY_ID); // Specify your API KEY ID here
cotter
  .signInWithLink()
  .showEmailForm()
  .then((response) => {
    setpayload(response); // 👈 You'll receive the response here, as usual
  })
  .catch((err) => console.log(err));
```

**With that said, make sure your UI take into account that the user will be redirected away and then back to your login page.**
