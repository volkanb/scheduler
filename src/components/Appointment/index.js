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
const EDIT = "EDIT";
const SAVING = "SAVING";
const ERROR_DELETE = "ERROR_DELETE";
const ERROR_SAVE = "ERROR_SAVE";
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
        transition(ERROR_SAVE, true);
    });
  }

  async function cancel() {
    transition(DELETING, true);
    await props.cancelInterview(props.id)
      .then(() => 
        transition(EMPTY))
      .catch(error => {
        console.log(error);
        transition(ERROR_DELETE, true);
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
      {mode === ERROR_SAVE && (
        <Error 
          message={'Could not save appointment'}
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error 
          message={'Could not delete appointment'}
          onClose={() => back()}
        />
      )}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(DELETING_CONFIRMATION)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === EDIT && <Form 
          interviewers={props.interviewers} 
          onCancel={() => back()} 
          save={save}
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      }
      {mode === CREATE && <Form 
          interviewers={props.interviewers} 
          onCancel={() => back()} 
          save={save}
        />
      }
    </article>
  );
}