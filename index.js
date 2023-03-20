const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employee_db',
    },
    console.log(`Connected to the employee_db.`)
  );

  db.connect(()=>{
    startMenu();
  });

  function startMenu() {
    inquirer.prompt([{
        message: 'What would you like to do?',
        name: 'choices',
        type: 'list',
        choices: [ 
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee manager',
          "View employees by manager",
          "View employees by department",
          'Delete a department',
          'Delete a roles',
          'Delete an employee',
          'View department budgets',
          'Exit',
        ],
      }]).then((answers) => {
        const { choices } = answers; 
        if (choices === "View all departments") {
          showDepartments();
        }
        if (choices === "View all roles") {
          showRoles();
         }
         if (choices === "View all employees") {
          showEmployees();
        }
        if (choices === "Add a department") {
          addDepartment();
         }
         if (choices === "Add a role") {
           addRole();
        }
        if (choices === "Add an employee") {
          addEmployee();
         }
        if (choices === "Update an employee manager") {
          updateEmployeeManager();
        }
        if (choices === "View employees by manager") {
            viewEmployeeManager();
          }
        if (choices === "View employees by department") {
           viewEmployeeDepartment();
         }
        if (choices === "Delete a department") {
          deleteDepartment();
        }
         if (choices === "Delete a role") {
           deleteRole();
         }
         if (choices === "Delete an employee") {
          deleteEmployee();
        }
        if (choices === "View department budgets") {
          viewBudget();
        }  
        if (choices === "Exit") {
          db.end()
    };
    }).catch((err) => {console.log(err)});
};

showDepartments = () => {
  console.log('Showing all departments');
  const sql = `SELECT department.id AS id, department.name AS department FROM department`; 

  db.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    startMenu();
  });
  };

  function showRoles() {
    console.log('Showing all roles');

  const sql = `SELECT role.id, role.title, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;
  
  db.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
        startMenu();
      })
    };

    function showEmployees () {
      console.log('Showing all employees'); 
      const sql = `SELECT employee.id, 
                          employee.first_name, 
                          employee.last_name, 
                          role.title, 
                          department.name AS department,
                          role.salary, 
                          CONCAT (manager.first_name, " ", manager.last_name) AS manager
                   FROM employee
                          LEFT JOIN role ON employee.role_id = role.id
                          LEFT JOIN department ON role.department_id = department.id
                          LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    
    db.promise().query(sql, (err, rows) => {
        if (err) throw err; 
        console.table(rows);
            startMenu();
          }
        );
      };

      function addDepartment () {
        inquirer.prompt([
            {
              name: 'department',
              type: 'input',
              message: 'What is the department name?',
            },
          ])
          .then(answer => {
            const sql = `INSERT INTO department (name)
            VALUES (?)`;
            db.promise().query(sql, answer.department, (err, _result) => {
            if (err) throw err;
                console.log('Department added!');
                showDepartments();
                startMenu();
              }
            );
          });
      };
      
      function addRole  () {
        inquirer.prompt([
            {
              name: 'roleTitle',
              type: 'input',
              message: 'What is the role title?',
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary for this role?',
            },
            {
              name: 'deptId',
              type: 'input',
              message: 'What is the department ID number?',
            },
          ])
          .then(answer => {
              const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
              const params = [answer.roleTitle, answer.salary, answer.deptId];
              db.query(sql, params, (err, _result) => {
                if (err) throw err;
                    console.log('Department added!');
                    showRoles();
                    startMenu();
                  });
                  });
                };
      
      function addEmployee () {
        inquirer.prompt([
            {
              name: 'nameFirst',
              type: 'input',
              message: "What is the employee's first name?",
            },
            {
              name: 'nameLast',
              type: 'input',
              message: "What is the employee's last name?",
            },
            {
              name: 'roleId',
              type: 'input',
              message: "What is the employee's role id?",
            },
            {
              name: 'managerId',
              type: 'input',
              message: 'What is the manager Id?',
            },
          ])
          .then(answer => {
            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
              const params = [answer.nameFirst, answer.nameLast, answer.roleId, answer.managerId];
              db.query(sql, params, (err, _result) => {
                if (err) throw err;
                console.log('Employee added!');
                showEmployees();
                startMenu();
                  });
                  });
                };
      
      function updateEmployeeManager () {
        const employeeSql = 'SELECT *  FROM employee';
        db.promise().query(employeeSql, (err, data) => {
          if (err) throw err;
          const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
        })
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeListId',
                    choices: employees,
                    message: 'Please select the employee you want to assign manager to:.'
                }
              ])
              .then(employeeChoice => {
                const employee = employeeChoice.name;
                const params = []; 
                params.push(employee);
                
        const managerSql = 'SELECT *  FROM employee';
        db.promise().query(managerSql, (err, data) => {
          if (err) throw err;
          const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
        })
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'managerId',
                    choices: managers,
                    message: 'Please select the employee you want to make manager.'
                }
            ])
        })
        .then(managerChoice => {
          const manager = managerChoice.manager;
          params.push(manager); 
          
          const employee = params[0]
          params[0] = manager
          params[1] = employee 
  
        const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

        db.query(sql, params, (err, _result) => {
          if (err) throw err;
        console.log("Employee has been updated!");
      
        showEmployees();
        startMenu();
        });
      });
    };

function viewEmployeeDepartment() {
  console.log('Showing employee by departmets');
  const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.name AS department
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id`;
    db.promise().query(sql, (err,rows) =>{
      if (err) throw err;
      console.table(rows);
      startMenu();
    });
  };

function viewEmployeeManager() {
  console.log('Showing employee by managers');
  const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      manager.name AS manager
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN manager ON role.manager_id = manager.id`;
    db.promise().query(sql, (err,rows) =>{
      if (err) throw err;
      console.table(rows);
      startMenu();
    });
  };


    function deleteDepartment() {
      const deptSql = 'SELECT * FROM Department';
      db.promise().query(deptSql, (err, data) =>{
        if (err) throw err; 

    const dept = data.map(({ name, id }) => ({ name: name, value: id }));
      })
          return inquirer.prompt([
                    {
                        type: 'list',
                        name: 'deptId',
                        choices: departments,
                        message: 'Please select the department you want to delete.'
                    }
                ])
            .then(departmentsChoice => {
              const dept = departmentsChoice.deptId;
              const sql = `DELETE FROM department WHERE id = ?`;
      
             db.query(sql, dept, (err, _result) => {
                if (err) throw err;
                console.log('Department Deleted Successfully'); 
      
              showDepartments();
              startMenu();
              });
            });
          };
    
    function deleteRole() {
      const roleSql = `SELECT * FROM role`; 

  db.promise().query(roleSql, (err, data) => {
    if (err) throw err; 

    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    return inquirer.prompt([
      {
          type: 'list',
          name: 'roleId',
          choices: roles,
          message: 'Please select the role you want to delete.'
      }
  ])
      .then(roleIdChoice => {
        const role = roleIdChoice.roleId;
        const sql = `DELETE FROM role WHERE id = ?`;

        db.query(sql, role, (err, _result) => {
            if (err)
              throw err;
            console.log(" Role Successfully deleted!");

            showRoles();
            startMenu();
        });
      });
    });
  };
            
    
    function deleteEmployee() {
      const employeeSql = `SELECT * FROM employee`; 

      db.promise().query(employeeSql, (err, data) => {
        if (err) throw err; 
    
        const employee = data.map(({ title, id }) => ({ name: title, value: id }));
    
        return inquirer.prompt([
          {
              type: 'list',
              name: 'employeeId',
              choices: employees,
              message: 'Please select the role you want to delete.'
          }
      ])
          .then(employeeIdChoice => {
            const employee = employeeIdChoice.employeeId;
            const sql = `DELETE FROM employee WHERE id = ?`;
    
            db.query(sql, employee, (err, _result) => {
                if (err)
                  throw err;
                console.log(" Employee Successfully deleted!");
    
                showEmployees();
                startMenu();
            });
          });
        });
      };

      function viewBudget () {
        console.log('Showing budget by department');
      
        const sql = `SELECT department_id AS id, 
                            department.name AS department,
                            SUM(salary) AS budget
                     FROM  role  
                     JOIN department ON role.department_id = department.id GROUP BY  department_id`;
        
        db.promise().query(sql, (err, rows) => {
          if (err) throw err; 
          console.table(rows);
      
          startMenu(); 
        });            
      };
