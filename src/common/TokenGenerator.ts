import { customAlphabet } from "nanoid/async";

const lut = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
const lutSupp = "!@#$%^&*()_+-|\"':;<>,./?`~[]{}";

export const generateDeviceToken = async (): Promise<string> => {
    const generate = customAlphabet(lut, 20);
    return generate();
};

export const generateAuthToken = async (): Promise<string> => {
    const generate = customAlphabet(lut + lutSupp, 10);
    return generate();
};
