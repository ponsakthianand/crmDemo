export function validateCustomerData(data) {
  const errors = [];
  if (!data.name) errors.push('Name field is required.');
  if (!data.email) errors.push('Email field is empty.');
  if (!data.phone) errors.push('Mobile field is required.');
  return errors;
}
