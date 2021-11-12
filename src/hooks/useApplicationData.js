import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // Returns the number of remaining available slots in a day
  const spotsRemaining = function(appointments) {
    const appointmentIds = state.days.filter(day => day.name === state.day)[0].appointments;
    let remainingSpots = 0;
    appointmentIds.forEach(id => {
      if(appointments[id].interview === null) {
        remainingSpots++;
      }
    });
    return remainingSpots;
  }

  async function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // Make data persistent after updating remaining spots
    await axios.put(`/api/appointments/${id}`, {interview})
      .then(() => {
        const dayId = state.days.filter(day => day.name === state.day)[0].id;
        const stateCopy = { ...state };
        stateCopy.days[dayId - 1].spots = spotsRemaining(appointments);
        setState({ ...stateCopy, appointments });
      });
  }

  async function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // Make data persistent after updating remaining spots
    await axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const dayId = state.days.filter(day => day.name === state.day)[0].id;
        const stateCopy = { ...state };
        stateCopy.days[dayId - 1].spots = spotsRemaining(appointments);
        setState({ ...stateCopy, appointments });
      });
  }
  
  const setDay = day => setState({ ...state, day });
  
  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);
  
  return { state, setDay, bookInterview, cancelInterview };
};