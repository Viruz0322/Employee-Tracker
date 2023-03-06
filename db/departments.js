const db = require('./connection');

async function viewAllDepartments() {
    try {
        const departments = 
            await db.promise().query('SELECT * FROM department')
        return departments[0]
    } catch (err) {
        console.log(err)
    }
}
//ADD DEPARTMENT

//BONUS: DELETE DEPARTMENT


//Export this as an object that can be used 
module.exports = { viewAllDepartments }