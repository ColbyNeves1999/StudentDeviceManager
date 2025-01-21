//Controller Calls

//Model Calls
import crypto from 'crypto';
import fs from 'fs';

//Entity Calls

//Repository Calls

//.env Calls
const SECRETKEY = crypto.createHash('sha256').update(process.env.SECRETKEY).digest();
const ECNRYPTIONMETHOD = process.env.ECNRYPTIONMETHOD;

//Encrypts data that is sent in for the data base
async function dataEncrypt(data: string): Promise<string>{

    let dataToEncrypt = data;

    //Yes this is cheating but just checking to see if a file was given instead of just a string
    if(await dataToEncrypt.includes(".json")){

        dataToEncrypt = await fs.readFileSync(data, 'utf-8');

    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ECNRYPTIONMETHOD, Buffer.from(SECRETKEY), iv);

    let encryptedText = cipher.update(dataToEncrypt);

    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    if(await dataToEncrypt.includes(".json")){

        await fs.writeFileSync(process.env.ENCRYPDATA, iv.toString("hex") + ":" + encryptedText.toString("hex"));
        return iv.toString("hex") + ":" + encryptedText.toString("hex");

    }else{

        return iv.toString("hex") + ":" + encryptedText.toString("hex");

    }

}

//Decrypts that data that has been sent in
async function dataDecrypt(data: string): Promise<string> {

    let dataToDecrypt = data;

    let textParts = dataToDecrypt.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(SECRETKEY),
        iv
    );

    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

export { dataEncrypt, dataDecrypt };