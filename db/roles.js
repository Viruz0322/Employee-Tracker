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
        const choices = departments.map((department) => ({
            value: department.id,
            name: department.name,
        }));
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the role you would like to add?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this role?',
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department does this role belong to?',
                choices,
            },
        ]);
        const { title, salary, department_id } = answers;
        await db.query(
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
            [title, salary, department_id]
        );
        const newRoles = await viewAllRoles();
        return newRoles;
    } catch (error) {
        console.error(error);
    }
 }
//BONUS: DELETE ROLE
async function deleteRole() {
    try {
        const roles = await viewAllRoles();
        const choices = roles.map((role) => ({
            value: role.id,
            name: role.title,
        }));
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Which role would you like to delete?',
                choices,
            },
            {
                type: 'confirm',
                name: 'confirmDelete',
                message: 'Are you sure you want to delete this role?',
                default: false,
            },
        ]);
        if (!answers.confirmDelete) {
            console.log('Role was not deleted.');
            return;
        }
        const { roleId } = answers;
        await db.query('DELETE FROM role WHERE id =?', [roleId]);
        console.log('Role was deleted successfully.');
        const newRoles = await viewAllRoles();
        return newRoles;
    } catch (error) {
        console.error(error);
    }
}

//Export this as an object that can be used 
module.exports = { viewAllRoles, addRole, deleteRole }