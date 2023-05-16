const mysql = require("mysql2");
const inquirer = require("inquirer");
require('dotenv').config()
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
);
// console.log(`Hello\nthis\nis\na\nnew\nline`)

// connect to the database
db.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database:', error);
      return;
    }
    console.log('Connected to MySQL database.');
    
    // execute queries or other database operations here...
  });

console.log(` ________________________________________________________________________
|                                                                        |
|   ______                                                               |
|  | _____|___  _   _ ___   _ ___     ___   _____ _____   ___  ___   _   |
|  |  __| / _ \\| | | |   \\ | |  _ \\  / _ \\ |_   _|_   _| / _ \\|   \\ | |  |
|  | |   | (_) | |_| | |\\ \\| | |_) |/ /_\\ \\  | |  _| |_ | (_) | |\\ \\| |  |
|  |_|    \\___/|_____|_| \\___|____//_/   \\_\\ |_| |_____| \\___/|_| \\___|  |
|        ____                                                            |
|       |  _ \\  _____ ____  ____ ___ _____  ___  ____ __   __            |
|       | | \\ \\|_   _| __ || ___|  _|_   _|/ _ \\| __ |\\ \\_/ /            |
|       | |_/ / _| |_| ___|| _|_| |_  | | | (_) | ___| \\   /             |
|       |____/ |_____|_|\\_\\|____|___| |_|  \\___/|_|\\_\\  |_|              |
|                                                                        |
|________________________________________________________________________|`);


const init = async () => {
  try {
    const whereToGo = await inquirer.prompt([
      {
        name: "firstPrompt",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Inquire About Department",
          "Add Department",
          "Quit"
        ],
      },
    ]);

    const { firstPrompt } = whereToGo;

    switch (firstPrompt) {
        case "View All Employees":
            viewAllEmployees();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Update Employee Role":
            updateEmployeeRole();
            break;
        case "View All Roles":
            viewAllRoles();
            break;
        case "Add Role":
            addRole();
            break;
        case "View All Departments":
            viewAllDepartments();
            break;
        case "Inquire About Department":
            inquireAboutDepartment();
            break;
        case "Add Department":
            addDepartment();
            break;
        case "Quit":
            console.log('Connection Terminated')
            process.exit();
        }
  } catch (err) {
    console.log(err);
  }
};

const viewAllEmployees = async () => {
  db.query("SELECT e.id, e.first_name, e.last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, m.first_name AS manager_first_name, m.last_name AS manager_last_name FROM employees e JOIN roles ON e.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON e.manager_id = m.id;", function (err, employeeData) {
    if (err) {
        console.log(err)
    } else {
        console.log(`

ID  FORENAME      SURNAME       TITLE                         DEPARTMENT                               SALARY  MANAGER
--  ------------  ------------  ----------------------------  ---------------------------------------  ------  ---------------------`);
        
        // console.log(employeeData);

        employeeData.forEach(({ id, first_name, last_name, title, department, salary, manager_first_name, manager_last_name }) => {
            console.log (`${id.toString().padEnd(2)}  ${first_name.padEnd(12)}  ${last_name.padEnd(12)}  ${title.padEnd(28)}  ${department.padEnd(39)}  ${salary === 0 ? "UNPAID" : salary.toString().padEnd(6)}  ${(manager_first_name === "[REDACTED]" || !manager_first_name) ? "[REDACTED]" : manager_first_name.padEnd(12) + " " + manager_last_name.padEnd(12)}`)
        })
        console.log(`
`)
        init()
    }
  });
};

const addEmployee = async () => {
  try {
    const newHireData = await inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "surname",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role",
        type: "list",
        message: "Which role does the employee have? [INSUFFICIENT CLEARANCE LEVEL DETECTED, MANAGEMENT ROLES OMITTED]",
        choices: [
          "Perimeter Guard",
          "Containment Security",
          "Enforcement Officer",
          "Lawyer",
          "Civil Diplomat",
          "Public Specialist",
          "Historic Revisioner",
          "Scientist",
          "Researcher",
          "T-Class",
        ],
      },
    ]);

    const { firstName, surname, role} = newHireData;
    let managerOption;
    let managerOptions = [];
    let roleID;
    let managerID;

    switch (role) {
        case "Perimeter Guard" : {
            managerOption = 3;
            roleID = 8;
            break;
        }
        case "Containment Security" : {
            managerOption = 3;
            roleID = 9;
            break;
        }
        case "Enforcement Officer" : {
            managerOption = 3;
            roleID = 10;
            break;
        }
        case "Lawyer" : {
            managerOption = 2;
            roleID = 11;
            break;
        }
        case "Civil Diplomat" : {
            managerOption = 2;
            roleID = 12;
            break;
        }
        case "Public Specialist" : {
            managerOption = 2;
            roleID = 13;
            break;
        }
        case "Historic Revisioner" : {
            managerOption = 2;
            roleID = 14;
            break;
        }
        case "Scientist" : {
            managerOption = 1;
            roleID = 15;
            break;
        }
        case "Researcher" : {
            managerOption = 1;
            roleID = 16;
            break;
        }
        case "T-Class" : {
            managerOption = 1;
            roleID = 17;
            break;
        }
    }
    // console.log(managerOption)
    // console.log(roleID)

    switch (managerOption) {
        case 1 : 
        {
            let managerChoices = () => {
                return db.promise().query("SELECT first_name, last_name FROM employees WHERE role_id = 3 OR role_id = 4 OR role_id = 5 OR role_id = 6;")
            };
                const [choices] = await managerChoices();
                const { first_name, last_name } = choices;
                choices.forEach(({first_name, last_name }) => {
                    managerOptions.push(first_name + " " + last_name);
                });
            break;
        }
        case 2 : {
            let managerChoices = () => {
                return db.promise().query("SELECT first_name, last_name FROM employees WHERE role_id = 2;")
            };
                const [choices] = await managerChoices();
                const { first_name, last_name } = choices;
                choices.forEach(({first_name, last_name }) => {
                    managerOptions.push(first_name + " " + last_name);
                });
            break;
        }
        case 3 : {
            let managerChoices = () => {
                return db.promise().query("SELECT first_name, last_name FROM employees WHERE role_id = 7;")
            };
                const [choices] = await managerChoices();
                const { first_name, last_name } = choices;
                choices.forEach(({first_name, last_name }) => {
                    managerOptions.push(first_name + " " + last_name);
                });
            break;
        }
    }

    const continuedNewHireData = await inquirer.prompt([
        {
            name: "manager",
            type: "list",
            message: "Assign to which manager?",
            choices: managerOptions,
        }
    ]);

    const { manager } = continuedNewHireData

    if (roleID >= 15) {
        if (manager === managerOptions[0]) {
            managerID = 3;
        } else if (manager === managerOptions[1]) {
            managerID = 4;
        } else if (manager === managerOptions[2]) {
            managerID = 5;
        } else if (manager === managerOptions[3]) {
            managerID = 6;
            switch (roleID) {
                case 15 : {
                    roleID = 18;
                break;
                }
                case 16 : {
                    roleID = 19;
                break;
                }
                case 17 : {
                    roleID = 20;
                break;
                }
            }
        }
    } else if (roleID >= 8 && roleID <= 10){
        managerID = 7
    } else {
        managerID = 2
    }

    const sql = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);"
    console.log(sql);

    db.query(sql, [firstName, surname, roleID, managerID], function (err) {
        console.log('here');
        if (err) {
            console.log(err);
        } 

        init();
    });

    } catch (err) {
        console.log(err);
    };

}

const updateEmployeeRole = async () => {};

const viewAllRoles = async () => {
  db.query("SELECT roles.id, roles.title, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id", function (err, rolesData) {
    if(err){
        console.log(err)
    } else {
        console.log(`

ID  TITLE                         DEPARTMENT
--  ----------------------------  ---------------------------------------`);

        rolesData.forEach(({ id, title, department }) => {
            console.log(`${id.toString().padEnd(2)}  ${title.padEnd(28)}  ${department.padEnd(39)}`)
        })
        console.log(`
`)
            init()
    }
  });
};

const addRole = async () => {
    try {
        const newRoleData = await inquirer.prompt([
          {
            name: "roleName",
            type: "input",
            message: "What is name of the role?",
          },
          {
            name: "department",
            type: "list",
            message: "Which role does the employee have? [INSUFFICIENT CLEARANCE LEVEL DETECTED, MANAGEMENT ROLES OMITTED]",
            choices: [
              "Perimeter Guard",
              "Containment Security",
              "Enforcement Officer",
              "Lawyer",
              "Civil Diplomat",
              "Public Specialist",
              "Historic Revisioner",
              "Scientist",
              "Researcher",
              "T-Class",
            ],
          },
        ]);
    
        const { firstName, surname, role} = newHireData;
} catch (err) {
    console.log(err);
};}

const viewAllDepartments = async () => {
  db.query("SELECT * FROM departments", function (err, departmentsData) {
    if(err){
        console.log(err)
    } else {
        console.log(`
ID  DEPARTMENT NAME
--  ---------------------------------------`)
        departmentsData.forEach(({ id, name }) => {
            console.log(`${id.toString().padEnd(2)} ${name.padEnd(39)}`);
        })
        console.log(`
`)
        init()
    }
  });
};

const inquireAboutDepartment = async () => {
    try {
        const whereToGoNow = await inquirer.prompt([
          {
            name: "departmentInquiry",
            type: "list",
            message: "What is the Department of interest?",
            choices: [
              "Management",
              "Security",
              "Legal",
              "Light Containment Research and Analysis",
              "Light Containment Testing",
              "Heavy Containment Research and Analysis",
              "Heavy Containment Testing",
              "Return"
            ],
          },
        ]);
    
        const { departmentInquiry } = whereToGoNow;
        const sql2 = "SELECT name, description FROM departments WHERE name = ?;"

        db.query(sql2, [departmentInquiry], function (err, departmentData) {
            if (err) {
                console.log(err)
            } else {
                departmentData.forEach(({ name, description }) => {
                    console.log(`\nDEPARTMENT: ${name}\nDESCRIPTION: ${description}\n`)
                })
                init()
            }})
      } catch (err) {
        console.log(err);
      }
};

const addDepartment = async () => {};

init();
