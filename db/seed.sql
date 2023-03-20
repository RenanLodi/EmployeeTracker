INSERT INTO department (deparment_name)
VALUES 
('Operations'),
('HR'),
('Sales'),
('Marketing');

INSERT INTO role (title, salary, deparment_id)
VALUES
('Sales Manager', 300000, 1),
('Administrative Assistant', 55000, 1),
('Investment Specialist', 250000, 3),
('HR Manager', 90000, 2),
('Recruitment', 60000, 2),
('Marketing Director', 120000, 4),
('Marketing Consultant', 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Shirley', 'Villeneuve', 1, NULL),
('Jenny', 'Taylor', 2, 1),
('Dennis', 'Kingsley', 3, 1),
('Erika', 'Wilson', 4, NULL),
('Megan', 'Laurier', 4, 4),
('Adam', 'Devigne',6, NULL),
('Carrie', 'North',7, 6);

SELECT * FROM employee_db.department;
SELECT * FROM employee_db.employee;
SELECT * FROM employee_db.role;