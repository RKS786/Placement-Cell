console.log('user controller loaded');

const User = require('../models/users_db');
const Student = require('../models/student_db');
const Company = require('../models/company_db');
const fs = require('fs');


// Controller function to create session
module.exports.createSession = async function (req, res) {
    console.log('Session created successfully');

    try {

        req.flash("success","You have Logged In Successfully");

        return res.redirect('/users/profile');
        
    } catch (error) {
        console.error('Error while retrieving students:', error);
        return res.status(500).send('Internal Server Error');
    }
};

// Destroy session
module.exports.destroySession = function(req, res){
    // Using req.logout() with a callback function
    req.logout(function(err) {
        if (err) {
            // Handle the error, e.g., by sending an error response
            return res.status(500).send("Error during logout");
        }
        
       req.flash("success","You have Logged out Successfully");
        // Redirecting the user to the root URL after logout
        return res.redirect('/');
    })
}

// Controller function to render the sign up page
module.exports.signUp = function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

  return  res.render('user_sign_up',{
        title:"Placement Cell | Sign Up"
    });
}



// Controller function to  signout
module.exports.signout = function (req, res) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
	});
	return res.redirect('/');
};


// Controller function to get the sign-up data
module.exports.create = async function(req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {

            req.flash("error", "Password and confirm password does not match");
            console.log("Password and confirm password does not match");
            return res.redirect('back');
        }

        // Using async/await
        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {

            const newUser = await User.create(req.body);
            console.log("User created successfully:", newUser);
            req.flash("success","User created successfully");
            return res.redirect('/');

        } else {

            req.flash("error", "User already exists");
            return res.redirect('back');

        }
    } catch (err) {

        console.error("Error in user creation:", err);
        req.flash("error", "Error in user creation");
            return res.redirect('back');

    }
};


//Controller function to render add Students page
module.exports.addStudent = function(req, res){
    return res.render('add_students');
}

//Controller function to render user's profile page
module.exports.profile = async function(req, res){
    try {
        // Retrieve all students
        const students = await Student.find({}).exec();

        return res.render('user_profile', {
            students: students,
        });

    } catch (error) {
        console.error('Error while retrieving students:', error);
        return res.status(500).send('Internal Server Error');
    }
};

//Controller function to create Student
module.exports.createStudent = async function (req, res) {
        try {
            console.log("in createStudent controller function");
            const existingStudent = await Student.findOne({ email: req.body.email });
    
            if (existingStudent) {
                console.log('Email already exists');
                req.flash("error","Email already exists");
                return res.redirect('back');
            }
    
            const newStudent = await Student.create({...req.body});
    
            req.flash("success","Student created ");

            return res.redirect('/users/profile');

        } catch (error) {
            req.flash("error","Error in creating student");
            console.error('Error in creating student:', error);
            return res.redirect('back');
        }
    };

//Controller function to delete Student
module.exports.deleteStudent = async function (req, res) {
	const { id } = req.params;
	try {
		// find the student using id in params
		const student = await Student.findById(id);

		// find the companies for which interview is scheduled
		// and delete student from company interviews list
		if (student && student.interviews.length > 0) {
			for (let item of student.interviews) {
				const company = await Company.findOne({ name: item.company });
				if (company) {
					for (let i = 0; i < company.students.length; i++) {
						if (company.students[i].student.toString() === id) {
							company.students.splice(i, 1);
							company.save();
							break;
						}
					}
				}
			}
		}
		await Student.findByIdAndDelete(id);

        const students = await Student.find({}).exec();

        req.flash("success","Student deleted ");

        return res.redirect('/users/profile');

	} catch (error) {

        req.flash("error","Error in deleting student");
		console.log('Error in deleting student', error);
		return res.redirect('back');
	}
};


// Controller function to download report
module.exports.downloadCsv = async function (req, res) {
	try {
		const students = await Student.find({});

        // Initialize variables to store CSV data
		let data = '';
		let no = 1;
		let csv = 'S.No, Name, Email, College, Placemnt, Contact Number, Batch, DSA Score, WebDev Score, React Score, Interview, Date, Result';

        // Iterate over each student
		for (let student of students) {
            // Construct CSV row for each student
			data =
				no +
				',' +
				student.name +
				',' +
				student.email +
				',' +
				student.college +
				',' +
				student.placement +
				',' +
				student.contactNumber +
				',' +
				student.batch +
				',' +
				student.dsa +
				',' +
				student.webd +
				',' +
				student.react;

                // If student has interviews scheduled
			if (student.interviews.length > 0) {
				for (let interview of student.interviews) {
                    // Append interview details to CSV row
					data += ',' + interview.company + ',' + interview.date.toString() + ',' + interview.result;
				}
			}
            // Increment serial number
			no++;
            // Append CSV row to CSV content
			csv += '\n' + data;
		}

        // Write CSV data to a file
		const dataFile = fs.writeFile('report/data.csv', csv, function (error, data) {
			if (error) {
				console.log(error);
				return res.redirect('back');
			}
			console.log('Report generated successfully');
            // Download the CSV file
			return res.download('report/data.csv');
		});
	} catch (error) {
		console.log(`Error in downloading file: ${error}`);
		return res.redirect('back');
	}
};
