const db = require('./connection');
const inquirer = require('inquirer');
const { viewAllRoles} = require('./roles');


const viewAllEmployees = async () => {
    try {
        const employees = await db.query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary, department.name AS departmnet, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;'
        );
        return employees;
    } catch (error) {
        console.error(error);
    }
};
//ADD EMPLOYEE
const addEmployee = async () => {
    try {
        const roles = await viewAllRoles();
        const employees = await viewAllEmployees();

        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the first name of the new employee:'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the last name of the new employee:'
            },
            {
                type: 'list',
                name: 'roleId',
                message: 'Select the role for the new employee:',
                choices: roles.map((role) =>({
                    value:role.id,
                    name: role.title,
                })),
            },
            {
                type: 'list',
                name: 'managerId',
                message: 'Select the manager for the new employee:',
                choices: employees.map((employee) => ({
                    value: employee.id,
                    name: `${employee.first_name} ${employee.last_name}`,
                })),
            },
        ]);

        await db.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [firstName, lastName, roleId, managerId]
        );

        console.log (` Successfully added employee ${firstName} ${lastName}.`)
    } catch (error) {
        console.error(error);
    }
};

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
async function deleteEmployee() {
    try {
        const employee = await viewAllEmployees();
        const choices = employee.map((employee) => ({
            value: employee.id,
            name: `$${employee.first_name} ${employee.last_name}`,
        }));
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Which employee would you like to delete?',
                choices,
            },
            {
                type: 'confirm',
                name: 'confirmDelete',
                message: 'Are you sure you want to delete this employee?',
            },
        ]);
        if (!answers.confirmDelete) {
            console.log('Employee was not deleted,');
            return;
        }
        const { employeeId } = answers;
        await db.query('DELETE FROM employee WHERE id = ?', [employeeId]);
        console.log('Employee was deleted successfully.');
        const newEmployees = await viewAllEmployees();
        return newEmployees;
    } catch (error) {
        console.error(error);
    }
}
//Export this as an object that can be used 
module.exports = { viewAllEmployees, addEmployee, updateEmployee, deleteEmployee };