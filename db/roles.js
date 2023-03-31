const db = require('./connection');
const inquirer = require('inquirer');
const { viewAllDepartments } = require('./departments');


async function viewAllRoles() {
    try {
        const roles = 
            await db.query('SELECT * FROM role')
        return roles
        
    } catch (err) {
        console.log(err)
    }
}

//ADD ROLE
 async function addRole() {
    try {
        const departments = await viewAllDepartments();
        const {
            title,
            salary,
            department_id
        } = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the role you would like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: ' What is the salary for this role?'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department does this role belong to?',
                choices: departments.map(departments => {
                    return {
                        value: department_id,
                        name: departments.name,
                    };
                }),
            }
        ])
        await db.query(`INSERT into role (title, salary, department_id) VALUES ('${title}', '${salary}', '${department_id}')`)
        const newRole = await viewAllRoles()
        return newRole
    }catch (err) {
        console.log(err)
    }
 }
//BONUS: DELETE ROLE


//Export this as an object that can be used 
module.exports = { viewAllRoles, addRole }