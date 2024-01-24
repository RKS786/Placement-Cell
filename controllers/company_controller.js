const Student = require('../models/student_db');
const Company = require('../models/company_db');

// Controller function to render company page
module.exports.companyPage = async function (req, res) {
  try {
    // Fetch all students from the database
    const students = await Student.find({});
    // Render the 'company' view and pass the students data
    return res.render('company', { students });

  } catch (error) {
    // Handle errors if any and redirect back to the previous page
    console.log(`Error in rendering company page: ${error}`);
    return res.redirect('back');
  }
};


//Controller function to Allocate interview
module.exports.allocateInterview = async function (req, res) {
  try {
    // Fetch all students from the database
    const students = await Student.find({});
    
    // Create an array of unique batches from the students
    let array = [];
    for (let student of students) {
      array.push(student.batch);
    }
    array = [...new Set(array)];

    // Render the 'allocate_interview' view, passing students and batches data
    return res.render('allocate_interview', { students, array });
  } catch (error) {
    // Handle errors if any and redirect back to the previous page
    console.log(`Error in allocating interview: ${error}`);
    return res.redirect('back');
  }
};


//Controller function to schedule interview
module.exports.scheduleInterview = async function (req, res) {
  const { id, company, date } = req.body;
  try {
    // Find an existing company with the provided name
    const existingCompany = await Company.findOne({ name: company });
    
    // Create an interview object
    const obj = {
      student: id,
      date,
      result: 'Pending',
    };

    // If the company doesn't exist, create a new company
    if (!existingCompany) {
      const newCompany = await Company.create({ name: company });
      newCompany.students.push(obj);
      newCompany.save();
    } else {
      // Check if the student's interview is already scheduled for the company
      for (let student of existingCompany.students) {
        if (student.student._id === id) {
          console.log('Interview with this student already scheduled');
          return res.redirect('back');
        }
      }
      existingCompany.students.push(obj);
      existingCompany.save();
    }

    // Update the student's interviews in the database
    const student = await Student.findById(id);
    if (student) {
      const interview = {
        company,
        date,
        result: 'Pending',
      };
      student.interviews.push(interview);
      student.save();
    }

    console.log('Interview Scheduled Successfully');
    // Redirect to the '/company/home' page
    return res.redirect('/company/home');
  } catch (error) {
    // Handle errors if any and redirect back to the previous page
    console.log(`Error in scheduling interview: ${error}`);
    return res.redirect('back');
  }
};

//Controller function to update status of interview
module.exports.updateStatus = async function (req, res) {
  const { id } = req.params;
  const { companyName, companyResult } = req.body;
  try {
    // Find the student by ID
    const student = await Student.findById(id);

    // If the student and interviews exist
    if (student && student.interviews.length > 0) {
      // Iterate through the student's interviews
      for (let company of student.interviews) {
        // If the company name matches, update the result
        if (company.company === companyName) {
          company.result = companyResult;
          student.save();
          break;
        }
      }
    }

    // Find the company by name
    const company = await Company.findOne({ name: companyName });

    // If the company exists
    if (company) {
      // Iterate through the company's students
      for (let std of company.students) {
        // Compare student id and id passed in params, then update the result
        if (std.student.toString() === id) {
          std.result = companyResult;
          company.save();
        }
      }
    }

    console.log('Interview Status Changed Successfully');
    // Redirect back to the previous page
    return res.redirect('back');
  } catch (error) {
    // Handle errors if any and redirect back to the previous page
    console.log(`Error in updating status: ${error}`);
    return res.redirect('back');
  }
};
