import React, { Component } from 'react'
import Moment from 'react-moment';


class ProfileCreds extends Component {
  render() {
    const { education, experience } = this.props;

    const expItems = experience.map(exp => (
      <li key={exp._id} className= "list-group-item">
        <h1>{exp.company}</h1>
        <p>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment> - 
          {exp.to === "" ? (' Now')  : ( <Moment format="YYYY/MM/DD" >{exp.to}</Moment>)}
        </p>
        <p><strong>Position: </strong> {exp.title} </p>
        <p>
          {exp.location === "" ? null : (<span><strong>{exp.location}</strong></span>)}
        </p>
        <p>
          {exp.description === "" ? null : (<span><strong>{exp.description}</strong></span>)}
        </p>
      </li>
    ))

    const eduItems = education.map(edu => (
      <li key={edu._id} className= "list-group-item">
        <h1>{edu.school}</h1>
        <p>
          <Moment format="YYYY/MM/DD">{edu.from}</Moment> - 
          {edu.to === "" ? (' Now')  : ( <Moment format="YYYY/MM/DD" >{edu.to}</Moment>)}
        </p>
        <p><strong>Degree: </strong> {edu.degree} </p>
        <p><strong>Field of Stufy: </strong> {edu.fieldofstudy} </p>
        <p>
          {edu.description === "" ? null : (<span><strong>{edu.description}</strong></span>)}
        </p>
      </li>
    ))

    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <h3 className="text-center text-info">Experience</h3>
            {expItems.length > 0 ? (
              <ul className="list-group">
                {expItems}
              </ul>

            ) : (
              <p className="text-center">No Experience Listed</p>
            )}
          </div>
          <div className="col-md-6">
            <h3 className="text-center text-info">Education</h3>
            <ul className="list-group">
              {eduItems.length > 0 ? (
                <ul className="list-group">
                  {eduItems}
                </ul>

              ) : (
                <p className="text-center">No Education Listed</p>
              )}
            </ul>
          </div>
        </div>

      </div>
    )
  }
}

export default ProfileCreds;