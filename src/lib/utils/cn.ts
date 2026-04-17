type ClassName = string | false | null | undefined;

export const cn = (...classNames: ClassName[]): string =>
    classNames.filter(Boolean).join(' ');
