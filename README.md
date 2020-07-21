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

# Usage

You'll need an `API_KEY_ID`, which you can get by [creating a free account at Cotter](https://dev.cotter.app).

```javascript
import React from "react";
import Cotter from "cotter";

export default function Home() {
  useEffect(() => {
    var cotter = new Cotter(API_KEY_ID); // 👈 You need to add your API KEY ID
    cotter.signInWithLink().showEmailForm()
      .then(payload => {
        // Use the user information to register or login your users
        loginInOrRegisterMyServer(payload); // 👈 You need to define this function
      })
      .catch(err => {
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
  .showEmailForm()
```
**Sending OTP:**
```javascript
cotter
  .signInWithOTP() // use this
  .showEmailForm()
```

### Channels

**Sending to Email**
```javascript
cotter
  .signInWithLink()
  .showEmailForm() // use this
```
**Sending to Phone Number**
```javascript
cotter
  .signInWithLink()
  .showPhoneForm() // use this
```

For more information about customization, check out [our documentation](https://docs.cotter.app/sdk-reference/web/web-sdk-verify-email-phone).

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
      .then(response => {
        setpayload(response); // show the response in our state
      })
      .catch(err => console.log(err));
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
  .showEmailForm()
```
**Fallback to OTP:**
```javascript
cotter
  .signInWithWebAuthnOrOTP() // use this
  .showEmailForm()
```
