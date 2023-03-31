const db = require('./connection');
const inquirer = require('inquirer');

async function viewAllDepartments() {
    try {
        const departments = 
            await db.query('SELECT * FROM department')
        return departments
    } catch (err) {
        console.log(err)
    }
}
//ADD DEPARTMENT: WORKING JUST DONT FORGET TO SPELL CORRECTLY!
async function addDepartment() {
    try {
        const departments = await viewAllDepartments();
        const {
            name,
        } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What department would you like to add?'
            }
        ])
        await db.query(`INSERT into department (name) VALUES ("${name}")`)
        const newDepartment = await viewAllDepartments();
        
        return newDepartment
    }catch (err) {
        console.log(err)
    }
}
//BONUS: DELETE DEPARTMENT


//Export this as an object that can be used 
module.exports = { viewAllDepartments, addDepartment }