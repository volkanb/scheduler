import React from "react";
import "./styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Error from "./Error";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const ERROR = "ERROR";
const DELETING = "DELETING";
const DELETING_CONFIRMATION = "DELETING_CONFIRMATION";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  async function save(name, interviewer) {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    };
    await props.bookInterview(props.id, interview)
      .then(() => 
        transition(SHOW))
      .catch(error => {
        console.log(error);
        transition(ERROR);
    });
  }

  async function cancel() {
    transition(DELETING);
    await props.cancelInterview(props.id)
      .then(() => 
        transition(EMPTY))
      .catch(error => {
        console.log(error);
        transition(ERROR);
    });
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === SAVING && <Status message={'Saving'}/>}
      {mode === DELETING_CONFIRMATION && (
        <Confirm 
          message={'Are you sure you would like to delete?'}
          onCancel={() => back()}
          onConfirm={cancel}
        />
      )}
      {mode === DELETING && <Status message={'Deleting'}/>}
      {mode === ERROR && <Error/>}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(DELETING_CONFIRMATION)}
        />
      )}
      {mode === CREATE && <Form 
          interviewers={props.interviewers} 
          onCancel={() => back()} 
          save={save}
        />}
    </article>
  );
}