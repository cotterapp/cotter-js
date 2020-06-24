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

For more information about customization, check out [our documentation](https://docs.cotter.app/sdk-reference/web/web-sdk-verify-email-phone).
