const nameValidator = (name: string): boolean => {
  const regex = new RegExp(/^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/)
  if (name.length === 0 || !regex.test(name)) {
    return false
  }
  return true
}

export const firstNameValidator = (name: string): [boolean, string] => {
  const regex = new RegExp(/^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/)
  if (name.length === 0 || !nameValidator(name)) {
    return [true, 'Wprowadź prawidłowe imię']
  }
  return [false, '']
}

export const lastNameValidator = (name: string): [boolean, string] => {
  const regex = new RegExp(/^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/)
  if (name.length === 0 || !nameValidator(name)) {
    return [true, 'Wprowadź prawidłowe nazwisko']
  }
  return [false, '']
}

export const emailValidator = (email: string): [boolean, string] => {
  const regex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
  if (email.length === 0 || !regex.test(email)) {
    return [true, 'Wprowadź prawidłowy email']
  }
  return [false, '']
}

export const passwordValidator = (password: string): [boolean, string] => {
  if (password.length < 6) {
    return [true, 'Długość hasła powinna wynosić minimum 6 znaków']
  } else if (password.length > 30) {
    return [true, 'Długość hasła powinna wynosić maksymalnie 30 znaków']
  } else if (password.search(/\d/) === -1) {
    return [true, 'Hasło powinno zawierać minimum jedną cyfrę']
  } else if (password.search(/[a-z]/) === -1) {
    return [true, 'Hasło powinno zawierać minimum jedną małą literę']
  } else if (password.search(/[A-Z]/) === -1) {
    return [true, 'Hasło powinno zawierać minimum jedną dużą literę']
  } else if (password.search(/ /) !== -1) {
    return [true, 'Hasło nie może zawierać spacji']
  }
  return [false, '']
}

export const passwordsEqualValidator = (
  password: string,
  confirmPassword: string
): [boolean, string] => {
  if (password !== confirmPassword) {
    return [true, 'Hasła muszą być identyczne']
  }
  return [false, '']
}
