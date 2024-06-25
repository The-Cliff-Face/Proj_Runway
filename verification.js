// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// https://stackoverflow.com/questions/16299036/to-check-if-a-string-is-alphanumeric-in-javascript
// only allow alphanumeric usernames
const validateUsername = (username) => {
  return String(username)
    .toLowerCase()
    .match(
      /^([0-9]|[a-z])+$/i
    );
}

module.exports = {
    validateEmail,
    validateUsername
}