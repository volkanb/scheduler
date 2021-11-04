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