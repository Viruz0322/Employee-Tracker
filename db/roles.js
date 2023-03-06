const db = require('./connection');

async function viewAllRoles() {
    try {
        const roles = 
            await db.promise().query('SELECT * FROM role')
        return roles[0]
    } catch (err) {
        console.log(err)
    }
}
//ADD ROLE

//BONUS: DELETE ROLE


//Export this as an object that can be used 
module.exports = { viewAllRoles }