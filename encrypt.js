const bcrypt = require('bcrypt');
const saltRounds = 10;


const encrypt = async (password) => {
    
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
}

const compare = async (password, hash) => {
    const result = await bcrypt.compare(password, hash);;
    return result
}

module.exports = {
    encrypt,
    compare,
}