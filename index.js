
const { prompt } = require("inquirer");
const { default: Prompt } = require("inquirer/lib/prompts/base");
const { default: ListPrompt } = require("inquirer/lib/prompts/list");
const db = require("./db/connection");

//import our object (functions) to make everything more readable and easier to debug
const { viewAllDepartments, addDepartment, deleteDepartment } = require('./db/departments')
const { viewAllEmployees, addEmployee, updateEmployee } = require('./db/employees')
const { viewAllRoles, addRole } = require('./db/roles')


//added to have co-pilot help
//view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role


//instead of using .then over and over, we use async function
const start = async () => {
    console.log("Welcome to the Employee Manager!");
    //the variable will be updated depending on the choice of the prompt
    const { choice } = await prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Delete a department',
                'Exit'
            ]
        }
    ])

   // console.log(choice)
    //instead of using if else statement, we can use switch Case to break up the code being ran based of of which choice is made
    switch (choice) {
        case 'View all departments': 
        //the viewAllDepartments function returns a promise which needs to be converted to data
            const departments = await viewAllDepartments();
            console.table(departments)
        break;
        case 'View all employees':
            const employees = await viewAllEmployees();
            console.table(employees)
        break;
        case 'View all roles':
            const roles = await viewAllRoles();
            console.table(roles)
        break;
        case 'Add a department':
            const newDepartment = await addDepartment();
            console.table(newDepartment)
        break;
        case 'Add an employee':
            const newEmployee = await addEmployee();
            console.table(newEmployee)
        break;
        case 'Add a role':
            const newRole = await addRole();
            console.table(newRole)
        break;
        case 'Update an employee role':
            const updatedEmployee = await updateEmployee();
            console.table(updatedEmployee)
        break;
        case 'Delete a department':
            const deletedDepartment = await deleteDepartment();
            console.table(deletedDepartment)
        break;
        case 'Exit':
            console.log('Goodbye');
            process.exit();
    }
    start(false)
}

start(true);
 