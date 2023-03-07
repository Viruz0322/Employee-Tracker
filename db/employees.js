const db = require('./connection');
const inquirer = require('inquirer');
const { viewAllRoles} = require('./roles');


async function viewAllEmployees() {
    try {
        const employees = 
            await db.promise().query('SELECT * FROM employee LEFT JOIN role ON role.id = employee.role_id')
        return employees[0]
    } catch (err) {
        console.log(err)
    }
}
//ADD EMPLOYEE
async function addEmployee() {
    try {
        const roles = await viewAllRoles();
        const employees = await viewAllEmployees();
        const {
            firstName,
            lastName,
            role,
            manager
        } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is name first name of the employee?',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is last name of the employee?',
            },
            {
                type: 'list',
                name: 'role',
                message: 'What role is the employee?',
                //.map creates a callback function to all roles bringing forth the rquired info
                
                choices: roles.map(role => {
                    return {
                        value: role.id,
                        name: role.title
                    };
                    console.log(role.title);
                }),
            },
            {
                type: 'list',
                name: 'manager',
                choices: [
                    //access the employees and create the callback function
                    ...employees.map((e) => {
                        return {
                            value: e.id,
                            name: `${e.first_name} ${e.last_name}`
                        };
                    })
                ]
            }
        ])
        await db.query(`INSERT into employee(first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", "${role}, "${manager}") `)
        const newEmployees = await viewAllEmployees()
        return newEmployees
    }catch (err) {
        console.log(err)
    }
    }

//UPDATE EMPLOYEE

//BONUS: DELETE EMPLOYEE

//Export this as an object that can be used 
module.exports = { viewAllEmployees, addEmployee }