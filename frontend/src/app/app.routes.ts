import { Routes } from '@angular/router';
import { AdminAddMaintainerComponent } from './admin-page/admin-add-maintainer/admin-add-maintainer.component';
import { AdminGetAllMaintainersComponent } from './admin-page/admin-get-all-maintainers/admin-get-all-maintainers.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminSetTrainingRoomSizeComponent } from './admin-page/admin-set-training-room-size/admin-set-training-room-size.component';
import { AdminViewAllTrainersComponent } from './admin-page/admin-view-all-trainers/admin-view-all-trainers.component';
import { AdminViewStudentsComponent } from './admin-page/admin-view-students/admin-view-students.component';
import { AdminViewManagerComponent } from './admin-page/admin-view-manager/admin-view-manager.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './Login/login-page/login-page.component';
import { AdminDashboardComponent } from './admin-page/admin-dashboard/admin-dashboard.component';
import { MaintainerPageComponent } from './maintainer/maintainer-page/maintainer-page.component';
import { ForgotPasswordComponent } from './Login/forgot-password/forgot-password.component';

import { MaintainerDashboardComponent } from './maintainer/maintainerdashboard/maintainer-dashboard/maintainer-dashboard.component';
import { MaintainerPostMarksComponent } from './maintainer/maintainerpostmarks/maitainer-post-marks/maitainer-post-marks.component';
// import { MaintainerviewmarksComponent } from './maintainer/maintainerviewmarks/maintainerviewmarks.component';
import { MaintainerviewstudentComponent } from './maintainer/maintainerviewstudent/maintainerviewstudent/maintainerviewstudent.component';
import { MaintainerregisterstudentComponent } from './maintainer/maintainer-registerstudent/maintainerregisterstudent/maintainerregisterstudent.component';
import { MaintainerviewattendenceComponent } from './maintainer/maintainer-viewattendence/maintainerviewattendence/maintainerviewattendence.component';
import { UploadtrainerpdfComponent } from './maintainer/maintainer-uploadtrainerpdf/uploadtrainerpdf/uploadtrainerpdf.component';
import { MaintainerregistertrainerComponent } from './maintainer/maintainer-registertrainer/maintainerregistertrainer/maintainerregistertrainer.component';
import { MaintaineralltrainersComponent } from './maintainer/maintainer-alltrainers/maintaineralltrainers/maintaineralltrainers.component';

import { ManagerPageComponent } from './manager/manager-page/manager-page.component';
import { ManagerViewDetailsComponent } from './manager/manager-view-details/manager-view-details.component';
import { ManagerAddrequestsComponent } from './manager/manager-addrequests/manager-addrequests.component';
import { ManagerViewrequestsComponent } from './manager/manager-viewrequests/manager-viewrequests.component';
import { StudentPageComponent } from './student/student-page/student-page.component';
import { StudentViewDetailsComponent } from './student/student-viewdetails/student-viewdetails.component';
import { StudentViewMarksComponent } from './student/student-view-marks/student-view-marks.component';
import { StudentViewClassMarksComponent } from './student/student-view-class-marks/student-view-class-marks.component';
import { StudentViewClassAttendanceComponent } from './student/student-view-class-attendence/student-view-class-attendence.component';
import { StudentFeedbackComponent } from './student/student-feedback/student-feedback.component';
import { TrainerViewpageComponent } from './trainer/trainer-viewpage/trainer-viewpage.component';
import { TrainerViewDetailsComponent } from './trainer/trainer-viewdetails/trainer-viewdetails.component';
import { TrainerViewMarksComponent } from './trainer/trainer-view-marks/trainer-view-marks.component';
import { TrainerViewattendenceComponent } from './trainer/trainer-viewattendence/trainer-viewattendence.component';
import { TrainerViewFeedbackComponent } from './trainer/trainer-viewfeedback/trainer-viewfeedback.component';
import { TrainerViewTimeTableComponent } from './trainer/trainer-view-time-table/trainer-view-time-table.component';
import { TrainerPostAttendanceComponent } from './trainer/trainer-post-attendence/trainer-post-attendence.component';
import { AdminPostManagerComponent } from './admin-page/admin-post-manager/admin-post-manager.component';
import { MaintainerAssignRoomComponent } from './maintainer/maintainer-assign-room/maintainer-assign-room/maintainer-assign-room.component';
import { MaintainergetmanagersComponent } from './maintainer/maintainer-getmanagers/maintainergetmanagers/maintainergetmanagers.component';
import { MaintainerAccessrequestsComponent } from './maintainer/maintainer-accessrequests/maintainer-accessrequests/maintainer-accessrequests.component';
import { MaintainercreateattendenceComponent } from './maintainer/maintainer-createattendence/maintainercreateattendence/maintainercreateattendence.component';
import { StudentPostAttendenceComponent } from './student/student-post-attendence/student-post-attendence.component';
import { MaintainerRegisterExcelStudentsComponent } from './maintainer/maintainer-register-excel-students/maintainer-register-excel-students.component';
import { MaintainerAssignNullroomStudentsComponent } from './maintainer/maintainer-assign-nullroom-students/maintainer-assign-nullroom-students.component';
import { MaintainerviewmarksComponent } from './maintainer/maintainerviewmarks/maintainerviewmarks.component';
import { MaintainerGetDoneStudentsComponent } from './maintainer/maintainer-get-done-students/maintainer-get-done-students.component';
import { MaintainerMakeRoomDoneComponent } from './maintainer/maintainer-make-room-done/maintainer-make-room-done.component';
// import { MaintainerRegisterExcelStudentsComponent } from './maintainer-register-excel-students/maintainer-register-excel-students.component';
// import { MaintainerAssignNullroomStudentsComponent } from './maintainer-assign-nullroom-students/maintainer-assign-nullroom-students.component';


export const routes: Routes = [

    { path: 'login', component: LoginPageComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },

    {
        path: 'admin', component: AdminPageComponent, children: [
            {path:'',component:AdminDashboardComponent},

            { path: 'add-maintainer', component: AdminAddMaintainerComponent },
            { path: 'admin-view-students', component: AdminViewStudentsComponent },
            { path: 'admin-view-all-maintainers', component: AdminGetAllMaintainersComponent },
            { path: 'admin-set-training-room', component: AdminSetTrainingRoomSizeComponent },
            { path: 'admin-view-all-trainers', component: AdminViewAllTrainersComponent },
            { path: 'admin-view-managers', component: AdminViewManagerComponent },
            { path: 'admin-dashboard', component: AdminDashboardComponent },
            { path: 'admin-post-manager', component: AdminPostManagerComponent }
        ]
    },


    {
        path: "maintainer", component: MaintainerPageComponent, children: [
            {path:'',component:MaintainerDashboardComponent},
            { path: 'admin-view-students', component: AdminViewStudentsComponent },
            { path: 'maintainer-dashboard', component: MaintainerDashboardComponent },
            { path: 'maintainer-post-marks', component: MaintainerPostMarksComponent },
            { path: 'maintainer-view-marks', component: MaintainerviewmarksComponent },
            { path: 'maintainer-view-students', component: MaintainerviewstudentComponent },
            { path: 'maintainer-student-register', component: MaintainerregisterstudentComponent },
            { path: 'maintainer-view-attendence', component: MaintainerviewattendenceComponent },
            { path: 'maintainer-post-pdf', component: UploadtrainerpdfComponent },
            { path: 'maintainer-register-trainer', component: MaintainerregistertrainerComponent },
            { path: 'maintainer-get-all-trainers', component: MaintaineralltrainersComponent },
            { path: 'maintainer-assign-room', component: MaintainerAssignRoomComponent },
            { path: 'maintainer-get-managers', component: MaintainergetmanagersComponent },
            { path: 'maintainer-access-requests', component: MaintainerAccessrequestsComponent },
            { path: 'maintainer-create-attendence', component: MaintainercreateattendenceComponent },
            { path: 'maintainer-register-excel-students', component: MaintainerRegisterExcelStudentsComponent },
            { path: 'maintainer-assign-nullroom-students', component: MaintainerAssignNullroomStudentsComponent },
            {path:'maintainer-get-done-students',component:MaintainerGetDoneStudentsComponent},
            {path:'maintainer-make-room-done',component:MaintainerMakeRoomDoneComponent}
        ]
    },



    {
        path: 'manager', component: ManagerPageComponent, children: [

            { path: '', component: ManagerViewDetailsComponent },
            { path: 'manager-viewdetails', component: ManagerViewDetailsComponent },
            { path: 'manager-addrequests', component: ManagerAddrequestsComponent },
            { path: 'manager-viewrequests', component: ManagerViewrequestsComponent },
            // {path:'',redirectTo:'manager-viewdetails'}
        ]
    },
    {
        path: 'student',
        component: StudentPageComponent,
        children: [
            {path:'',component:StudentViewDetailsComponent},
            { path: 'student-viewdetails', component: StudentViewDetailsComponent },
            { path: 'student-viewmarks', component: StudentViewMarksComponent },
            { path: 'student-viewclassmarks', component: StudentViewClassMarksComponent },
            { path: 'student-viewclassattendence', component: StudentViewClassAttendanceComponent },
            { path: 'student-feedback', component: StudentFeedbackComponent },
            { path: 'student-post-attendance', component: StudentPostAttendenceComponent }
        ]
    },


    {
        path: 'trainer', component: TrainerViewpageComponent,
        children: [
            { path: '', component: TrainerViewDetailsComponent },
            { path: 'trainer-viewdetails', component: TrainerViewDetailsComponent },
            { path: 'trainer-viewmarks', component: TrainerViewMarksComponent },
            { path: 'trainer-viewattendence', component: TrainerViewattendenceComponent },
            { path: 'trainer-viewfeedback', component: TrainerViewFeedbackComponent },
            { path: 'trainer-viewtime-table', component: TrainerViewTimeTableComponent },
            { path: 'trainer-post-attendance', component: TrainerPostAttendanceComponent }
        ]
    },

    { path: '**', component: HomePageComponent }



];
