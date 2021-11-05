export function getAppointmentsForDay(state, day) {
  const selectedDay = state.days.filter(oneDay => oneDay.name === day);
  if (state.days.length === 0 || selectedDay.length !== 1) {
    return [];
  }
  const appointmentIds = selectedDay[0].appointments;
  let appointments = [];
  appointmentIds.forEach(id => {
    appointments.push(state.appointments[id]);
  });
  return appointments;  
}

export function getInterviewersForDay(state, day) {
  const selectedDay = state.days.filter(oneDay => oneDay.name === day);
  if (state.days.length === 0 || selectedDay.length !== 1) {
    return [];
  }
  const interviewerIds = selectedDay[0].interviewers;
  let interviewers = [];
  interviewerIds.forEach(id => {
    interviewers.push(state.interviewers[id]);
  });
  return interviewers;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  let interviewObj = {};
  interviewObj.student = interview.student;
  interviewObj.interviewer = {
    id: interview.interviewer,
    name: state.interviewers[interview.interviewer].name,
    avatar: state.interviewers[interview.interviewer].avatar
  };
  return interviewObj;
}