import React from "react";
import classNames from "classnames";
import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const interviewers = props.interviewers.map(interviewer => 
    <InterviewerListItem 
      id={interviewer.id}
      key={interviewer.id} 
      name={interviewer.name} 
      avatar={interviewer.avatar}
      selected={props.interviewer === interviewer.id}
      setInterviewer={props.setInterviewer}
    />);

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers}
      </ul>
    </section>
  );
}