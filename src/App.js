import React, { Component } from 'react';

import logo from './logo.svg';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import './App.css'; 
import './semantic.css';

const storageKey = "livemortal";
const averageLifespan = 70;
const maxAge = 125;

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
    var yearsText = this.state.age > 0 ? this.state.age + ' years old' : '';
    var yearsPercentage = this.state.age > 0 ? Math.floor((this.state.age / averageLifespan) * 100) + '% lived' : '';

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

        var calClassName = "calendar-year";
        if (i === averageLifespan) {
          calClassName += " death";
        } else if (i > averageLifespan) {
          calClassName += " past-life";
        } 

        var yearInfo = {
          year: year.year(),
          percentLived: lived,
          isLeapYear: year.isLeapYear(),
          fillStyle: { height: lived + '%'},
          calendarClassName: calClassName
        };

        calendarYears.push(yearInfo);
      }
    }

    return (
      <div className="App">
        <div className="ui fixed inverted menu">
          <div className="ui fluid container">
            <a href="#" className="header item">
              YOLOGraph
            </a>
            <div className="ui item">
              <DatePicker
                selected={momentBirthday}
                onChange={this.dobChanged}
                dateFormat="DD MMM YYYY"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Your Birthday"
                className="your-age"
              />
            </div>
            <div className="ui simple item">
              <p>{yearsText}</p>
            </div>
            <div className="ui simple item">
              <p>{yearsPercentage}</p>
            </div>
            <div className="ui simple item">
              <a href="https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy" target="_blank">Average lifespan: {averageLifespan} years old</a>
            </div>
            <div className="ui simple item">
              <a href="https://en.wikipedia.org/wiki/List_of_the_verified_oldest_people" target="_blank">Record to beat: 122 years old</a>
            </div>
            <div className="ui simple item">
              <p>Last updated 25 April 2018</p>
            </div>
          </div>
        </div>
        <div className="life-calendar">
          <div className="calendar-area">
            {calendarYears.map(
              function (yearInfo, index) {
                return <div className={yearInfo.calendarClassName} title={yearInfo.year} key={index}>
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