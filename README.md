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
import { useEffect } from "react";
import { CotterVerify } from "cotter";

export default function Home() {
  useEffect(() => {
    // Configuration
    var config = {
      ApiKeyID: API_KEY_ID, // 👈 You need to add your API KEY ID
      Type: "EMAIL", // EMAIL or PHONE
      ContainerID: "cotter-container-signup",
      IdentifierField: "email",
      OnSuccess: (payload) => {
        console.log("Cotter User Information", payload);
        // Use the user information to register or login your users
        loginInOrRegisterMyServer(payload); // 👈 You need to define this function
      },
      OnError: (error) => {
        alert(error);
        console.log("OnError", error.data);
      },
    };
    var cotter = new CotterVerify(config);
    cotter.showForm();
  }, []);

  return (
    <div id="cotter-container-signup" style={{ width: 300, height: 200 }}></div>
  );
}
```

- `ApiKeyID`: Your `API_KEY_ID` from [Cotter](https://www.cotter.app)
- `Type`: `EMAIL` or `PHONE`
- `ContainerID`: the `div` id tag that will contain embedded the login form
- `IdentifierField`: the json key for the "identifier" of the user (for the email or phone number). For example, if you put the `IdentifierField` as `"email"`, the paylod will have `{"email": "hello@example.com"}`.
- `OnSuccess`: the function that will receive the user information from Cotter
- `OnError`: the function that will receive any error from Cotter

For more information about customization, check out [our documentation](https://docs.cotter.app/sdk-reference/web/web-sdk-verify-email-phone).
