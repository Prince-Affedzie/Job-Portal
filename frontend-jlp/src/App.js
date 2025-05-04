import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import RouteProtection from './Utils/checkIfLoggedIn';
import LandingPage from './UserPages/LandingPage';
import Signup from './UserPages/SignUpPage';
import ProfileCompletion from './UserPages/ProfileCompletion';
import Login from './UserPages/LoginPage';
import JobSeekerDashboard from './UserPages/JobSeekerDashboard';
import JobListings from './UserPages/JobListings';
import EmployerDashboard from './EmployerPages/EmployerDashboard';
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
//import ChatModalPage from './UserPages/ChatModalPage';
import FullChatPage from './UserPages/FullChatPage';
import { ChatProvider } from './Context/ChatContext';
import {NotificationProvider} from './Context/NotificationContext'
import PrivateRoutes from './Utils/PrivateRoute';
import NotificationsPage from './UserPages/NotificationPage';
import EmployerNotificationsPage from './EmployerPages/EmployerNotificationPage';
import JobApplicantsPage from './EmployerPages/JobApplicantsPage';
import EmployerOnboarding from './EmployerPages/EmployerOnboarding';
import MyMiniTaskApplications from './UserPages/UserAppliedMiniTask';
import ApplicantsPage from './Components/MiniTaskManagementComponents/ApplicantsPage';
import MiniTaskInfo from './UserPages/MiniTaskInfo';
import { AdminProvider } from './Context/AdminContext';


import AdminDashboard from './AdminPages/AdminDashboard';
import AdminUserManagement  from './AdminPages/UsersManagement';
import AdminUserDetails from './AdminPages/UserInfo';
import AdminEditUserPage from './AdminPages/AdminEditUser';
import AdminJobManagementDashboard from './AdminPages/AdminJobManagement';
import JobDetailsAdminView from './AdminPages/JobInfo';
import ViewApplicantsAdmin from './AdminPages/AdminViewJobApplicants';
import AdminEditJob from './AdminPages/AdminEditJob';
import AdminEmployerList from './AdminPages/AdminViewEmployerProfiles';
import AdminEmployerDetail from './AdminPages/AdminViewEmployerProfileDetails';


function App() {
  return (
  <Router>
    <Routes>

      <Route path='/' element={<LandingPage/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/complete_profile' element = {<RouteProtection><ProfileCompletion/></RouteProtection>}/>
      <Route path='/login' element={<NotificationProvider><Login/></NotificationProvider>}/>
      <Route path='/h1/dashboard' element={<UserProvider><ChatProvider><NotificationProvider><JobSeekerDashboard/></NotificationProvider></ChatProvider></UserProvider>}/>
      <Route path='/job/listings' element={<UserProvider><NotificationProvider><JobListings/></NotificationProvider></UserProvider>}/>
      <Route path='/job/details/:id' element={<UserProvider><NotificationProvider><JobDetails/></NotificationProvider></UserProvider>}/>
      <Route path='/post/mini_task' element={<NotificationProvider><PostMiniTask/></NotificationProvider>}/>
      <Route path='/manage/mini_tasks' element={<NotificationProvider><ManageMiniTasks/></NotificationProvider>}/>
      <Route path='/mini_task/listings' element={<NotificationProvider><MiniTaskPage/></NotificationProvider>}/>
      <Route path='/view/applied/jobs'element={<UserProvider><NotificationProvider><ViewApplications/></NotificationProvider></UserProvider>}/>
      <Route path='/user/modify/profile' element={<UserProvider><NotificationProvider><EditProfile/></NotificationProvider></UserProvider>}/>
      <Route path="/chat/all_chats" element={<ChatProvider><FullChatPage/></ChatProvider>}/>
      <Route path='/view/all_notifications' element={<NotificationProvider><NotificationsPage/></NotificationProvider>}/>
      <Route path='/mini_task/applications' element={<UserProvider><NotificationProvider><MyMiniTaskApplications/></NotificationProvider></UserProvider>}/>
      <Route
        path="/manage-mini-tasks/:taskId/applicants"
        element={<ApplicantsPage />}
      />
      <Route path='/view/mini_task/info/:Id' element={<UserProvider><NotificationProvider><MiniTaskInfo/></NotificationProvider></UserProvider>}/>




      <Route 
         path='/employer/dashboard' 
         element={
         <UserProvider>
         <JobsContextProvider>
         <PrivateRoutes>
          <NotificationProvider>
          <EmployerDashboard />
          </NotificationProvider>
         </PrivateRoutes>
        </JobsContextProvider>
       </UserProvider>
      }
    />
      <Route path='/employer/jobs' 
      element={
        <JobsContextProvider>
        <PrivateRoutes>
        <NotificationProvider>
        <EmployerJobs/>
        </NotificationProvider>
        </PrivateRoutes>
        </JobsContextProvider>
      }/>

      <Route path='/employer/applicants' element={ <PrivateRoutes><NotificationProvider><Applicants/> </NotificationProvider></PrivateRoutes>}/>

      <Route path='/v1/post_job/form' element={
         <PrivateRoutes>
         <PostJobForm/>
        </PrivateRoutes>
         }/>

      <Route path="/employer/edit_job/:Id" element={<NotificationProvider><EditJob/></NotificationProvider>}/>
      <Route path='/employer/applicant-profile' element={<PrivateRoutes><NotificationProvider><ApplicantProfile/></NotificationProvider></PrivateRoutes>}/>
      
      
      <Route 
      path='/employer/profile'
       element={
         <UserProvider>
           <PrivateRoutes>
            <NotificationProvider>
          <EmployerProfile/>
          </NotificationProvider>
          </PrivateRoutes>
          </UserProvider>
        }/>

        <Route
        path='/employer/notifications'
        element={
          <UserProvider>
            <PrivateRoutes>
              <NotificationProvider>
                <EmployerNotificationsPage/>
              </NotificationProvider>
            </PrivateRoutes>
          </UserProvider>
        }
        />
      <Route
        path='/employer/job/applicants/:Id'
        element={<NotificationProvider><JobApplicantsPage/></NotificationProvider>}
      />
      <Route
      path='/employer/onboarding'
      element ={<EmployerOnboarding/>}
      />

      <Route path='/admin/dashboard' element={<AdminProvider><AdminDashboard/></AdminProvider>}/>
      <Route path='/admin/usermanagement' element={<AdminProvider><AdminUserManagement/></AdminProvider>}/>
      <Route path='/admin/get/user_info/:Id' element={<AdminProvider><AdminUserDetails/></AdminProvider>}/>
      <Route path='/admin/edit/user/:Id'element={<AdminProvider><AdminEditUserPage/></AdminProvider>}/>
      <Route path='/admin/jobmanagement' element={<AdminProvider><AdminJobManagementDashboard/></AdminProvider>}/>
      <Route path='/admin/:Id/job_details' element={<AdminProvider><JobDetailsAdminView/></AdminProvider>}/>
      <Route path='/admin/:jobId/view_applicants' element={<AdminProvider><ViewApplicantsAdmin/></AdminProvider>}/>
      <Route path ='/admin/:Id/edit_job' element={<AdminProvider><AdminEditJob/></AdminProvider>}/>
      <Route path='/admin/get_employers/list' element={<AdminProvider><AdminEmployerList/></AdminProvider>}/>
      <Route path='/admin/:employerId/employer_profile/details' element={<AdminProvider>< AdminEmployerDetail/></AdminProvider>}/>





    </Routes>

  </Router>
    
  )
}

export default App;
