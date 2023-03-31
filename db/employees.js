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
const addEmployee = async () => {
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
        await db.query(`INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", "${role}", "${manager}") `)
        const newEmployees = await viewAllEmployees()
        return newEmployees
    }catch (err) {
        console.log(err)
    }
    }

//UPDATE EMPLOYEE
    const updateEmployee = async () => {
        try {
            const employees = await db.query(`SELECT * FROM employee`);
            const roles = await db.query(`SELECT * FROM role`);

            const employeeChoices = employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }));
            const roleChoices = roles.map((role) => ({
                name: role.title,
                value: role.id,
            }));

            const { employeeId, roleId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select an employee to update:',
                    choices: employeeChoices,
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Select a new role for the employee:',
                    choices: roleChoices,
                },
            ]);

            await db.query(
                'UPDATE employee SET role_id = ? WHERE id = ?',
                [roleId, employeeId]
            );

            console.log(`Successfully updated employee with ID ${employeeId}.`);
        } catch (error) {
            console.error(error);
        }
    }

//BONUS: DELETE EMPLOYEE

//Export this as an object that can be used 
module.exports = { viewAllEmployees, addEmployee, updateEmployee }