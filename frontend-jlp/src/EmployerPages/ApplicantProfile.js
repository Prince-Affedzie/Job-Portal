import React,{useEffect} from "react";
import { useParams,useLocation,useNavigate } from "react-router-dom";
import "../Styles/ApplicantProfile.css";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";

const ApplicantProfile = () => {
  // OR fetch using useParams + API if accessing via dynamic route
 // If loading dynamically via route
  const location = useLocation()
  const navigate = useNavigate()
  const user = location.state?.user;

  useEffect(() => {
    if (!user) {
      // Redirect if accessed directly without data
      navigate("/employer/applicants");
    }
  }, [user, navigate]);
  console.log(user)

  if (!user) return null;

  return (
    <div>
        <EmployerNavbar/>
    <div className="app-profile-container">
      <div className="app-profile-header">
        <img src={user.profileImage || "/default-user.png"} alt="Profile" />
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
         {/*<a href={`https://your-cdn/${applicant.resume}`} target="_blank" rel="noreferrer">Download Resume</a>*/}
        </div>
      </div>

      <section className="app-profile-section ">
        <h3>Skills</h3>
        <div className="app-profile-skills-list">
          {user.skills && user.skills.map((skill, i) => (
            <span key={i} className="app-profile-skill-tag">{skill}</span>
          ))}
        </div>
      </section>

      <section className="app-profile-section">
        <h3>Education</h3>
        {user.education && user.education.map((edu, i) => (
          <div key={i} className="app-profile-edu-item">
            <strong>{edu.degree}</strong> - {edu.institution}
            <p>{edu.startYear} - {edu.endYear}</p>
          </div>
        ))}
      </section>

      <section className="app-profile-section">
        <h3>Work Experience</h3>
        {user.workExperience.length>0 &&user.workExperience.map((exp, i) => (
          <div key={i} className="app-profile-exp-item ">
            <strong>{exp.jobTitle}</strong> @ {exp.company}
            <p>{exp.description}</p>
            <p>{new Date(exp.startDate).toDateString()} - {new Date(exp.endDate).toDateString()}</p>
          </div>
        ))}
      </section>
    </div>
    </div>
  );
};

export default ApplicantProfile;
