export function validateLead(data) {
  const errors = [];
  if (!data.full_Name) errors.push('Name is required.');
  if (!data.mobile) errors.push('Mobile number is required.');
  if (!data.category) errors.push('Category is required.');
  return errors;
}
