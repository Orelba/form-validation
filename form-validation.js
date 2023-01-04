const form = document.querySelector('form')
const email = document.getElementById('email')
const emailError = document.querySelector('#email + span.error')
const country = document.getElementById('country')
const countryError = document.querySelector('#country + span.error')
const zip = document.getElementById('zip')
const zipError = document.querySelector('#zip + span.error')
const pass = document.getElementById('pass')
const passError = document.querySelector('#pass + span.error')
const passConfirm = document.getElementById('passconfirm')
const passConfirmError = document.querySelector('#passconfirm + span.error')

email.addEventListener('input', checkEmail)
country.addEventListener('change', checkCountry)
zip.addEventListener('input', checkZip)
pass.addEventListener('input', checkPass)
passConfirm.addEventListener('input', checkPassConfirmation)
form.addEventListener('submit', checkForm)

function checkEmail() {
  if (email.validity.valid) {
    emailError.textContent = ''
    email.classList.remove('invalid')
  } else {
    showEmailError()
  }
}

function checkCountry() {
  if (country.value !== 'none') {
    countryError.textContent = ''
    country.classList.remove('invalid')
    if (zip.value) checkZip()
  }
}

function validateZipcodeByCountry() {
  if (country.value !== 'none') {
    const constraints = {
      Israel: [
        '^\\b\\d{5}(\\d{2})?$',
        'This is not a valid zip code for Israel.'
      ],
      USA: [
        '^\\b\\d{5}\\b(?:[- ]{1}\\d{4})?$',
        'This is not a valid zip code for the United States.'
      ],
      England: [
        '^[A-Z]{1,2}[0-9R][0-9A-Z]?\\s*[0-9][A-Z-[CIKMOV]]{2}',
        'This is not a valid zip code for England.'
      ],
      Mexico: [
        '^\\d{5}$',
        'This is not a valid zip code for Mexico.'
      ],
      Colombia: [
        '^\\d{6}$',
        'This is not a valid zip code for Colombia.'
      ]
    }
    const constraint = new RegExp(constraints[country.value][0], '')

    if (constraint.test(zip.value)) {
      return 'valid'
    } else {
      return constraints[country.value][1]
    }
  }
}

function checkZip() {
  const validation = validateZipcodeByCountry()

  if (validation === 'valid') {
    zip.setCustomValidity('')
    zipError.textContent = ''
    zip.classList.remove('invalid')
  } else {
    showZipError(validation)
  }
}

function checkPass() {
  if (pass.validity.valid) {
    passError.textContent = ''
    pass.classList.remove('invalid')
  } else {
    showPassError()
  }
  // Check passConfirm on pass input (for cases where the password confirmation was typed before the actual password)
  if (passConfirm.value !== '' && pass.value !== passConfirm.value || passConfirm.validity.tooShort) {
    showPassConfirmError()
  } else {
    passConfirmError.textContent = ''
    passConfirm.classList.remove('invalid')
  }
}

function checkPassConfirmation() {
  if ((passConfirm.validity.valid && pass.value === passConfirm.value) || pass.value === '') {
    passConfirmError.textContent = ''
    passConfirm.classList.remove('invalid')
  } else if (pass.value !== '') {
    showPassConfirmError()
  }
}

function checkForm(e) {
  const formFields = {
    email: [email, showEmailError],
    country: [country, showCountryError],
    zip: [zip, showZipError],
    pass: [pass, showPassError],
    passConfirm: [passConfirm, showPassConfirmError]
  }
  let isValid = true

  Object.values(formFields).forEach((val) => {
    if (!val[0].validity.valid) {
      // Show corresponding error message
      val[1]()
      // Prevent form from submitting
      e.preventDefault()
      isValid = false
    }
    // 'none' is the first empty value on the country select menu
    if (country.value === 'none') {
      showCountryError()
      e.preventDefault()
      isValid = false
    }
    if (pass.value !== passConfirm.value) {
      showPassConfirmError()
      e.preventDefault()
      isValid = false
    }
    if (!zip.validity.valid) {
      e.preventDefault()
      isValid = false
    }
  })

  if (isValid) alert('The form has been successfully sent!')
}

function showEmailError() {
  if (email.validity.valueMissing) {
    emailError.textContent = 'You need to enter an e-mail address.'
  } else if (email.validity.typeMismatch) {
    emailError.textContent = 'Entered value needs to be an e-mail address.'
  } else if (email.validity.tooShort) {
    emailError.textContent = `E-mail should be at least ${email.minLength} characters;
     you entered ${email.value.length}.`
  }

  email.classList.add('invalid')
}

function showCountryError() {
  countryError.textContent = 'You have to choose a country.'
  country.classList.add('invalid')
}

function showZipError(validationMessage) {
  if (validationMessage) {
    zip.setCustomValidity(validationMessage)
    zipError.textContent = validationMessage
    zip.classList.add('invalid')
  } else if (zip.validity.valueMissing) {
    zip.setCustomValidity('You need to enter a zip code')
    zipError.textContent = 'You need to enter a zip code'
    zip.classList.add('invalid')
  }
}

function showPassError() {
  if (pass.validity.valueMissing) {
    passError.textContent = 'You need to enter a password.'
  } else if (pass.validity.tooShort) {
    passError.textContent = `Password should be at least ${pass.minLength} characters; 
    you entered ${pass.value.length}.`
  } else if (pass.value !== passConfirm.value) {
    passConfirmError.textContent = 'Passwords do not match.'
  }

  pass.classList.add('invalid')
}

function showPassConfirmError() {
  if (passConfirm.validity.valueMissing) {
    passConfirmError.textContent = 'You need to enter your password again.'
  } else if (pass.value !== passConfirm.value) {
    passConfirmError.textContent = 'Passwords do not match.'
  } else if (pass.validity.tooShort) {
    passConfirmError.textContent = `Password should be at least ${passConfirm.minLength} characters; 
    you entered ${passConfirm.value.length}.`
  }

  passConfirm.classList.add('invalid')
}