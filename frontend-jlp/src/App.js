import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import RouteProtection from './Services/auth/checkIfLoggedIn';
import AdminRoutes from './Services/auth//AdminRouteProtection';
import LandingPage from './Pages/UserPages/LandingPage';
import Signup from './Pages/UserPages/SignUpPage';
import ProfileCompletion from './Pages/UserPages/ProfileCompletion';
import Login from './Pages/UserPages/LoginPage';
import ForgotPasswordPage from './Pages/UserPages/ForgotPassword';
import ResetPasswordPage from './Pages/UserPages/ResetPassword'
import JobSeekerDashboard from './Pages/UserPages/JobSeekerDashboard';
import JobListings from './Pages/UserPages/RegularJobListings';
import EmployerDashboard from './Pages/EmployerPages/EmployerDashboard';
import EmployerJobs from './Pages/EmployerPages/EmployerJobs';
import JobDetailPage from './Pages/EmployerPages/JobDetailPage'
import Applicants from './Pages/EmployerPages/Applicants';
import PostJobForm from './Pages/EmployerPages/JobPostingForm';
import JobDetails from './Pages/UserPages/JobDetailsPage';
import { UserProvider } from './Context/FetchUser';
import { JobsContextProvider } from './Context/EmployerContext1';
import PostMiniTask from './Pages/ClientPages/MiniTaskForm';
import MiniTaskPage from './Pages/UserPages/MiniTaskListings';
import ViewApplications from './Pages/UserPages/ViewApplications';
import EditProfile from './Pages/UserPages/EditProfile';
import ManageMiniTasks from './Pages/ClientPages/ManageMiniTaskPage';
import EditJob from './Pages/EmployerPages/EditJob';
import  ApplicantProfilePage from './Pages/EmployerPages/ApplicantProfile';
import EmployerProfile from './Pages/EmployerPages/EmployerProfile';
//import ChatModalPage from './UserPages/ChatModalPage';
import FullChatPage from './Pages/UserPages/FullChatPage';
import { ChatProvider } from './Context/ChatContext';
import {NotificationProvider} from './Context/NotificationContext'
import PrivateRoutes from './Services/auth/PrivateRoute';
import NotificationsPage from './Pages/UserPages/NotificationPage';
import EmployerNotificationsPage from './Pages/EmployerPages/EmployerNotificationPage';
import JobApplicantsPage from './Pages/EmployerPages/JobApplicantsPage';
import EmployerOnboarding from './Pages/EmployerPages/EmployerOnboarding';
import MyMiniTaskApplications from './Pages/UserPages/UserAppliedMiniTask';
import ApplicantsPage from './Components/MiniTaskManagementComponents/ApplicantsPage';
import MiniTaskApplicantProfilePage from './Components/MiniTaskManagementComponents/ApplicantProfilePage'
import EditTaskForm from './Components/MiniTaskManagementComponents/EditMiniTaskForm'
import MiniTaskInfo from './Pages/UserPages/MiniTaskInfo';



import  MicroTaskDashboard from './Pages/ClientPages/MiniTaskDashboard'
import MicroTaskDetailPageForClient from './Pages/ClientPages/MicroTaskDetail'
import TaskPosterOnboarding from './Pages/ClientPages/TaskPosterOnboarding'
import TaskPosterProfile from './Pages/ClientPages/ClientProfilePage'

import { AdminProvider } from './Context/AdminContext';
import { ClientMicroJobsProvider} from './Context/ClientMicroJobsContext'


import AdminDashboard from './Pages/AdminPages/AdminDashboard';
import AdminUserManagement  from './Pages/AdminPages/UsersManagement';
import AdminUserDetails from './Pages/AdminPages/UserInfo';
import AdminEditUserPage from './Pages/AdminPages/AdminEditUser';
import AdminJobManagementDashboard from './Pages/AdminPages/AdminJobManagement';
import JobDetailsAdminView from './Pages/AdminPages/JobInfo';
import ViewApplicantsAdmin from './Pages/AdminPages/AdminViewJobApplicants';
import AdminEditJob from './Pages/AdminPages/AdminEditJob';
import AdminEmployerList from './Pages/AdminPages/AdminViewEmployerProfiles';
import AdminEmployerDetail from './Pages/AdminPages/AdminViewEmployerProfileDetails';
import AdminManageMiniTasks from './Pages/AdminPages/AdminMiniTaskManagement';
import AdminMiniTaskDetailPage from './Pages/AdminPages/MiniTaskInfo';
import AdminEditMiniTaskPage from './Pages/AdminPages/AdminEditMiniTaskPage'
import AdminLogin from './Pages/AdminPages/AdminLogin';
import AdminAddUserForm from './Pages/AdminPages/AdminAddNewUser'
import DisputeAdminDashboard from  './Pages/AdminPages/AdminViewReports'
import {EmployerProfileProvider} from './Context/EmployerProfileContext'
import PostEligibilityGate from './Services/auth/MiniJobPostEligiblityGate'
import EmployerPostEligibilityGate from './Services/auth/EmployerJobPostEligibilityGate'
import AdminViewMiniTaskApplicants from './Pages/AdminPages/MiniTaskApplicants'
import ActivityPage from './Pages/AdminPages/RecentActivities'
import FreelancerSubmissions from  './Pages/UserPages/TaskSubmissions'
import ClientViewSubmissions from './Pages/ClientPages/ClientViewTaskSubmissions'
import  ChatPage from './Pages/UserPages/ChatPage'



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
        
        <NotificationProvider><RouteProtection>
        <PostMiniTask/>
      </RouteProtection></NotificationProvider>
     
      </UserProvider>
      }/>
      <Route path='/manage/mini_tasks' element={<UserProvider><NotificationProvider><ManageMiniTasks/></NotificationProvider></UserProvider>}/>
      <Route path='/applicants/:applicantId' element={<UserProvider><NotificationProvider><MiniTaskApplicantProfilePage/></NotificationProvider></UserProvider>}/>
      <Route path='/mini_task/listings' element={<NotificationProvider><MiniTaskPage/></NotificationProvider>}/>
      <Route path='/view/applied/jobs'element={<UserProvider><NotificationProvider><ViewApplications/></NotificationProvider></UserProvider>}/>
      <Route path='/user/modify/profile' element={<UserProvider><RouteProtection><NotificationProvider><EditProfile/></NotificationProvider></RouteProtection></UserProvider>}/>
      <Route path="/chat/all_chats" element={<ChatProvider><FullChatPage/></ChatProvider>}/>
      <Route path='/view/all_notifications' element={<UserProvider><NotificationProvider><NotificationsPage/></NotificationProvider></UserProvider>}/>
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
       <Route path='/edit_task/:Id' element={<UserProvider><NotificationProvider><EditTaskForm/></NotificationProvider></UserProvider>}/>
      

      

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
       <Route path="/employer/view_job/:Id" element={<NotificationProvider><JobDetailPage/></NotificationProvider>}/>
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
      <Route path='/admin/view_all_recent_activities' element={<AdminRoutes><AdminProvider><ActivityPage/></AdminProvider></AdminRoutes>}/>
    
    <Route path='/task_poster/onboarding' element ={<TaskPosterOnboarding/>}/>
    <Route path='/client/microtask_dashboard'element={  <UserProvider><NotificationProvider>< ClientMicroJobsProvider><MicroTaskDashboard/></ClientMicroJobsProvider></NotificationProvider></UserProvider>}/>
    <Route path='/client_view/task/:Id' element={<UserProvider><NotificationProvider><MicroTaskDetailPageForClient/></NotificationProvider></UserProvider>} />
    <Route path='/client/profile' element={<UserProvider><RouteProtection><NotificationProvider><TaskPosterProfile/></NotificationProvider></RouteProtection></UserProvider>}/>

    </Routes>

  </Router>
    
  )
}

export default App;
 