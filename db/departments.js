const db = require('./connection');
const inquirer = require('inquirer');

const viewAllDepartments = async () => {
    try {
        const departments = await db.query('SELECT * FROM department');
        return departments;
    } catch (error) {
        console.error(error);
    }
};
//ADD DEPARTMENT: WORKING JUST DONT FORGET TO SPELL CORRECTLY!
const addDepartment = async () => {
    try {
        //prompt user to enter the name of the new department
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the new departmnet:'
            },
        ]);

        //insert the new department into the db
        await db.query('INSERT INTO department (name) VALUES (?)', [name])

        console.log(`Successfully added department "${name}"`);
    } catch (error) {
        console.error(error);
    }
};
//BONUS: DELETE DEPARTMENT
async function deleteDepartment() {
    try {
        //get a list of departments
        const departments = await viewAllDepartments();

        //prompt for which department to delete
        const { departmentId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select the department to delete:',
                choices: departments.map((department) => ({
                    name: department.name,
                    value: department.id,
                }))
            },
        ]);

        //Delete a department from the db
        // "?" act as a placeholder for a value that will be passed in at excecution
        await db.query('DELETE FROM department WHERE id = ?', [departmentId]);

        console.log(`Successfully deleted department with ID ${departmentId}.`);
    } catch (error) {
        console.error(error);
    }
}

//Export this as an object that can be used 
module.exports = { viewAllDepartments, addDepartment, deleteDepartment };