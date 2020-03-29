// 1. Submit the form, only if it is valid
//    email is between 5 and 50 chars long
//    email format is correct
//    name has 0 or 2 whitespaces benween words
//    name length is 1 or more chars
//    phone length is 12 or more digits
//    phone format is correct. Valid formats: "+38032 000 000 00", "+380(32) 000 000 00", "+380(32)-000-000-00", "0380(32) 000 000 00", + any combitaion
//    message is 10 or more characters.
//    message must not iclude bad language: ugly, dumm, stupid, pig, ignorant
// 2. Validate each input on the fly using onchange event
// 3. Define re-usable validators: length, format,  
function validateMe(event) {

  event.preventDefault();
  let valids = validateEmail();
  valids = validateName() && valids;
  valids = validatePhone() && valids;
  valids = validateMessage() && valids;

  return valids === true;

}

function addError(node, error){
  let li = document.createElement('li');
  li.innerText = error;
  node.appendChild(li)
}

function validateEmail(){
  let emailNode = $('#contactForm #email');
  let vals = validateStart(emailNode);
  emailNode = vals[0];
  let emailErrors = vals[1];
  let emailErrorNode = vals[2];

  validateLength(emailNode, 5,  'Email is too short', emailErrors);
  validateLength(emailNode, -50,  'Email is too long', emailErrors);

  validateFormat(emailNode, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Email format is incorrect', emailErrors);

  return validateEnd(emailErrors, emailErrorNode);
}

function validateName(){
  let nameNode = $('#contactForm #name');

  let vals = validateStart(nameNode);
  nameNode = vals[0];
  let nameErrors = vals[1];
  let nameErrorNode = vals[2];

  validateLength(nameNode, 1, 'Name is empty', nameErrors);

  validateFormat(nameNode, /^[a-zA-Z]+(  [a-zA-Z]+)?$/,
          'Name format is incorrect (should contain zero or two whitespaces)', nameErrors);

  return validateEnd(nameErrors, nameErrorNode);
}

function validatePhone(){
  let phoneNode = $('#contactForm #phone');

  let vals = validateStart(phoneNode);
  phoneNode = vals[0];
  let phoneErrors = vals[1];
  let phoneErrorNode = vals[2];

  validateLength(phoneNode, 1, 'Phone is empty', phoneErrors);

  const digitsInPhone = phoneNode.value.replace(/[^0-9]/g,"").length;

  if (digitsInPhone < 12 ) {
    addError(phoneErrors, 'Phone not enough digits');
  }

  validateFormat(phoneNode, /^(\+|0)([0-9]{3})\(?([0-9]{2})\)?[- ]([0-9]{3})[- ]([0-9]{3})[- ]([0-9])+/,
          'Phone format is incorrect', phoneErrors);

  return validateEnd(phoneErrors, phoneErrorNode);
}

function validateMessage(){
  let messageNode = $('#contactForm #message');

  let vals = validateStart(messageNode);
  messageNode = vals[0];
  let messageErrors = vals[1];
  let messageErrorNode = vals[2];

  validateLength(messageNode, 10, 'Message is too short', messageErrors);

  for(const word of ['ugly', 'dumm', 'stupid', 'pig', 'ignorant']) {
    if (messageNode.value.includes(word)) {
      addError(messageErrors, 'Message should not contain the word "'+word+'"');
    }
  }

  return validateEnd(messageErrors, messageErrorNode);
}


function validateLength(node, length, errorText, nodeError) {
  if (length < 0 ){
    if (node.value.length > -length ) {
      addError(nodeError, errorText);
    }
  }
  else if (node.value.length < length ) {
    addError(nodeError, errorText);
  }
}

function validateFormat(node, format, errorText, nodeError) {
  if (!node.value.match(format)) {
    addError(nodeError, errorText);
  }
}


function validateStart(node) {
  if(!node){console.log('Error:Can not find '+ node +' field'); return false;}
  node = node[0];
  const errorNode = node.parentNode.querySelector('p.help-block');
  errorNode.innerHTML = '';

  let errors = document.createElement('ul');
  errors.setAttribute("role", "alert");
  return [node, errors, errorNode]
}

function validateEnd(errors, errorNode) {
  if (errors.childElementCount > 0) {
    errorNode.appendChild(errors);
    return false;
  }
  return true;
}

