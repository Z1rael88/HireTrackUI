export const validatePassword = (password: string) => {
    const minLength = 8;
    const minLowercase = 1;
    const minUppercase = 1;
    const minNumbers = 1;

    if (password.length < minLength) {
        return `Hasło musi mieć co najmniej ${minLength} znaków`;
    }

    const lowercaseCount = (password.match(/[a-z]/g) || []).length;
    const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;

    if (lowercaseCount < minLowercase) {
        return `Hasło musi zawierać co najmniej ${minLowercase} małą literę`;
    }

    if (uppercaseCount < minUppercase) {
        return `Hasło musi zawierać co najmniej ${minUppercase} wielką literę`;
    }

    if (numberCount < minNumbers) {
        return `Hasło musi zawierać co najmniej ${minNumbers} cyfrę`;
    }
};
