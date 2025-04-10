import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LandingPage from './UserPages/LandingPage';
import Signup from './UserPages/SignUpPage';
import ProfileCompletion from './UserPages/ProfileCompletion';
import Login from './UserPages/LoginPage';
import JobSeekerDashboard from './UserPages/JobSeekerDashboard';
import JobListings from './UserPages/JobListings';
import EmployerDashboard from './UserPages/EmployerDashboard';
import EmployerJobs from './EmployerPages/EmployerJobs';
import Applicants from './EmployerPages/Applicants';
import PostJobForm from './EmployerPages/JobPostingForm';
import JobDetails from './UserPages/JobDetailsPage';
import { UserProvider } from './Context/FetchUser';
import { JobsContextProvider } from './Context/EmployerContext1';
import PostMiniTask from './UserPages/MiniTaskForm';
import MiniTaskPage from './UserPages/MiniTasksPage';
import ViewApplications from './UserPages/ViewApplications';
import EditProfile from './UserPages/EditProfile';
import ManageMiniTasks from './UserPages/ManageMiniTaskPage';
import EditJob from './EmployerPages/EditJob';
import ApplicantProfile from './EmployerPages/ApplicantProfile';
import EmployerProfile from './EmployerPages/EmployerProfile';

function App() {
  return (
  <Router>
    <Routes>

      <Route path='/' element={<LandingPage/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/complete_profile' element = {<ProfileCompletion/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/h1/dashboard' element={<UserProvider><JobSeekerDashboard/></UserProvider>}/>
      <Route path='/job/listings' element={<UserProvider><JobListings/></UserProvider>}/>
      <Route path='/job/details/:id' element={<UserProvider><JobDetails/></UserProvider>}/>
      <Route path='/post/mini_task' element={<PostMiniTask/>}/>
      <Route path='/manage/mini_tasks' element={<ManageMiniTasks/>}/>
      <Route path='/mini_task/listings' element={<MiniTaskPage/>}/>
      <Route path='/view/applied/jobs'element={<UserProvider><ViewApplications/></UserProvider>}/>
      <Route path='/user/modify/profile' element={<UserProvider><EditProfile/></UserProvider>}/>


      <Route path='/employer/dashboard' element={<UserProvider><JobsContextProvider><EmployerDashboard/></JobsContextProvider></UserProvider>}/>
      <Route path='/employer/jobs' element={<JobsContextProvider><EmployerJobs/></JobsContextProvider>}/>
      <Route path='/employer/applicants' element={<Applicants/>}/>
      <Route path='/v1/post_job/form' element={<PostJobForm/>}/>
      <Route path="/employer/edit_job/:Id" element={<EditJob/>}/>
      <Route path='/employer/applicant-profile' element={<ApplicantProfile/>}/>
      <Route path='/employer/profile' element={<UserProvider><EmployerProfile/></UserProvider>}/>


    </Routes>

  </Router>
    
  )
}

export default App;
