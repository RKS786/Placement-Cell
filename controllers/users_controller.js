console.log('user controller loaded');

const User = require('../models/users_db');
const Student = require('../models/student_db');
const Company = require('../models/company_db');

// Controller function to sign in for user
module.exports.signIn = async function(req, res) {
    try {
        console.log("in createStudent controller function");

        // Check whether the user exists or not
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            console.log('User does not exist');
            return res.redirect('back');
        }

        // Validate the password
        if (user.password !== req.body.password) {
            console.log('Password does not match');
            return res.redirect('back');
        }

        // Retrieve all students
        const students = await Student.find({}).exec();
        console.log(students);

        return res.render('user_profile', {
            title: 'User profile',
            user: user,
            students: students
        });
        
    } catch (error) {
        console.error("Error in user sign in:", error);
        return res.redirect('back');
    }
};


// Controller function to get the sign-up data
module.exports.create = async function(req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {

            // req.flash("error", "Password and confirm password does not match");
            return res.redirect('back');
        }

        // Using async/await
        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {

            const newUser = await User.create(req.body);
            console.log("User created successfully:", newUser);
            // req.flash("success","User created successfully");
            return res.redirect('/');

        } else {

            // req.flash("error", "User already exists");
            console.log("User already exist");
            return res.redirect('back');

        }
    } catch (err) {

        console.error("Error in user creation:", err);
        // req.flash("error", "Error in user creation");
            return res.redirect('back');

    }
};


// Controller function to render the sign up page
module.exports.signUp = function(req, res){

  return  res.render('user_sign_up',{
        title:"Placement Cell | Sign Up"
    });
};

//Controller function to add Students
module.exports.addStudent = function(req, res){
    return res.render('add_students');
}

//Controller function to render user's profile page
module.exports.profile = function(req, res){

    return res.render('user_profile', )
}

//Controller function to create Student
module.exports.createStudent = async function (req, res) {
        try {
            console.log("in createStudent controller function");
            const existingStudent = await Student.findOne({ email: req.body.email });
    
            if (existingStudent) {
                console.log('Email already exists');
                return res.redirect('back');
            }
    
            const newStudent = await Student.create({...req.body});
    
            console.log('Student created successfully:', newStudent);
            return res.render('user_profile');

        } catch (error) {
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
		res.render('user_profile');

	} catch (error) {
		console.log('Error in deleting student', error);
		return res.redirect('back');
	}
};
