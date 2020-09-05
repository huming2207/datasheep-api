import { customAlphabet } from "nanoid";

const lut = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
const lutSupp = "!@#$%^&*()_+-|\"':;<>,./?`~[]{}";

export const generateDeviceToken = (): string => {
    const generate = customAlphabet(lut, 20);
    return generate();
};

export const generateAuthToken = (): string => {
    const generate = customAlphabet(lut + lutSupp, 10);
    return generate();
};
