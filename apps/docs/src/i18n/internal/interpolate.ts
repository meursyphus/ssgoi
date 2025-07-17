export function interpolate(
  template: string,
  variables: { [key: string]: string | number },
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (variables.hasOwnProperty(key)) {
      return String(variables[key]);
    } else {
      return match; // 변수에 해당하는 키가 없을 경우 원래 템플릿을 유지합니다.
    }
  });
}
