interface VerifyRespondResponse {
  authorization_code: string;
  challenge_id: string;
  state: string;
  client_json: any;
}

interface ResponseData extends Response {
  data?: any;
}
