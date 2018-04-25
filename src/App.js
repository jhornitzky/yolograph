import React, { Component } from 'react';

//import logo from './logo.svg';
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
      for (var i = 0; i < maxAge; i++) {
        //set the current year
        var year = bday.add(1, 'years');

        //calculate year fill day by day
        var lived = 0;
        var daysInYear = (year.isLeapYear ? 366 : 365);
        var daysInYearArray = new Array(daysInYear);

        for (var d = 0; d<daysInYearArray.length; d++) {
          var dayInfo = { dayClassName: "calendar-day"};
          if (moment().year() > year.year()) {
            dayInfo.dayClassName += " lived";
          } else if (moment().year() === year.year()) {
            if (d < year.dayOfYear()) {
              dayInfo.dayClassName += " lived"
            }
          }
          daysInYearArray[d] = dayInfo;
        }

        // FIXME for year based comparison
        // if (moment().year() > year.year()) {
        //   lived = 100;
        // } else if (moment().year() === year.year()) {
        //   lived = (year.dayOfYear() / daysInYear) * 100;
        // } //else it hasnt been lived yet

        //determine if in later years
        var calClassName = "calendar-year";
        if (i === averageLifespan) {
          calClassName += " death";
        } else if (i > averageLifespan) {
          calClassName += " past-life";
        } 

        //create object and return
        var yearInfo = {
          year: year.year(),
          percentLived: lived,
          isLeapYear: year.isLeapYear(),
          daysInYear: daysInYear,
          daysInYearArray: daysInYearArray,
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
              <a href="https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy" rel="noopener noreferrer" target="_blank">Average lifespan: {averageLifespan} years old</a>
            </div>
            <div className="ui simple item">
              <a href="https://en.wikipedia.org/wiki/List_of_the_verified_oldest_people" rel="noopener noreferrer" target="_blank">Record to beat: 122 years old</a>
            </div>
            <div className="ui simple item">
              <p>Based on WHO 2010-2015 data</p>
            </div>
          </div>
        </div>
        <div className="life-calendar">
          <div className="calendar-area">
            {calendarYears.map((yearInfo, yIndex) => {
              return <div className={yearInfo.calendarClassName} title={yearInfo.year} key={yIndex}>
                  <div className="calendar-day-holder">
                    {yearInfo.daysInYearArray.map((dayInfo, dIndex) => {
                      return <div key={dIndex} className={dayInfo.dayClassName}></div>
                    })}
                  </div>
                </div>;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;