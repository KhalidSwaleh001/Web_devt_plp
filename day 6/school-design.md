
School Database Design

 1. Tables and Their Purposes

 Students

The students table stores information about students, including their unique student ID, name, and email address. The student ID is the primary key, while the email address is unique to prevent duplicate student records.

 Courses

The courses table stores the courses offered by the school. It contains a course ID, course name, and unique course code. The course ID is the primary key.

 Enrolments

The enrolments table records which students are registered for which courses and the grades they receive. It contains an enrolment ID, student ID, course ID, and grade. The student ID and course ID are foreign keys referencing the students and courses tables. A UNIQUE constraint on these two foreign keys prevents the same student from enrolling in the same course more than once.

 2. Relationships Between Tables

 One-to-Many Relationships

A student can have many enrolments, but each enrolment belongs to one student. Therefore, students and enrolments have a one-to-many relationship.

Similarly, one course can have many enrolments, but each enrolment refers to one course. Therefore, courses and enrolments also have a one-to-many relationship.

 Many-to-Many Relationship

Students and courses have a many-to-many relationship because one student can take multiple courses, and each course can have multiple students.

The enrolments table acts as a junction table between students and courses. It resolves the many-to-many relationship into two one-to-many relationships. It also stores additional information about each enrolment, such as the student's grade.

 3. Recommended Index

I would add an index on the student_id column in the enrolments table:

sql
CREATE INDEX idx_enrolments_student_id
ON enrolments(student_id);


This index can improve searches that retrieve a student's enrolments and joins that use student_id. It can also help when checking which students have enrolled in particular records. The database already creates indexes for primary keys and UNIQUE constraints, so an additional index should target queries that benefit from it.

 4. SQL or NoSQL?

I would choose a relational SQL database such as SQLite for this school system. Students, courses, enrolments, and grades have clearly defined relationships, making a relational database suitable for organizing the data. Primary keys, foreign keys, and UNIQUE constraints help maintain data integrity and prevent invalid or duplicate enrolments. SQL also provides JOIN, GROUP BY, and other operations needed for reports and queries. A NoSQL database can be useful for flexible or document-oriented data, but a relational database is a better fit for this system's structured data and relationships.