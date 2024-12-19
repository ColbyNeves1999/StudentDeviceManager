import crypto from 'crypto';

//const SECRETKEY = crypto.createHash('sha256').update(process.env.SECRETKEY).digest();
const SECRETKEY = process.env.SECRETKEY;
const ECNRYPTIONMETHOD = process.env.ECNRYPTIONMETHOD;

//Encrypts data that is sent in for the data base
function dataEncrypt(data: string){


    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ECNRYPTIONMETHOD, Buffer.from(SECRETKEY), iv);

    let encryptedText = cipher.update(data);

    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    return iv.toString("hex") + ":" + encryptedText.toString("hex");

}

//Decrypts that data that has been sent in
function dataDecrypt(data: string) {
    let textParts = data.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    console.log("huh?");
    console.log(SECRETKEY);
    console.log(ECNRYPTIONMETHOD);
    /*let decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(SECRETKEY),
        iv
    );

    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();*/
    return "hello";

}

export { dataEncrypt, dataDecrypt };