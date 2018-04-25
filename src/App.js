import React, { Component } from 'react';

import logo from './logo.svg';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import './App.css'; 
import './semantic.css';

const storageKey = "livemortal";

class App extends Component {

  constructor(props) {
    super(props);

    //localStorage.setItem(storageKey, null); //FIXME testing only to clear dodgy state

    //reload state from storage
    const oldState = localStorage.getItem(storageKey);
    if (oldState && oldState !== 'null') {
      this.state = JSON.parse(oldState);
    } else {
      this.state = {
        birthday: null,
        age: null
      };
    }
  }

  dobChanged = (date) => {
    var bday = date.unix(); //convert moment to timestamp for persistance
    var age = this.recalculateAge(date);

    var newState = {
      birthday: bday,
      age: age
    };

    localStorage.setItem(storageKey, JSON.stringify(newState));
    this.setState(newState);
  }

  recalculateAge = (date) => {
    var yearsDiff = date.diff(moment(), 'years');
    return yearsDiff*-1;
  }

  render() {
    //moment object for picker
    var momentBirthday = this.state.birthday !== null ? moment.unix(this.state.birthday) : null;

    //age text
    var ageText = this.state.age > 0 ? this.state.age + ' years / ' + Math.floor((this.state.age/125)*100) + '% lived' : '';

    //calendar data
    var calendarYears = [];
    if (this.state.birthday !== null) {
      var bday = moment.unix(this.state.birthday);
      for (var i=0;i<125;i++) {
        var year = bday.add(1, 'years');

        var lived = 0;
        if (moment().year() > year.year()) {
          lived = 100;
        } else if (moment().year() === year.year()) {
          var daysInYear = (year.isLeapYear ? 366 : 365);
          lived = (year.dayOfYear() / daysInYear) * 100;
        } //else it hasnt been lived yet

        var yearInfo = {
          year: year.year(),
          percentLived: lived,
          isLeapYear: year.isLeapYear(),
          fillStyle: { height: lived + '%'}
        };

        calendarYears.push(yearInfo);
      }
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="Live Mortal" />
          <DatePicker
            selected={momentBirthday}
            onChange={this.dobChanged} 
            dateFormat="DD MMM YYYY"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="Your Birthday" 
          />
          <p className="age">{ageText}</p>
        </header>
        <div className="life-calendar">
          <div className="calendar-area">
            {calendarYears.map(
              function (yearInfo, index) {
                return <div className="calendar-year" data-year={yearInfo.year}>
                    <div className="calendar-fill" style={yearInfo.fillStyle}></div>
                  </div>;
              }
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;