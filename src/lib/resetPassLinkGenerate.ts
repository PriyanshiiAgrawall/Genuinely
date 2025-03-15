import crypto from "crypto";

export default async function resetPassLinkGenerate() {
    const randomcode = crypto.randomBytes(8).toString("hex");
    const randomCodeExpiryDate = new Date(Date.now() + 30 * 60 * 1000);

    return { randomcode, randomCodeExpiryDate };
}