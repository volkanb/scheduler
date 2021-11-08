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
  const spotsRemaining = function() {
    const appointmentIds = state.days.filter(day => day.name === state.day)[0].appointments;
    let remainingSpots = 0;
    appointmentIds.forEach(id => {
      if(state.appointments[id].interview === null) {
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
    await axios.put(`http://localhost:8001/api/appointments/${id}`, {interview})
      .then(() => {
        const dayId = state.days.filter(day => day.name === state.day)[0].id;
        state.days[dayId - 1].spots = (spotsRemaining() - 1);
        setState({ ...state, appointments });
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
    await axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(() => {
      const dayId = state.days.filter(day => day.name === state.day)[0].id;
      state.days[dayId - 1].spots = (spotsRemaining() + 1);
      setState({ ...state, appointments });
    });
  }
  
  const setDay = day => setState({ ...state, day });
  
  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`)
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);
  
  return { state, setDay, bookInterview, cancelInterview };
};