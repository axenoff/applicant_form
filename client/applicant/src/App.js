import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import Autocomplete from 'react-autocomplete';
import './App.css';
import {api} from './constants.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      careerLevels: [],
      newApplicant: {
        name: "",
        email: "",
        phone: "",
        career_level: "",
        experience: "",
        cover_note: "",
        image: null,
        skills: [],
      },
      uploadedImage: {},
      currentSkill: "",
      skillsList: {},
      dataSent: false,
    };
  }

  getCareerLevels = async () => {
    try {
      const levelsResponse = await fetch(`${api}/career_levels`, {
        method: 'GET'
      })
      const levelsResponseJSON = await levelsResponse.json();
      let levels = [];
      if (levelsResponseJSON.career_levels.length > 0) {
        levels = ['', ...levelsResponseJSON.career_levels]
      }
      this.setState({
        careerLevels: levels,
      })
    } catch(e) {
      alert(e)
    }
  }

  getSkillsList = async () => {
    try {
      const skillsResponse = await fetch(`${api}/skills`, {
        method: 'GET'
      })
      const skillsResponseJSON = await skillsResponse.json();
      let skills = {};
      if (Object.keys(skillsResponseJSON.skills).length > 0) {
        skills = skillsResponseJSON.skills
      }
      this.setState({
        skillsList: skills,
      })
    } catch(e) {
      alert(e)
    }
  }

  sendApplicantData = async () => {
    const {newApplicant, uploadedImage} = this.state;
    const applicantData = {
      ...newApplicant,
      image: uploadedImage.id
    }
    if (this.applicantDataIsValid()) {
      try {
        const createApplicantResponse = await fetch(`${api}/applicant`, {
          method: 'POST',
          body: JSON.stringify(applicantData),
          headers: { 'Content-Type': 'application/json' },
        })
        const createApplicantResponseJSON = await createApplicantResponse.json();
        if (!createApplicantResponseJSON.error) {
          this.setState({
            dataSent: true,
          })
        } else {
          alert('Server response was false. Try again later!')
        }
      } catch(e) {
        alert(e)
      }
    } else {
      return null
    }
  }

  sendImageToController = async (formPayLoad) => {
    try {
      const response = await fetch(`${api}/upload_image`, {
        credentials: 'same-origin',
        authenticity_token: true,
        headers: {},
        method: 'POST',
        body: formPayLoad
      })
      const responseJSON = await response.json();
      if (!responseJSON.error) {
        this.setState({uploadedImage: responseJSON})
      } else {
        alert('Uploading failed. Try again or choose another file')
      }
    } catch (e) {
      alert(e)
    }
  }

  handleInputChange = (e) => {
    const {newApplicant} = this.state;
    const {value, name} = e.target;
    this.setState({
      newApplicant: {
        ...newApplicant,
        [name]: value
      },
    })
  };

  nameIsValid = () => {
    const {name} = this.state.newApplicant;
    return (name.length > 0)
  }

  emailIsValid = () => {
    const {email} = this.state.newApplicant;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (email.length > 0 && re.test(email.toLowerCase()));
  }

  phoneIsValid = () => {
    const {phone} = this.state.newApplicant;
    const re = /^((\+|00)\d{1,3})?\d+$/;
    return (phone.length === 0 || re.test(phone));
  }

  careerLevelIsValid = () => {
    const {career_level} = this.state.newApplicant;
    return (career_level.length > 0);
  }

  experienceIsValid = () => {
    const {experience} = this.state.newApplicant;
    const re = /^[0-9]*$/
    return experience.length > 0 && re.test(experience)
  }

  coverNoteIsValid = () => {
    const {cover_note} = this.state.newApplicant;
    return cover_note.length <= 200;
  }

  currentSkillIsValid = () => {
    const {currentSkill, newApplicant} = this.state;
    const {skills} = newApplicant;
    return (currentSkill.length > 1 && !skills.find(skill => skill.name === currentSkill))
    || (currentSkill.length === 0 && skills.length >= 3);
  }

  applicantDataIsValid = () => {
    const {newApplicant} = this.state;
    return this.nameIsValid()
        && this.emailIsValid()
        && this.phoneIsValid()
        && this.careerLevelIsValid()
        && this.experienceIsValid()
        && this.coverNoteIsValid()
        && newApplicant.skills.length >= 3
  }

  updateNewApplicantSkills = () => {
    const {currentSkill, newApplicant} = this.state;
    const {skillsList} = this.state;
    const {skills} = newApplicant;
    const skillId = skillsList[currentSkill];
    this.setState({
      currentSkill: "",
      newApplicant: {
        ...newApplicant,
        skills: [...skills, {name: currentSkill, id: skillId}]
      }
    })
  };

  handleCurrentSkillChange = (value) => {
    this.setState({
      currentSkill: value
    })
  };

  readFile = (files) => {
    if (files && files[0]) {
      let formPayLoad = new FormData();
      formPayLoad.append('uploaded_image', files[0]);
      this.sendImageToController(formPayLoad)
    }
  }

  componentDidMount() {
    this.getCareerLevels();
    this.getSkillsList();
  }

  renderApplicantSkills = () => {
    const {skills} = this.state.newApplicant;
    return (
      <div className="simple-text">
        Your skills:
        <div className="entered-skills">
          {skills.map((skill) =>
          <div key={skill.name} className="skill">{skill.name}</div>)}
        </div>
      </div>
    )
  }

  render() {
    const {careerLevels, newApplicant, dataSent} = this.state;
    const skillsList = Object.keys(this.state.skillsList);
    let currentSkill = this.state.currentSkill;
    const {name, email, phone, cover_note, experience, skills} = newApplicant;
    const nameIsValid = this.nameIsValid();
    const emailIsValid = this.emailIsValid();
    const phoneIsValid = this.phoneIsValid();
    const careerLevelIsValid = this.careerLevelIsValid();
    const experienceIsValid = this.experienceIsValid();
    const coverNoteIsValid = this.coverNoteIsValid();
    const currentSkillIsValid = this.currentSkillIsValid();

    const autocompleteStyle = {
      marginTop: '10px',
      width: '200px',
      height: '34px',
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      borderWidth: '1px',
    };

    const autocompleteInputStyle = {
      width: '100%', 
      height: '100%',
      borderRadius: '6px',
      borderWidth: '1px',

    };

    const autocompleteInvalidStyle = {
      ...autocompleteInputStyle,
      border: 'solid 1px red',
    };

    const dropzoneStyle = {
      width  : "100%",
      height : "20%",
      border : 'none'
    };

    if (dataSent) {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to DQ Media</h1>
          </header>
          <p className="App-intro">
            Thank you! Your data has been saved
          </p>
        </div>
      )
    } else {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to DQ Media</h1>
          </header>
          <p className="App-intro">
            Dear applicant! Please fill the form below
          </p>
          <div className="applicant-forms">
            <input
              className={`short-form ${nameIsValid ? '' : 'invalid'}`}
              type={"text"}
              name='name'
              placeholder="*Name"
              value={name}
              onChange={this.handleInputChange}/>
            <input
              className={`short-form ${emailIsValid ? '' : 'invalid'}`}
              type={"text"}
              name='email'
              placeholder="*Email"
              value={email}
              onChange={this.handleInputChange}/>
            <input
              className={`short-form ${phoneIsValid ? '' : 'invalid'}`}
              type={"text"}
              name='phone'
              placeholder="Phone"
              value={phone}
              onChange={this.handleInputChange}/>
            <div className="career-level">
              *Select you career level:
              <select 
                className={`short-form ${careerLevelIsValid ? '' : 'invalid'}`}
                name='career_level'
                onChange={this.handleInputChange}>
                {careerLevels.map((cl) => (
                  <option
                    key={cl}
                    value={cl}>
                    {cl}
                  </option>
                ))}
              </select>
            </div>
            <div className="experience">
              *I have 
              <input
                className={`extra-short-form ${experienceIsValid ? '' : 'invalid'}`}
                type={"text"}
                name='experience'
                placeholder="Enter Number"
                value={experience}
                onChange={this.handleInputChange}/>
               years of experience
            </div>
            <div className='simple-text'>
              You can upload your photo (only jpeg, png, gif format, max 5MB):
            </div>
            <div>
              <Dropzone
                accept="image/jpeg, image/png, image/gif"
                onDrop={this.readFile}
                style={dropzoneStyle}
                maxSize={5000000}
                multiple={false}>
                <div className='send-data-btn'>Upload</div>
              </Dropzone>
            </div>
            {this.state.uploadedImage.file ? 
              <img className="uploaded-photo" src={`${api}${this.state.uploadedImage.file.url}`} />
              : null
            }
            <textarea
              className={`long-form ${coverNoteIsValid ? '' : 'invalid'}`}
              type={"text"}
              name='cover_note'
              placeholder="Cover note (max 200 characters)"
              value={cover_note}
              onChange={this.handleInputChange.bind(this)}/>
              <div className="simple-text">
                *Add at least 3 skills:
              </div>
            <div className="skills-container">
              <Autocomplete
                wrapperStyle={autocompleteStyle}
                inputProps={{ style: currentSkillIsValid ? autocompleteInputStyle : autocompleteInvalidStyle }}
                getItemValue={(item) => item}
                items={skillsList}
                renderItem={(item, isHighlighted) =>
                  <div key={item} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                    {item}
                  </div>
                }
                value={currentSkill}
                onChange={(e) => this.handleCurrentSkillChange(e.target.value)}
                onSelect={(val) => this.handleCurrentSkillChange(val)}
              />
              {(currentSkillIsValid && currentSkill.length > 1) ?
                <div className='send-data-btn' onClick={this.updateNewApplicantSkills}>
                  <span className='btn-text'>
                    Add
                  </span>
                </div> 
                : null}
            </div>
            {
              skills.length > 0 
              ? this.renderApplicantSkills()
              : null 
            }
            {this.applicantDataIsValid() ? 
            <div className='send-data-btn' onClick={this.sendApplicantData}>
              <span className='btn-text'>
                Submit
              </span>
            </div> 
            : null}
          </div>
        </div>
      );
    }
  }
}

export default App;
