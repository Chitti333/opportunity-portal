# easy announcements sharing website and student response collection.
# Main features:
- opportunity reminder (faculty post opportunities student can view and apply them).
- seamless response collection for faculty and each student analysis.
- Inactive will automatically moved from opportunities to inactive.

## pages 
- login page.(role based)
- ### student 
    - view opportunites posted recently(filters). - home
    - profile
- ### faculty
    - post opportunity(future integration - notification through mail).
    - view opportunities (edit or delete).
    - view responses.(download responses in xlsx,csv,pdf). - dashboard.

## Data bases.
- # student
    - Reg No                               -    Text (Max 10)
    - Password                             -    6(text - unicode)
    - email(clg mail and personal mail).   -    Text (100 characters)
    - Phone No                             -    10
    - Branch and Section                   -    Text
    - Year of graduation.                  -    Int(4 digit)
-  # Faculty
    - Reg No                               -    Text (Max 10)
    - Password                             -    6(text - unicode)
    - email(clg mail and personal mail).   -    Text (100 characters)
    - Phone No                             -    10
- # Opportunities
    - Company Name                         -    Text
    - Job Title                            -    Text
    - Application link                     -    Text
    - Job description                      -    Text
    - Eligible Graduation years            -    Text(comma separated values(each of int(4)))
    - Additional Information               -    Text
    - Due Date                             -    Date
    - Registered Students                  -    List
    - Not registered Students              -    List
    - Ignored                              -    List



# Tech stack
Layer     |  Technology    |  Role in Project                                   
----------+----------------+----------------------------------------------------
Frontend  |  React.js      |  Interactive UI, dashboards, authentication        
Backend   |  Django        |  API logic, authentication, email OTP, data export 
Database  |  MongoDB       |  Flexible storage, student/faculty/opportunity data
Styling   |  Tailwind CSS  |  Responsive, modern design                         



