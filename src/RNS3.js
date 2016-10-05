/**
 * RNS3
 */

import { Request } from './Request';
import { S3Policy } from './S3Policy';

const EXPECTED_RESPONSE_KEY_VALUE_RE = {
  key: /<Key>(.*)<\/Key>/,
  etag: /<ETag>"?([^"]*)"?<\/ETag>/,
  bucket: /<Bucket>(.*)<\/Bucket>/,
  location: /<Location>(.*)<\/Location>/,
}

const extractResponseValues = (responseText) => {
  return null == responseText ? null : Object.keys(EXPECTED_RESPONSE_KEY_VALUE_RE)
    .reduce((result, key) => {
      let match = responseText.match(EXPECTED_RESPONSE_KEY_VALUE_RE[key]);
      return Object.assign(result, { [key]: match && match[1] });
    }, {});
}

const setBodyAsParsedXML = (response) => {
  return Object.assign(response, { body: { postResponse: extractResponseValues(response.text) } });
}

export class RNS3 {

  static put(file, options) {

    let url = options.endPoint;
    let method = "POST";
    let policy = options.policy;

    return Request.create(url, method, policy)
      .set("file", file)
      .send()
      .then(setBodyAsParsedXML);
  }
}
