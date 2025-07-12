import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import RouteProtection from './Utils/checkIfLoggedIn';
import AdminRoutes from './Utils/AdminRouteProtection';
import LandingPage from './UserPages/LandingPage';
import Signup from './UserPages/SignUpPage';
import ProfileCompletion from './UserPages/ProfileCompletion';
import Login from './UserPages/LoginPage';
import ForgotPasswordPage from './UserPages/ForgotPassword';
import ResetPasswordPage from './UserPages/ResetPassword'
import JobSeekerDashboard from './UserPages/JobSeekerDashboard';
import JobListings from './UserPages/RegularJobListings';
import EmployerDashboard from './EmployerPages/EmployerDashboard';
import EmployerJobs from './EmployerPages/EmployerJobs';
import Applicants from './EmployerPages/Applicants';
import PostJobForm from './EmployerPages/JobPostingForm';
import JobDetails from './UserPages/JobDetailsPage';
import { UserProvider } from './Context/FetchUser';
import { JobsContextProvider } from './Context/EmployerContext1';
import PostMiniTask from './UserPages/MiniTaskForm';
import MiniTaskPage from './UserPages/MiniTaskListings';
import ViewApplications from './UserPages/ViewApplications';
import EditProfile from './UserPages/EditProfile';
import ManageMiniTasks from './UserPages/ManageMiniTaskPage';
import EditJob from './EmployerPages/EditJob';
import  ApplicantProfilePage from './EmployerPages/ApplicantProfile';
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
import AdminManageMiniTasks from './AdminPages/AdminMiniTaskManagement';
import AdminMiniTaskDetailPage from './AdminPages/MiniTaskInfo';
import AdminEditMiniTaskPage from './AdminPages/AdminEditMiniTaskPage'
import AdminLogin from './AdminPages/AdminLogin';
import AdminAddUserForm from './AdminPages/AdminAddNewUser'
import DisputeAdminDashboard from  './AdminPages/AdminViewReports'
import {EmployerProfileProvider} from './Context/EmployerProfileContext'
import PostEligibilityGate from './Utils/MiniJobPostEligiblityGate'
import EmployerPostEligibilityGate from './Utils/EmployerJobPostEligibilityGate'
import AdminViewMiniTaskApplicants from './AdminPages/MiniTaskApplicants'
import FreelancerSubmissions from  './UserPages/TaskSubmissions'
import ClientViewSubmissions from './UserPages/ClientViewTaskSubmissions'
import  ChatPage from './UserPages/ChatPage'



function App() {
  return (
  <Router>
    <Routes>

      <Route path='/' element={<LandingPage/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/complete_profile' element = {<ProfileCompletion/>}/>
      <Route path='/login' element={<NotificationProvider><Login/></NotificationProvider>}/>
      <Route path= '/forgot-password' element={<ForgotPasswordPage/>}/>
      <Route path= '/reset-password' element={<ResetPasswordPage/>}/>
      <Route path='/h1/dashboard' element={<UserProvider><RouteProtection><ChatProvider><NotificationProvider><JobSeekerDashboard/></NotificationProvider></ChatProvider></RouteProtection></UserProvider>}/>
      <Route path='/job/listings' element={<UserProvider><RouteProtection><NotificationProvider><JobListings/></NotificationProvider></RouteProtection></UserProvider>}/>
      <Route path='/job/details/:id' element={<UserProvider><NotificationProvider><JobDetails/></NotificationProvider></UserProvider>}/>
      <Route path='/post/mini_task' 
      element={<UserProvider>
        <PostEligibilityGate>
        <NotificationProvider><RouteProtection>
          <PostMiniTask/>
      </RouteProtection></NotificationProvider>
      </PostEligibilityGate>
      </UserProvider>
      }/>
      <Route path='/manage/mini_tasks' element={<UserProvider><NotificationProvider><ManageMiniTasks/></NotificationProvider></UserProvider>}/>
      <Route path='/mini_task/listings' element={<NotificationProvider><MiniTaskPage/></NotificationProvider>}/>
      <Route path='/view/applied/jobs'element={<UserProvider><NotificationProvider><ViewApplications/></NotificationProvider></UserProvider>}/>
      <Route path='/user/modify/profile' element={<UserProvider><RouteProtection><NotificationProvider><EditProfile/></NotificationProvider></RouteProtection></UserProvider>}/>
      <Route path="/chat/all_chats" element={<ChatProvider><FullChatPage/></ChatProvider>}/>
      <Route path='/view/all_notifications' element={<NotificationProvider><NotificationsPage/></NotificationProvider>}/>
      <Route path='/mini_task/applications' element={<UserProvider><NotificationProvider><MyMiniTaskApplications/></NotificationProvider></UserProvider>}/>
      <Route
        path="/manage-mini-tasks/:taskId/applicants"
        element={<ApplicantsPage />}
      />
      <Route path='/view/mini_task/info/:Id' element={<UserProvider><NotificationProvider><MiniTaskInfo/></NotificationProvider></UserProvider>}/>
      <Route path='/freelancer/:taskId/view_task_submissions' element={<UserProvider><NotificationProvider><FreelancerSubmissions/></NotificationProvider></UserProvider>}/>
      <Route  path='/client/:taskId/view_task_submissions' element={<UserProvider><NotificationProvider><ClientViewSubmissions/></NotificationProvider></UserProvider>}/>
      <Route path='/messages/:roomId' element={<UserProvider><NotificationProvider>< ChatPage/></NotificationProvider></UserProvider>}/>
      <Route path='/messages' element={<UserProvider><NotificationProvider>< ChatPage/></NotificationProvider></UserProvider>}/>
      

      <Route 
         path='/employer/dashboard' 
         element={
         <UserProvider>
         <EmployerProfileProvider>
         <JobsContextProvider>
         <PrivateRoutes>
          <NotificationProvider>
          <EmployerDashboard />
          </NotificationProvider>
         </PrivateRoutes>
        </JobsContextProvider>
        </EmployerProfileProvider>
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
      <Route path='/employer/job/applicantprofile' element={ <PrivateRoutes><NotificationProvider><ApplicantProfilePage /></NotificationProvider></PrivateRoutes>}/>
      <Route path='/v1/post_job/form' element={
         <PrivateRoutes>
          <UserProvider>
          <EmployerProfileProvider>
          <EmployerPostEligibilityGate >
          <PostJobForm/>
          </EmployerPostEligibilityGate>
          </EmployerProfileProvider>
          </UserProvider>
        </PrivateRoutes>
         }/>

      <Route path="/employer/edit_job/:Id" element={<NotificationProvider><EditJob/></NotificationProvider>}/>
      <Route path='/employer/applicant-profile' element={<PrivateRoutes><NotificationProvider><ApplicantProfilePage/></NotificationProvider></PrivateRoutes>}/>
      
      
      <Route 
      path='/employer/profile'
       element={
         <UserProvider>
          <EmployerProfileProvider>
           <JobsContextProvider>
           <PrivateRoutes>
            <NotificationProvider>
            <EmployerProfile/>
          </NotificationProvider>
          </PrivateRoutes>
          </JobsContextProvider>
          </EmployerProfileProvider>
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

      <Route path='/admin/login'element={<AdminLogin/>}/>
      <Route path='/admin/dashboard' element={<AdminRoutes><AdminProvider><AdminDashboard/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/usermanagement' element={<AdminRoutes><AdminProvider><AdminUserManagement/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/get/user_info/:Id' element={<AdminRoutes><AdminProvider><AdminUserDetails/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/edit/user/:Id'element={<AdminRoutes><AdminProvider><AdminEditUserPage/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/jobmanagement' element={<AdminRoutes><AdminProvider><AdminJobManagementDashboard/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/:Id/job_details' element={<AdminRoutes><AdminProvider><JobDetailsAdminView/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/:jobId/view_applicants' element={<AdminRoutes><AdminProvider><ViewApplicantsAdmin/></AdminProvider></AdminRoutes>}/>
      <Route path ='/admin/:Id/edit_job' element={<AdminRoutes><AdminProvider><AdminEditJob/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/get_employers/list' element={<AdminRoutes><AdminProvider><AdminEmployerList/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/:employerId/employer_profile/details' element={<AdminRoutes><AdminProvider>< AdminEmployerDetail/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/manage_minitasks'element={<AdminRoutes><AdminProvider><AdminManageMiniTasks/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/:Id/mini_task_info' element={<AdminRoutes><AdminProvider><AdminMiniTaskDetailPage/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/:Id/modify_min_task' element={<AdminRoutes><AdminProvider><AdminEditMiniTaskPage/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/add_new_user' element={<AdminRoutes><AdminProvider><AdminAddUserForm/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/minitask/:taskId/applicants' element={<AdminRoutes><AdminProvider><AdminViewMiniTaskApplicants/></AdminProvider></AdminRoutes>}/>
      <Route path='/admin/view_all_reports' element={<AdminRoutes><AdminProvider><DisputeAdminDashboard/></AdminProvider></AdminRoutes>}/>

    </Routes>

  </Router>
    
  )
}

export default App;
