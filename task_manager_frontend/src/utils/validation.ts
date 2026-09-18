export const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

export const CAMEROON_CONTACT_PATTERN =
  /^(\+?237)?6((50|51|52|53|54)|(55|56|57|58|590|591|592|593|594|595)|(70|71|72|73|74|75|76|77|78|79)|(80|81|82|83)|(90|91|92|93|94|95|96|97|98|99))\d{6}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

export function isValidCameroonPhone(value: string): boolean {
  return CAMEROON_CONTACT_PATTERN.test(value);
}
