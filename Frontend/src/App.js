
import { BrowserRouter, Routes,Route} from 'react-router-dom';
import LoginRegisterPage from './pages/loginRegisterPage';
import { registerLicense } from '@syncfusion/ej2-base';
import ButtonAppBar from './components/navbar/navbar';
import './App.css';
import CurrentSchedule from './pages/schedule/current_schedule';
import PostSchedule from './pages/schedule/post_schedule';
import ApproveShifts from './pages/schedule/approve_shifts';
import MySchedule from './pages/shifts/my_shifts';
import AvailableShifts from './pages/shifts/available_shifts';
import React, { useState } from 'react';

function App() {
  registerLicense("Ngo9BigBOggjHTQxAR8/V1NGaF5cXmpCdkx0Rnxbf1xzZFRMZVxbQXBPIiBoS35RdUVkW3tfdHVRRmVVV0J3");

  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <BrowserRouter>

      <main>
        <ButtonAppBar></ButtonAppBar>
        <Routes>
          <Route path="/" element={<LoginRegisterPage isRegistered={isRegistered} />} />
          <Route path="/schedule" element={<CurrentSchedule></CurrentSchedule>}></Route>
          <Route path="/post_shifts" element={<PostSchedule></PostSchedule>}></Route>
          <Route path='/approve_shifts' element={<ApproveShifts></ApproveShifts>}></Route>
          <Route path="/my_shifts" element={<MySchedule></MySchedule>}></Route>
          <Route path="/available_shifts" element={<AvailableShifts></AvailableShifts>}></Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
