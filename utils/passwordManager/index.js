import becrypt from "bcrypt";
export const encrypt = key => {
    return becrypt.hashSync(key, 9);
}
export const decrypt = (pass, userpass) => {
    const data = becrypt.compareSync(userpass, pass);
    return data;
}